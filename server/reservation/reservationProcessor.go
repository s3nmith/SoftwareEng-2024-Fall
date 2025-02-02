package reservation

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"hotel_reservation/auth"
	"hotel_reservation/room"
	"hotel_reservation/utils"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/antonlindstrom/pgstore"
)

func SearchRoom(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	//use body of request sent from frontend to extract user requirements into a room struct
	//query database for rooms satisfying the requirements
	//return json with data if there are matching rooms
	return func(w http.ResponseWriter, r *http.Request) {
		if ok, _ := auth.IsAuthorizedAsUser(store, r); !ok {
			http.Error(w, `{"error":"Please login to reserve rooms."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		var requiredRoom room.RoomCriteria

		requiredRoom.RoomType = r.URL.Query().Get("room_type")
		requiredRoom.Capacity, _ = strconv.Atoi(r.URL.Query().Get("capacity"))
		requiredRoom.MaxPPN, _ = strconv.Atoi(r.URL.Query().Get("max_ppn"))
		requiredRoom.CheckInDate = r.URL.Query().Get("checkIn_date")
		requiredRoom.CheckOutDate = r.URL.Query().Get("checkOut_date")
		//change date strings to time.Time
		format := "2006-01-02"
		checkInDate, err := time.Parse(format, requiredRoom.CheckInDate)
		if err != nil {
			log.Fatal("Error parsing time:", err)
		}
		checkOutDate, err := time.Parse(format, requiredRoom.CheckOutDate)
		if err != nil {
			log.Fatal("Error parsing time:", err)
		}

		//search for roomNumbers satisfying the roomType, capacity and price criteria
		query := `
			SELECT roomNumber
			FROM "Rooms"
			WHERE roomType=$1 AND capacity >= $2 AND PPN <= $3`

		rows, err := db.Query(query, requiredRoom.RoomType, requiredRoom.Capacity, requiredRoom.MaxPPN)
		if err != nil {
			http.Error(w, `{"error":"Failed to query database."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			log.Printf("Query error: %v", err)
			return
		}
		defer rows.Close()

		var roomNumbers []int
		for rows.Next() {
			var roomNumber int
			if err := rows.Scan(&roomNumber); err != nil {
				http.Error(w, `{"error":"Failed to scan database result..."}`, http.StatusInternalServerError)
				log.Printf("Scan error: %v", err)
				return
			}
			roomNumbers = append(roomNumbers, roomNumber)
		}
		if err := rows.Err(); err != nil {
			http.Error(w, `{"error":"Failed to process database result..."}`, http.StatusInternalServerError)
			log.Printf("Rows error: %v", err)
			return
		}
		if len(roomNumbers) == 0 {
			http.Error(w, `{"error":"No Rooms found..."}`, http.StatusNotFound)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		placeholders := make([]string, len(roomNumbers))
		args := make([]interface{}, len(roomNumbers)+2)
		for i, id := range roomNumbers {
			placeholders[i] = fmt.Sprintf("$%d", i+3)
			args[i+2] = id
		}
		// Join placeholders into a string like "$1, $2, $3"
		placeholderStr := strings.Join(placeholders, ", ")

		args[0] = checkInDate
		args[1] = checkOutDate
		//check if the rooms are free for particular check-in and check-out dates
		joinQuery := fmt.Sprintf(`
		SELECT 
		Rooms.roomNumber,
		Rooms.roomType,
		Rooms.capacity,
		Rooms.PPN,
		Rooms.isReserved
		FROM 
			"Reservations" AS r
		INNER JOIN 
			"RoomReservations" rr ON r.reservationNumber = rr.reservationNumber
		RIGHT JOIN 
			"Rooms" AS Rooms ON rr.roomNumber = Rooms.roomNumber
		WHERE 
			((Rooms.isReserved=FALSE)OR NOT($1 <= r.expectedDateOfCheckOut 
			AND r.dateOfCheckIn <= $2))
			AND Rooms.roomNumber IN (%s);`, placeholderStr)

		rows, err = db.Query(joinQuery, args...)
		if err != nil {
			http.Error(w, `{"error":"Failed to execute join query."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			log.Printf("Join query error: %v", err)
			return
		}
		defer rows.Close()

		var rooms []room.Room
		addedRoomNumbers := make(map[int]bool)
		for rows.Next() {
			var room room.Room
			if err := rows.Scan(&room.RoomNumber, &room.RoomType, &room.Capacity, &room.PPN, &room.IsReserved); err != nil {
				http.Error(w, `{"error":"Failed to scan room data..."}`, http.StatusInternalServerError)
				log.Printf("Scan error: %v", err)
				return
			}
			//remove duplicates
			if _, exists := addedRoomNumbers[room.RoomNumber]; !exists {
				rooms = append(rooms, room)
				addedRoomNumbers[room.RoomNumber] = true
			}

		}

		if err := rows.Err(); err != nil {
			http.Error(w, `{"error":"Failed to process query results..."}`, http.StatusInternalServerError)
			log.Printf("Rows error: %v", err)
			return
		}

		if len(rooms) == 0 {
			http.Error(w, `{"error":"No available rooms found."}`, http.StatusNotFound)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		availableRooms := room.AvailableRooms{
			Rooms: rooms,
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(availableRooms); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			log.Printf("Encode error: %v", err)
		}
	}
}

/*
Could add triggers to constrain to correct inputs (but will not for simplicity and assume that requests will only come through the frontend)
This is to prevent attacks using API testing tools

Checks that could be done:
-Date Overlap Checks
-Price Checks
*/
func ConfirmReservation(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	//use body of request sent from frontend to extract user requirements into a reservation struct
	//insert reservation into database with the provided info
	//change availability of rooms
	return func(w http.ResponseWriter, r *http.Request) {
		ok, email := auth.IsAuthorizedAsUser(store, r)
		if !ok {
			http.Error(w, `{"error":"Please login to complete reservation."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		var userID int
		//get user id from user email
		userIdQuery := `SELECT userId from "Users" WHERE email=$1;`

		err := db.QueryRow(userIdQuery, email).Scan(&userID)
		if err != nil {
			http.Error(w, `{"error":"Could not find userId."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		var completedReservation Reservation

		err = json.NewDecoder(r.Body).Decode(&completedReservation)
		if err != nil {
			http.Error(w, `{"error":"Invalid request."}`, http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		completedReservation.ReservationNumber = utils.GenerateRandomNDigits(8)

		//insert reservation data into database
		query := `INSERT INTO "Reservations" (reservationNumber,dateOfReservation,dateOfCheckIn,expectedDateOfCheckout,price,status,methodOfPayment,userId) 
				  VALUES
				  ($1,$2,$3,$4,$5,$6,$7,$8);`
		_, err = db.Exec(query, completedReservation.ReservationNumber,
			completedReservation.DateOfReservation, completedReservation.DateOfCheckIn, completedReservation.ExpectedDateOfCheckOut,
			completedReservation.Price, completedReservation.Status, completedReservation.MethodOfPayment, userID)
		if err != nil {
			log.Printf("Failed to insert reservation: %v", err)
			http.Error(w, `{"error":"Failed to process reservation."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		if len(completedReservation.ReservedRoomNumberList) > 0 {
			//set reserved rooms' isReserved to true if it is false
			placeholders := make([]string, len(completedReservation.ReservedRoomNumberList))
			args := make([]interface{}, len(completedReservation.ReservedRoomNumberList))
			for i, roomNumber := range completedReservation.ReservedRoomNumberList {
				placeholders[i] = fmt.Sprintf("$%d", i+1)
				args[i] = roomNumber
			}
			placeholderStr := strings.Join(placeholders, ", ")

			updateQuery := fmt.Sprintf(`UPDATE "Rooms"
		SET isReserved=true
		WHERE (isReserved=false) AND (roomNumber IN (%s))
		`, placeholderStr)
			_, err = db.Exec(updateQuery, args...)
			if err != nil {
				log.Printf("Failed to update reserved rooms: %v", err)
				http.Error(w, `{"error":"Failed to update reserved rooms."}`, http.StatusInternalServerError)
				w.Header().Set("Content-Type", "application/json")
				return
			}
			//add roomNumbers and reservationNumber into RoomReservation
			insertRoomReservationQuery := `INSERT INTO "RoomReservations" (reservationNumber, roomNumber) VALUES `
			valuePlaceholders := []string{}
			roomReservationArgs := []interface{}{}

			for i, roomNumber := range completedReservation.ReservedRoomNumberList {
				placeholderIndex := i * 2
				valuePlaceholders = append(valuePlaceholders, fmt.Sprintf("($%d, $%d)", placeholderIndex+1, placeholderIndex+2))
				roomReservationArgs = append(roomReservationArgs, completedReservation.ReservationNumber, roomNumber)
			}

			insertRoomReservationQuery += strings.Join(valuePlaceholders, ", ")
			_, err = db.Exec(insertRoomReservationQuery, roomReservationArgs...)
			if err != nil {
				log.Printf("Failed to insert into RoomReservations: %v", err)
				http.Error(w, `{"error":"Failed to update RoomReservations table."}`, http.StatusInternalServerError)
				return
			}
		}
		// Send success response
		response := map[string]interface{}{
			"message":           "Reservation completed successfully.",
			"reservationNumber": completedReservation.ReservationNumber,
		}
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Failed to send response: %v", err)
		}

	}
}

package reservation

import (
	"database/sql"
	"encoding/json"
	"hotel_reservation/auth"
	"hotel_reservation/room"
	"log"
	"net/http"
	"time"

	"github.com/antonlindstrom/pgstore"
)

func SearchRoom(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	//use body of request sent from frontend to extract user requirements into a room struct
	//query database for rooms satisfying the requirements
	//return json with data if there are matching rooms
	return func(w http.ResponseWriter, r *http.Request) {
		if !auth.IsAuthorized(store, r) {
			http.Error(w, `{"error":"Please login to reserve rooms."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		var requiredRoom room.RoomCriteria

		err := json.NewDecoder(r.Body).Decode(&requiredRoom)
		if err != nil {
			http.Error(w, `{"error":"Invalid request."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		query := `
			SELECT roomNumber, roomType, capacity, maxPPN, latestCheckout
			FROM "Rooms"
			WHERE roomType=$1 AND capacity >= $2 AND maxPPN <= $3 AND latestCheckout<$4`

		format := "2006-01-02"
		checkInDate, err := time.Parse(format, requiredRoom.CheckInDate)
		if err != nil {
			log.Fatal("Error parsing time:", err)
		}
		rows, err := db.Query(query, requiredRoom.RoomType, requiredRoom.Capacity, requiredRoom.MaxPPN, checkInDate)
		if err != nil {
			http.Error(w, `{"error":"Failed to query database."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			log.Printf("Query error: %v", err)
			return
		}
		defer rows.Close()

		var rooms []room.Room
		for rows.Next() {
			var room room.Room
			if err := rows.Scan(&room.RoomNumber, &room.RoomType, &room.Capacity, &room.PPN, &room.LatestCheckOutDate); err != nil {
				http.Error(w, `{"error":"Failed to scan database result..."}`, http.StatusInternalServerError)
				log.Printf("Scan error: %v", err)
				return
			}
			rooms = append(rooms, room)
		}
		if err := rows.Err(); err != nil {
			http.Error(w, `{"error":"Failed to process database result..."}`, http.StatusInternalServerError)
			log.Printf("Rows error: %v", err)
			return
		}
		if len(rooms) == 0 {
			http.Error(w, `{"error":"No Rooms found..."}`, http.StatusNotFound)
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

func ConfirmReservation(db *sql.DB) http.HandlerFunc {
	//use body of request sent from frontend to extract user requirements into a reservation struct
	//insert reservation into database with the provided info
	//change availability of rooms
	return func(w http.ResponseWriter, r *http.Request) {
		
	}
}

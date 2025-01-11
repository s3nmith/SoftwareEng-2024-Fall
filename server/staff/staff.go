package staff

import (
	"database/sql"
	"encoding/json"
	"hotel_reservation/auth"
	"hotel_reservation/reservation"
	"net/http"

	"github.com/antonlindstrom/pgstore"
)

func GetReservationByNumber(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Ensure the request is authenticated
		if ok, _ := auth.IsAuthorizedAsStaff(store, r); !ok {
			http.Error(w, `{"error":"Unauthorized access."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		// Get reservation number from query parameters
		reservationNumber := r.URL.Query().Get("reservation_number")
		if reservationNumber == "" {
			http.Error(w, `{"error":"Missing reservation number."}`, http.StatusBadRequest)
			return
		}

		// Query to fetch reservation details
		query := `
			SELECT reservationNumber, dateOfCheckIn, expectedDateOfCheckOut, price, status, methodOfPayment
			FROM "Reservations"
			WHERE reservationNumber = $1
		`

		var reservation reservation.Reservation

		err := db.QueryRow(query, reservationNumber).Scan(
			&reservation.ReservationNumber,
			&reservation.DateOfCheckIn,
			&reservation.ExpectedDateOfCheckOut,
			&reservation.Price,
			&reservation.Status,
			&reservation.MethodOfPayment,
		)

		if err != nil {
			http.Error(w, `{"error":"Reservation not found."}`, http.StatusNotFound)
			return
		}

		// Send the response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(reservation)

	}
}
func GetAllReservations(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Ensure the request is authenticated
		if ok, _ := auth.IsAuthorizedAsStaff(store, r); !ok {
			http.Error(w, `{"error":"Unauthorized access."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		// Query to fetch all reservations
		query := `
			SELECT reservationNumber, dateOfCheckIn, expectedDateOfCheckOut, price, status, methodOfPayment
			FROM "Reservations"
		`

		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch reservations."}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var reservations []reservation.Reservation

		for rows.Next() {
			var reservation reservation.Reservation

			if err := rows.Scan(
				&reservation.ReservationNumber,
				&reservation.DateOfCheckIn,
				&reservation.ExpectedDateOfCheckOut,
				&reservation.Price,
				&reservation.Status,
				&reservation.MethodOfPayment,
			); err != nil {
				http.Error(w, `{"error":"Failed to parse reservations."}`, http.StatusInternalServerError)
				return
			}

			reservations = append(reservations, reservation)
		}

		// Wrap reservations in a JSON object
		response := map[string]interface{}{
			"reservations": reservations,
		}

		// Send the JSON response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

package user

import (
	"database/sql"
	"encoding/json"
	"hotel_reservation/auth"
	"hotel_reservation/reservation"
	"net/http"

	"github.com/antonlindstrom/pgstore"
)

func GetAllUserReservations(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ok, email := auth.IsAuthorizedAsUser(store, r)
		if !ok {
			http.Error(w, `{"error":"Please login to get your reservations."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		w.Header().Set("Content-Type", "application/json")

		var userId string
		err := db.QueryRow(`SELECT userId FROM "Users" WHERE email = $1`, email).Scan(&userId)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch user ID."}`, http.StatusInternalServerError)
			return
		}

		// Query to fetch all reservations for the given userId
		query := `
			SELECT reservationNumber, dateOfCheckIn, expectedDateOfCheckOut, price, status, methodOfPayment
			FROM "Reservations"
			WHERE userId = $1
		`

		rows, err := db.Query(query, userId)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch reservations."}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Create a slice to hold reservations
		var reservations []reservation.Reservation

		// Process query results
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

			// Append each reservation to the slice
			reservations = append(reservations, reservation)
		}

		// Wrap reservations in a JSON object
		response := map[string]interface{}{
			"reservations": reservations,
		}

		// Send the JSON response
		json.NewEncoder(w).Encode(response)
	}
}

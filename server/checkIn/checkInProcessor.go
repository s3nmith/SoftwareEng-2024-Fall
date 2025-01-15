package checkin

import (
	"database/sql"
	"hotel_reservation/auth"
	"net/http"

	"github.com/antonlindstrom/pgstore"
)

func CheckIn(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ok, _ := auth.IsAuthorizedAsStaff(store, r); !ok {
			http.Error(w, `{"error":"Please login as staff to checkout."}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		reservationNumber := r.URL.Query().Get("reservation_number")
		if reservationNumber == "" {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"error":"Reservation number is required."}`, http.StatusBadRequest)
			return
		}

		updateRoomQuery := `
		UPDATE "Rooms"
		SET isReserved = true
		WHERE roomNumber IN (
				SELECT roomNumber
				FROM "RoomReservations"
				WHERE reservationNumber = $1
		) AND isReserved=false;
		`
		if _, err := db.Exec(updateRoomQuery, reservationNumber); err != nil {
			http.Error(w, `{"error":"Failed to update room status."}`, http.StatusInternalServerError)
			return
		}
		updateReservationQuery := `
		UPDATE "Reservations"
		SET status="in_progress"
		WHERE reservationNumber=$1;
		`
		if _, err := db.Exec(updateReservationQuery, reservationNumber); err != nil {
			http.Error(w, `{"error":"Failed to update room status."}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Checkin completed successfully."}`))

	}
}

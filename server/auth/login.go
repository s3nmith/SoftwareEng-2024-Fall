package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/antonlindstrom/pgstore"
	"golang.org/x/crypto/bcrypt"
)

func LoginUser(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		password := r.FormValue("password")

		var hashedPassword string
		var userId int

		err := db.QueryRow(`SELECT hashedPassword,userId FROM "Users" WHERE email = $1`, email).Scan(&hashedPassword, &userId)
		if err != nil {
			http.Error(w, `{"error":"Invalid username or password"}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
		if err != nil {
			http.Error(w, `{"error":"Invalid username or password"}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		session, err := store.Get(r, "ubayashi-session")
		if err != nil {
			http.Error(w, `{"error":"Failed to create session"}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		session.Values["email"] = email
		session.Save(r, w)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]any{
			"message": "Login successful",
			"user_id": userId,
		})
	}
}

func LoginStaff(db *sql.DB, store *pgstore.PGStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		password := r.FormValue("password")

		var hashedPassword string
		var staffId int

		err := db.QueryRow(`SELECT hashedPassword,staffId FROM "Staff" WHERE email = $1`, email).Scan(&hashedPassword, &staffId)
		if err != nil {
			http.Error(w, `{"error":"Invalid username or password"}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
		if err != nil {
			http.Error(w, `{"error":"Invalid username or password"}`, http.StatusUnauthorized)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		session, err := store.Get(r, "ubayashi-session")
		if err != nil {
			http.Error(w, `{"error":"Failed to create session"}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		session.Values["staff_email"] = email
		session.Save(r, w)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]any{
			"message":  "Login successful",
			"staff_id": staffId,
		})
	}
}

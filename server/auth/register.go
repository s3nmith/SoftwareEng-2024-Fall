package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		password := r.FormValue("password")
		username := r.FormValue("username")

		if email == "" || password == "" || username == "" {
			http.Error(w, `{"error":"All fields must be filled..."}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		if err != nil {
			http.Error(w, `{"error":"Error hashing password"}`, http.StatusInternalServerError)
			w.Header().Set("Content-Type", "application/json")
			return
		}
		var userId int
		err = db.QueryRow(`INSERT INTO "Users" (email,hashedPassword,username) VALUES ($1,$2,$3) RETURNING id`, email, string(hashedPassword), username).Scan(&userId)
		if err != nil {
			http.Error(w, `{"error":"Failed to register user (username may already exist)"}`, http.StatusBadRequest)
			w.Header().Set("Content-Type", "application/json")
			return
		}

		response := map[string]int{
			"user_id": userId,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}

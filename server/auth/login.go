package auth

import (
	"database/sql"
	"net/http"
)

func LoginUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
	}
}

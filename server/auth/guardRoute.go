package auth

import (
	"net/http"

	"github.com/antonlindstrom/pgstore"
)

func IsAuthorizedAsUser(store *pgstore.PGStore, r *http.Request) (bool, string) {
	session, _ := store.Get(r, "ubayashi-session")
	email, ok := session.Values["email"].(string)
	return ok, email
}

func IsAuthorizedAsStaff(store *pgstore.PGStore, r *http.Request) (bool, string) {
	session, _ := store.Get(r, "ubayashi-session")
	email, ok := session.Values["staff_email"].(string)
	return ok, email
}

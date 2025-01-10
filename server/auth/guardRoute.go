package auth

import (
	"net/http"

	"github.com/antonlindstrom/pgstore"
)

func IsAuthorizedAsUser(store *pgstore.PGStore, r *http.Request) bool {
	session, _ := store.Get(r, "ubayashi-session")
	_, ok := session.Values["email"].(string)
	return ok
}

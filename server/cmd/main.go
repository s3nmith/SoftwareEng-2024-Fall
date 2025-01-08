package main

import (
	"database/sql"
	"hotel_reservation/auth"
	"hotel_reservation/reservation"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/antonlindstrom/pgstore"
	_ "github.com/lib/pq"
)

func main() {
	// Define the directory to serve files from
	dbConnStr := "postgres://postgres:james123@localhost:5432/postgres?sslmode=disable"
	staticDir := "../../hotel_reservation_frontend/dist"

	staticDir, err := filepath.Abs(staticDir)
	if err != nil {
		log.Fatalf("Failed to get absolute path: %v", err)
	}
	//set up database
	db, err := sql.Open("postgres", dbConnStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		panic(err)
	} else {
		log.Println("Connected to database...")
	}

	createTables(db)

	//set up session store
	store, err := pgstore.NewPGStore(dbConnStr, []byte("super-secret-key"))
	if err != nil {
		log.Fatalf("Failed to initialize session store: %v", err)
	}
	//set up the server
	mux := http.NewServeMux()

	// Set the route to serve files
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Check if the requested file exists
		path := filepath.Join(staticDir, r.URL.Path)
		if _, err := os.Stat(path); err == nil {
			// If the file exists, serve it
			http.ServeFile(w, r, path)
			return
		}

		// If the file doesn't exist, serve index.html
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
	})

	//test routes
	mux.HandleFunc("/api/message/get", getMessage)
	mux.HandleFunc("POST /api/message/post", postMessage)

	//authentication routes
	mux.HandleFunc("POST /api/user/register", auth.RegisterUser(db))
	mux.HandleFunc("POST /api/user/login", auth.LoginUser(db, store))
	//reservation routes
	mux.HandleFunc("/api/reservation/search", reservation.SearchRoom(db, store))
	mux.HandleFunc("/api/reservation/confirm", reservation.ConfirmReservation(db))

	//check-in routes

	//check-out routes

	// Start the server
	port := "8080"
	log.Printf("Starting file server on :%s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
func createTables(db *sql.DB) {
	createUserTable(db)
	createStaffTable(db)
	createReservationTable(db)
	createRoomTable(db)
}
func createUserTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS "Users"(
		id SERIAL PRIMARY KEY,
		email VARCHAR(100) NOT NULL UNIQUE,
		username VARCHAR(100) NOT NULL,
		hashedPassword VARCHAR(100) NOT NULL,
		created timestamp DEFAULT NOW()
 	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}
}

func createStaffTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS "Staff"(
		id SERIAL PRIMARY KEY,
		email VARCHAR(100) NOT NULL,
		hashedPassword VARCHAR(100) NOT NULL,
		created timestamp DEFAULT NOW()
 	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}
}

func createReservationTable(db *sql.DB) {
	query := `
	CREATE TABLE IF NOT EXISTS "Reservations" (
		reservationNumber VARCHAR(8) PRIMARY KEY,
		dateOfReservation TIMESTAMP DEFAULT NOW(),
		dateOfCheckIn DATE NOT NULL,
		expectedDateOfCheckOut DATE NOT NULL,
		price INT NOT NULL,
		status INT NOT NULL,
		methodOfPayment INT NOT NULL
	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}
}

func createRoomTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS "Rooms" (
    	roomNumber INT PRIMARY KEY,
    	roomType VARCHAR(10) NOT NULL CHECK (roomType IN ('single', 'deluxe', 'suite')),
    	capacity INT NOT NULL,
    	maxPPN INT NOT NULL,
    	latestCheckout DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}

}

package main

import (
	"database/sql"
	"fmt"
	"hotel_reservation/auth"
	checkin "hotel_reservation/checkIn"
	checkout "hotel_reservation/checkOut"
	"hotel_reservation/reservation"
	"hotel_reservation/staff"
	"hotel_reservation/user"
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

	createTables(db, false)

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
	setupRoutes(mux, db, store)
	// Start the server
	port := "8080"
	log.Printf("Starting file server on :%s...\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// set up routes
func setupRoutes(mux *http.ServeMux, db *sql.DB, store *pgstore.PGStore) {
	//test routes
	mux.HandleFunc("/api/message/get", getMessage)
	mux.HandleFunc("POST /api/message/post", postMessage)
	//authentication routes
	mux.HandleFunc("POST /api/user/register", auth.RegisterUser(db))
	mux.HandleFunc("POST /api/user/login", auth.LoginUser(db, store))
	mux.HandleFunc("POST /api/staff/register", auth.RegisterStaff(db))
	mux.HandleFunc("POST /api/staff/login", auth.LoginStaff(db, store))
	//reservation routes
	mux.HandleFunc("/api/reservation/search", reservation.SearchRoom(db, store))
	mux.HandleFunc("POST /api/reservation/confirm", reservation.ConfirmReservation(db, store))

	//check-in routes
	mux.HandleFunc("PUT /api/reservation/checkIn", checkin.CheckIn(db, store))
	//check-out routes
	mux.HandleFunc("DELETE /api/reservation/checkOut", checkout.CheckOut(db, store))
	//staff routes
	mux.HandleFunc("/api/staff/reservations", staff.GetAllReservations(db, store))
	mux.HandleFunc("/api/staff/reservation", staff.GetReservationByNumber(db, store))

	//user routes
	mux.HandleFunc("/api/user/reservations", user.GetAllUserReservations(db, store))
}

// database tables
func createTables(db *sql.DB, refresh bool) {
	if refresh {
		dropAllTables(db)
	}
	createUserTable(db)
	createStaffTable(db)
	createReservationTable(db)
	createRoomTable(db)
	createRoomReservationTable(db)
}

func dropAllTables(db *sql.DB) {
	// Query to fetch all table names
	query := `
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`
	rows, err := db.Query(query)
	if err != nil {
		log.Fatalf("Failed to fetch table names: %v", err)
	}
	defer rows.Close()

	// Collect all table names
	var tables []string
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			log.Fatalf("Failed to scan table name: %v", err)
		}
		tables = append(tables, tableName)
	}

	// Drop all tables
	for _, table := range tables {
		stmt := fmt.Sprintf(`DROP TABLE IF EXISTS "%s" CASCADE;`, table)
		_, err := db.Exec(stmt)
		if err != nil {
			log.Printf("Error dropping table %s: %v", table, err)
		} else {
			fmt.Printf("Dropped table: %s\n", table)
		}
	}

	if len(tables) == 0 {
		fmt.Println("No tables found to drop.")
	} else {
		fmt.Println("All tables dropped successfully.")
	}
}
func createUserTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS "Users"(
		userId SERIAL PRIMARY KEY,
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
		staffId SERIAL PRIMARY KEY,
		email VARCHAR(100) NOT NULL,
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

func createReservationTable(db *sql.DB) {
	query := `
	CREATE TABLE IF NOT EXISTS "Reservations" (
		reservationNumber VARCHAR(8) PRIMARY KEY,
		dateOfReservation TIMESTAMP DEFAULT NOW(),
		dateOfCheckIn DATE NOT NULL,
		expectedDateOfCheckOut DATE NOT NULL,
		price INT NOT NULL,
		status VARCHAR(11) NOT NULL CHECK (status IN ('completed', 'in_progress')),
		methodOfPayment VARCHAR(9) NOT NULL CHECK (methodOfPayment IN ('in_person', 'online')),
		userId INT NOT NULL,
		FOREIGN KEY (userId) REFERENCES "Users"(userId)
        ON DELETE CASCADE
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
    	PPN INT NOT NULL,
		isReserved BOOLEAN NOT NULL
	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}

}

// junction tables
func createRoomReservationTable(db *sql.DB) {
	query := `CREATE TABLE IF NOT EXISTS "RoomReservations" (
		roomNumber INT NOT NULL REFERENCES "Rooms"(roomNumber) ON DELETE CASCADE,
		reservationNumber VARCHAR(8) NOT NULL REFERENCES "Reservations"(reservationNumber) ON DELETE CASCADE,
		PRIMARY KEY (roomNumber, reservationNumber)
	);
	`
	_, err := db.Exec(query)

	if err != nil {
		panic(err)
	}
}

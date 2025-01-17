// initializeRooms.go
package main

import (
	"database/sql"
	"fmt"
	"hotel_reservation/room"
	"log"
)

func populateRooms(db *sql.DB) error {
	// Check if Rooms table is already populated
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM "Rooms";`).Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to count rooms: %v", err)
	}

	if count > 0 {
		log.Println("Rooms table already populated. Skipping dummy data insertion.")
		return nil
	}

	// Define dummy rooms
	rooms := []room.Room{
		{RoomNumber: 101, RoomType: "single", Capacity: 1, PPN: 5000, IsReserved: false},
		{RoomNumber: 102, RoomType: "single", Capacity: 1, PPN: 5000, IsReserved: false},
		{RoomNumber: 201, RoomType: "deluxe", Capacity: 2, PPN: 8000, IsReserved: false},
		{RoomNumber: 202, RoomType: "deluxe", Capacity: 2, PPN: 8000, IsReserved: false},
		{RoomNumber: 301, RoomType: "suite", Capacity: 4, PPN: 15000, IsReserved: false},
		{RoomNumber: 302, RoomType: "suite", Capacity: 4, PPN: 15000, IsReserved: false},
		// Add more rooms as needed
	}

	// Prepare the INSERT statement
	stmt, err := db.Prepare(`
        INSERT INTO "Rooms" (roomNumber, roomType, capacity, PPN, isReserved)
        VALUES ($1, $2, $3, $4, $5);
    `)
	if err != nil {
		return fmt.Errorf("failed to prepare insert statement: %v", err)
	}
	defer stmt.Close()

	// Insert each room
	for _, r := range rooms {
		_, err := stmt.Exec(r.RoomNumber, r.RoomType, r.Capacity, r.PPN, r.IsReserved)
		if err != nil {
			return fmt.Errorf("failed to insert room %d: %v", r.RoomNumber, err)
		}
	}

	log.Printf("Successfully inserted %d dummy rooms into the Rooms table.\n", len(rooms))
	return nil
}

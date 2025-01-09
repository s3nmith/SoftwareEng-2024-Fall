package room

type Room struct {
	RoomNumber         int    `json:"room_number"`
	RoomType           string `json:"room_type"`
	Capacity           int    `json:"capacity"`
	PPN                int    `json:"ppn"`
	LatestCheckOutDate string `json:"-"`
}

// corresponds to update room availability
func (r *Room) updateAvailability(isAvailable bool) {
}

// communiction specific structs
type AvailableRooms struct {
	Rooms []Room `json:"rooms"`
}

type RoomCriteria struct {
	RoomType    string `json:"room_type"`
	Capacity    int    `json:"capacity"`
	MaxPPN      int    `json:"max_ppn"`
	CheckInDate string `json:"checkIn_date"`
}

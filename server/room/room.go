package room

type Room struct {
	RoomType    int
	RoomNumber  int
	Capacity    int
	MaxPPN      int
	IsAvailable bool
}

func (r *Room) newRoom() {

}

// corresponds to update room availability
func (r *Room) updateAvailability(isAvaiable bool) {
	r.IsAvailable = isAvaiable
}

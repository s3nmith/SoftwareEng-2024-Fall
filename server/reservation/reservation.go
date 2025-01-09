package reservation

type Reservation struct {
	DateOfReservation      string `json:"date_of_reservation"`
	ReservationNumber      string `json:"reservation_number"`
	DateOfCheckIn          string `json:"checkIn_date"`
	ExpectedDateOfCheckOut string `json:"checkOut_date"`
	Price                  int    `json:"price"`
	Status                 string `json:"status"`
	MethodOfPayment        string `json:"payment_method"`
	ReservedRoomNumberList []int  `json:"reserved_room_numbers"`
}

// corresponds to verify validity
func (r *Reservation) IsValid() {

}

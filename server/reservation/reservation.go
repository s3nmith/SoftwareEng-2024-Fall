package reservation

import (
	"hotel_reservation/room"
)

const (
	RE_COMPLETED  = 0
	RE_CHECKED_IN = 1
)

type Reservation struct {
	DateOfReservation      string
	ReservationNumber      int
	DateOfCheckIn          string
	ExpectedDateOfCheckOut string
	Price                  int
	Status                 int
	MethodOfPayment        int
	ReservedRoomList       []room.Room
}

// corresponds to create()
func (r *Reservation) NewReservation(dateOfReservation string, reservationNumber int, dateOfCheckIn, expectedDateOfCheckOut string, price, methodOfPayment int) *Reservation {
	return &Reservation{
		DateOfReservation:      dateOfReservation,
		ReservationNumber:      reservationNumber,
		DateOfCheckIn:          dateOfCheckIn,
		ExpectedDateOfCheckOut: expectedDateOfCheckOut,
		Price:                  price,
		Status:                 RE_COMPLETED,
		MethodOfPayment:        methodOfPayment,
		ReservedRoomList:       make([]room.Room, 0),
	}
}

// corresponds to verify validity
func (r *Reservation) IsValid() {

}

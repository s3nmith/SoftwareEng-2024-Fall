package reservation

import (
	"net/http"
)

func SearchRoom(w http.ResponseWriter, r *http.Request) {
	//use body of request sent from frontend to extract user requirements into a room struct
	//query database for rooms satisfying the requirements
	//return json with data if there are matching rooms

}

func ConfirmReservation(w http.ResponseWriter, r *http.Request) {
	//use body of request sent from frontend to extract user requirements into a reservation struct
	//insert reservation into database with the provided info
	//change availability of rooms
}

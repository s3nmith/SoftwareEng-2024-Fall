import { useState, useEffect } from 'react';
import '../styles/MyPage.css';
import NavbarMinimalWithReserve from './NavbarMinimalWithReserve';

const MyPage = () => {
  const [reservations, setReservations] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/user/reservations');
        if (response.ok) {
          const data = await response.json();
          setReservations(
            data.reservations.map((reservation, index) => ({
              id: index + 1,
              title: `Reservation #${reservation.reservation_number}`,
              date: new Date(reservation.date_of_reservation).toLocaleDateString(),
              checkIn: new Date(reservation.checkIn_date).toLocaleDateString(),
              checkOut: new Date(reservation.checkOut_date).toLocaleDateString(),
              guests: reservation.reserved_room_numbers ? reservation.reserved_room_numbers.length : 1,
              price: `${reservation.price} JPY`,
              status: reservation.status,
            }))
          );
        } else {
          console.error('Failed to fetch reservations.');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleCancelReservation = (id) => {
    setReservations((prevReservations) =>
      prevReservations.filter((reservation) => reservation.id !== id)
    );
    alert(`Reservation ${id} has been cancelled.`);
  };

  return (
    <div>
      <NavbarMinimalWithReserve />
      <div className="mypage">
        <h1>My Reservations</h1>
        <div className="reservations">
          {reservations.map((reservation) => (
            <div
              className={`reservation-card ${
                expandedCard === reservation.id ? 'expanded' : ''
              }`}
              key={reservation.id}
              onClick={() => handleCardClick(reservation.id)}
            >
              <div className="reservation-details">
                <h2>{reservation.title}</h2>
                <p>Date of Reservation: {reservation.date}</p>
              </div>
              <div
                className={`expanded-details ${
                  expandedCard === reservation.id ? 'show' : ''
                }`}
              >
                <p>Check-in: {reservation.checkIn}</p>
                <p>Check-out: {reservation.checkOut}</p>
                <p>Guests: {reservation.guests}</p>
                <p>Price: {reservation.price}</p>
                <p>Status: {reservation.status}</p>
                <button
                  className="cancel-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelReservation(reservation.id);
                  }}
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

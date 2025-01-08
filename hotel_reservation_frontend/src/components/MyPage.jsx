import { useState } from 'react';
import '../styles/MyPage.css';
import NavbarMinimalWithReserve from './NavbarMinimalWithReserve';
import oceanViewImage from '../assets/hotel-single.png';
import deluxeRoomImage from '../assets/hotel-deluxe.jpg';
import gardenVillaImage from '../assets/hotel-suite.jpg';

const MyPage = () => {
  const reservations = [
    {
      id: 1,
      title: 'Garden Villa Single',
      date: '2025-01-15',
      guests: 2,
      checkIn: '2025-01-14',
      checkOut: '2025-01-16',
      price: '$400',
      image: oceanViewImage,
    },
    {
      id: 2,
      title: 'Ocean View Deluxe',
      date: '2025-01-20',
      guests: 1,
      checkIn: '2025-01-19',
      checkOut: '2025-01-21',
      price: '$250',
      image: deluxeRoomImage,
    },
    {
      id: 3,
      title: 'Ocean View Suite',
      date: '2025-01-25',
      guests: 4,
      checkIn: '2025-01-24',
      checkOut: '2025-01-26',
      price: '$600',
      image: gardenVillaImage,
    },
  ];

  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleCancelReservation = (id) => {
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
              <img
                src={reservation.image}
                alt={reservation.title}
                className="reservation-image"
              />
              <div className="reservation-details">
                <h2>{reservation.title}</h2>
                <p>Date: {reservation.date}</p>
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

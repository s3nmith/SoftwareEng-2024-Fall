import { useState, useEffect } from 'react';
import '../styles/Admin.css';
import NavbarMinimal from './NavbarMinimal';

const AdminPage = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/staff/reservations');
        if (response.ok) {
          const data = await response.json();
          setReservations(data.reservations);
          setFilteredReservations(data.reservations);
        } else {
          console.error('Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = reservations.filter((reservation) =>
        reservation.reservation_number.includes(term)
      );
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservations);
    }
  };

  const handleCheckIn = async (reservationNumber) => {
    try {
      const response = await fetch(`/api/reservation/checkIn?reservation_number=${reservationNumber}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setFilteredReservations((prev) =>
          prev.map((reservation) =>
            reservation.reservation_number === reservationNumber
              ? { ...reservation, status: 'in_progress' }
              : reservation
          )
        );
      } else {
        console.error('Failed to check in reservation');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
    }
  };

  const handleCheckOut = async (reservationNumber) => {
    try {
      const response = await fetch(`/api/reservation/checkOut?reservation_number=${reservationNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setFilteredReservations((prev) =>
          prev.filter((reservation) => reservation.reservation_number !== reservationNumber)
        );
      } else {
        console.error('Failed to check out reservation');
      }
    } catch (error) {
      console.error('Error during check-out:', error);
    }
  };

  return (
    <div className="admin-page">
      <NavbarMinimal />
      <div className="admin-container">
        <h1>Check-In Management</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by reservation number"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="reservation-list">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div className="reservation-card" key={reservation.reservation_number}>
                <h2>Reservation #{reservation.reservation_number}</h2>
                <p><strong>Check-In Date:</strong> {new Date(reservation.checkIn_date).toLocaleDateString()}</p>
                <p><strong>Check-Out Date:</strong> {new Date(reservation.checkOut_date).toLocaleDateString()}</p>
                <p><strong>Price:</strong> {reservation.price} JPY</p>
                <p><strong>Status:</strong> {reservation.status === 'completed' ? 'Not Yet Checked-In' : 'Checked In'}</p>
                {reservation.status === 'completed' && (
                  <button
                    className="check-in-button"
                    onClick={() => handleCheckIn(reservation.reservation_number)}
                  >
                    Check-In
                  </button>
                )}
                {reservation.status === 'in_progress' && (
                  <button
                    className="check-out-button"
                    onClick={() => handleCheckOut(reservation.reservation_number)}
                  >
                    Check-Out
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No reservations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

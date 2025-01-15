import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/SelectedRooms.css';

const SelectedRooms = ({ selectedRooms }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const totalPrice = selectedRooms.reduce((sum, room) => sum + room.ppn, 0); 

  const handleProceedToPayment = () => {
    if (!userId) {
      alert('Please login to reserve.');
      navigate('/login');
    } else {
      navigate('/payment', { state: { selectedRooms, totalPrice } }); 
    }
  };

  return (
    <div className={`selected-rooms ${isVisible ? 'active' : ''}`}>
      <h3>Selected Rooms</h3>
      <ul>
        {selectedRooms.map((room) => (
          <li key={room.room_number}>
            Room {room.room_number} - {room.ppn} JPY per night
          </li>
        ))}
      </ul>
      {selectedRooms.length > 0 && (
        <button className="proceed-button" onClick={handleProceedToPayment}>
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

SelectedRooms.propTypes = {
  selectedRooms: PropTypes.arrayOf(
    PropTypes.shape({
      room_number: PropTypes.number.isRequired,
      ppn: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SelectedRooms;

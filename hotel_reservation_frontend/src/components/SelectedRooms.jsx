import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectedRooms.css';

const SelectedRooms = ({ selectedRooms }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); 
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className={`selected-rooms ${isVisible ? 'active' : ''}`}>
      <h3>Selected Rooms</h3>
      <ul>
        {selectedRooms.map((roomNumber) => (
          <li key={roomNumber}>Room {roomNumber}</li>
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
  selectedRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default SelectedRooms;

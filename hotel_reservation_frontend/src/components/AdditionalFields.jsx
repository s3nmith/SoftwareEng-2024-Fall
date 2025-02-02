import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import singleRoomImage from '../assets/hotel-single.jpg';
import deluxeRoomImage from '../assets/hotel-deluxe.jpg';
import suiteRoomImage from '../assets/hotel-suite.jpg';
import { DateContext } from '../context/DateContext';
import { UserContext } from '../context/UserContext';
import '../styles/AdditionalFields.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const AdditionalFields = ({ setAvailableRooms }) => {
  const { checkInDate, checkOutDate } = useContext(DateContext);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [budget, setBudget] = useState('');

  const handleRoomTypeClick = (type) => {
    setRoomType(type);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to search for rooms. Redirecting to login page.');
      navigate('/login');
      return;
    }

    if (!roomType || !numberOfGuests || !budget || !checkInDate || !checkOutDate) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const params = new URLSearchParams({
        room_type: roomType,
        capacity: numberOfGuests,
        max_ppn: budget,
        checkIn_date: format(checkInDate, 'yyyy-MM-dd'),
        checkOut_date: format(checkOutDate, 'yyyy-MM-dd'),
      });
    
      const response = await fetch(`/api/reservation/search?${params.toString()}`, {
        method: 'GET',
      });
    
      if (response.ok) {
        const data = await response.json();
        setAvailableRooms(data.rooms);
      } else if (response.status === 401) {
        alert('Please login to reserve rooms.');
      } else if (response.status === 404) {
        alert('No rooms found.');
      } else {
        alert('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };    

  return (
    <div className="additional-fields-container active">
      <div className="additional-fields">
        <div>
          <label className="additional-fields-text">Number of Guests</label>
          <input
            type="number"
            min="1"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </div>
        <div>
          <label>Select Room Type</label>
          <div className="info-room-cards">
            <div
              className={`room-card ${roomType === 'single' ? 'selected' : ''}`}
              onClick={() => handleRoomTypeClick('single')}
            >
              <img src={singleRoomImage} alt="Single Room" className="room-image-add" />
              <h3>Single</h3>
            </div>
            <div
              className={`room-card ${roomType === 'deluxe' ? 'selected' : ''}`}
              onClick={() => handleRoomTypeClick('deluxe')}
            >
              <img src={deluxeRoomImage} alt="Deluxe Room" className="room-image-add" />
              <h3>Deluxe</h3>
            </div>
            <div
              className={`room-card ${roomType === 'suite' ? 'selected' : ''}`}
              onClick={() => handleRoomTypeClick('suite')}
            >
              <img src={suiteRoomImage} alt="Suite Room" className="room-image-add" />
              <h3>Suite</h3>
            </div>
          </div>
        </div>
        <div>
          <label className="additional-fields-text">Budget Per Night (JPY)</label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget"
          />
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Search
        </button>
      </div>
    </div>
  );
};

AdditionalFields.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  setCurrentMonth: PropTypes.func.isRequired,
  checkInDate: PropTypes.instanceOf(Date),
  setCheckInDate: PropTypes.func.isRequired,
  checkOutDate: PropTypes.instanceOf(Date),
  setCheckOutDate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

AdditionalFields.propTypes = {
  setAvailableRooms: PropTypes.func.isRequired, 
};

export default AdditionalFields;

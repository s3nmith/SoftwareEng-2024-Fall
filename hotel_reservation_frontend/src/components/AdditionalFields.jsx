import { useState, useContext } from 'react';
import singleRoomImage from '../assets/hotel-single.png';
import deluxeRoomImage from '../assets/hotel-deluxe.jpg';
import suiteRoomImage from '../assets/hotel-suite.jpg';
import { DateContext } from '../context/DateContext';
import '../styles/AdditionalFields.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const AdditionalFields = ({ setAvailableRooms }) => {
  const { checkInDate, checkOutDate } = useContext(DateContext);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [budget, setBudget] = useState('');

  const handleRoomTypeClick = (type) => {
    setRoomType(type);
  };

  const handleSubmit = async () => {
    if (!roomType || !numberOfGuests || !budget || !checkInDate || !checkOutDate) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('room_type', roomType);
    formData.append('capacity', numberOfGuests);
    formData.append('max_ppn', budget);
    formData.append('checkIn_date', format(checkInDate, 'yyyy-MM-dd'));
    formData.append('checkOut_date', format(checkOutDate, 'yyyy-MM-dd'));

    try {
      const response = await fetch('/api/reservation/search', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableRooms(data.rooms);
        alert('Rooms found!');
      } else if (response.status === 401) {
        alert('Please login to reserve rooms.');
      } else if (response.status === 404) {
        alert('No rooms found.');
      } else {
        alert('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the server.');
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
              <img src={singleRoomImage} alt="Single Room" className="room-image" />
              <h3>Single</h3>
            </div>
            <div
              className={`room-card ${roomType === 'deluxe' ? 'selected' : ''}`}
              onClick={() => handleRoomTypeClick('deluxe')}
            >
              <img src={deluxeRoomImage} alt="Deluxe Room" className="room-image" />
              <h3>Deluxe</h3>
            </div>
            <div
              className={`room-card ${roomType === 'suite' ? 'selected' : ''}`}
              onClick={() => handleRoomTypeClick('suite')}
            >
              <img src={suiteRoomImage} alt="Suite Room" className="room-image" />
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
          Submit
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

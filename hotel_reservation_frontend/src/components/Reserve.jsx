import { useContext, useState } from 'react';
import NavbarMinimal from './NavbarMinimal';
import Calendar from './Calendar';
import AdditionalFields from './AdditionalFields';
import '../styles/Reserve.css';
import { format } from 'date-fns';
import { DateContext } from '../context/DateContext';

const Reserve = () => {
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useContext(DateContext); 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  const handleSelectClick = () => {
    setShowAdditionalFields(true);
  };

  return (
    <div>
      <NavbarMinimal />
      <div className="date-info">
        <p>
          <strong>Check-in Date:</strong>{' '}
          {checkInDate ? (
            <span className="selected">{format(checkInDate, 'MMM dd, yyyy')}</span>
          ) : (
            <span className="not-selected">Not selected</span>
          )}
        </p>
        <p>
          <strong>Check-out Date:</strong>{' '}
          {checkOutDate ? (
            <span className="selected">{format(checkOutDate, 'MMM dd, yyyy')}</span>
          ) : (
            <span className="not-selected">Not selected</span>
          )}
        </p>
      </div>
      <div className="reserve">
        {!showAdditionalFields ? (
          <div className={`calendar ${showAdditionalFields ? 'hidden' : ''}`}>
            <Calendar
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              disabled={showAdditionalFields}
            />
            <button
              className="select-button"
              onClick={handleSelectClick}
            >
              Select
            </button>
          </div>
        ) : (
          <div className="additional-fields-container active">
            <AdditionalFields setAvailableRooms={setAvailableRooms}/>
          </div>
        )}
      </div>
      {availableRooms.length > 0 && (
        <div className="room-results">
          <h2>Available Rooms</h2>
          {availableRooms.map((room) => (
            <div key={room.room_number}>
              <p>Room Number: {room.room_number}</p>
              <p>Room Type: {room.room_type}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Price per Night: {room.ppn} JPY</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reserve;

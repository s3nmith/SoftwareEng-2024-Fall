import { useContext, useState, useRef } from 'react';
import NavbarMinimal from './NavbarMinimal';
import Calendar from './Calendar';
import AdditionalFields from './AdditionalFields';
import RoomCard from './RoomCardAva';
import SelectedRooms from './SelectedRooms'; 
import '../styles/Reserve.css';
import { format } from 'date-fns';
import { DateContext } from '../context/DateContext';

const Reserve = () => {
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useContext(DateContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]); 
  const roomResultsRef = useRef(null);

  const handleSelectClick = () => {
    setShowAdditionalFields(true);
  };

  const handleRoomsUpdate = (rooms) => {
    setAvailableRooms(rooms);
    if (rooms.length > 0) {
      roomResultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoomSelection = (room) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.some((selectedRoom) => selectedRoom.room_number === room.room_number)
        ? prevSelected.filter((selectedRoom) => selectedRoom.room_number !== room.room_number)
        : [...prevSelected, room]
    );
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
            <AdditionalFields setAvailableRooms={handleRoomsUpdate} />
          </div>
        )}
      </div>
      {availableRooms.length > 0 && (
        <div ref={roomResultsRef} className="room-results">
          <h2 className="available-text">Available Rooms</h2>
          <div className="reserve-room-cards">
            {availableRooms.map((room) => (
              <RoomCard
                key={room.room_number}
                room={room}
                onSelectRoom={handleRoomSelection}
                isSelected={selectedRooms.includes(room.room_number)}
              />
            ))}
          </div>
        </div>
      )}
      {selectedRooms.length > 0 && (
        <SelectedRooms selectedRooms={selectedRooms} /> 
      )}
    </div>
  );
};

export default Reserve;

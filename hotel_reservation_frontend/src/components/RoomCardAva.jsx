import PropTypes from 'prop-types';
import '../styles/RoomCardAva.css';
import single from '../assets/hotel-single.jpg';
import deluxe from '../assets/hotel-deluxe.jpg';
import suite from '../assets/hotel-suite.jpg';

const RoomCard = ({ room, onSelectRoom, isSelected }) => {
  const { room_number, room_type, capacity, ppn } = room;

  const roomImages = {
    single,
    deluxe,
    suite,
  };

  return (
    <div
      className={`rom-card-ava ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectRoom(room_number)} 
    >
      <img
        src={roomImages[room_type.toLowerCase()] || single}
        alt={`Room type: ${room_type}`}
        className="rom-card-ava-image"
      />
      <div className="rom-card-ava-details">
        <h3>Room Number: {room_number}</h3>
        <p><strong>Room Type:</strong> {room_type}</p>
        <p><strong>Capacity:</strong> {capacity} guests</p>
        <p><strong>Price per Night:</strong> {ppn} JPY</p>
      </div>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    room_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    room_type: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    ppn: PropTypes.number.isRequired,
  }).isRequired,
  onSelectRoom: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired, 
};

export default RoomCard;

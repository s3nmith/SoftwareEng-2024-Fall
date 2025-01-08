import '../styles/Rooms.css';
import singleRoomImage from '../assets/hotel-single.png';
import deluxeRoomImage from '../assets/hotel-deluxe.jpg';
import suiteRoomImage from '../assets/hotel-suite.jpg';

const Rooms = () => (
  <section id="rooms" className="rooms">
    <h2>Our Rooms</h2>
    <div className="room-cards">
      <div className="card">
        <img src={singleRoomImage} alt="Single Room" className="room-image" />
        <h3>Single</h3>
      </div>
      <div className="card">
        <img src={deluxeRoomImage} alt="Deluxe Room" className="room-image" />
        <h3>Deluxe</h3>
      </div>
      <div className="card">
        <img src={suiteRoomImage} alt="Suite Room" className="room-image" />
        <h3>Suite</h3>
      </div>
    </div>
  </section>
);

export default Rooms;

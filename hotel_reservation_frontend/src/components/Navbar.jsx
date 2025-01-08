import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Navbar.css';
import hotelLogo from '../assets/hotel-logo.png';

const Navbar = ({ roomsRef, diningRef, aboutRef, contactRef }) => {
  const handleScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={hotelLogo} alt="Hotel Logo" className="hotel-logo" />
        </div>
        <nav className="navbar-links">
          <ul className="nav-links">
            <li><button onClick={() => handleScroll(roomsRef)}>Rooms</button></li>
            <li><button onClick={() => handleScroll(diningRef)}>Dining</button></li>
            <li><button onClick={() => handleScroll(aboutRef)}>About</button></li>
            <li><button onClick={() => handleScroll(contactRef)}>Contact</button></li>
          </ul>
        </nav>
        <div className="navbar-buttons">
          <Link to="/login" className="navbar-btn login-btn">
            <FaUser className="icon" />
            Login
          </Link>
          <button className="navbar-btn reserve-btn">
            <FaCalendarAlt className="icon" />
            Reserve
          </button>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  roomsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  diningRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  navigateToLogin: PropTypes.func.isRequired,
};

export default Navbar;

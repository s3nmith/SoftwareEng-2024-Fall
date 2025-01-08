import PropTypes from 'prop-types';
import '../styles/Navbar.css';
import hotelLogo from '../assets/hotel-logo.png';

const Navbar = ({ roomsRef, diningRef, aboutRef, contactRef }) => {
  const handleScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="container">
	  	<img src={hotelLogo} alt="Hotel Logo" className="hotel-logo" />
        <nav>
          <ul className="nav-links">
            <li><button onClick={() => handleScroll(roomsRef)}>Rooms</button></li>
            <li><button onClick={() => handleScroll(diningRef)}>Dining</button></li>
            <li><button onClick={() => handleScroll(aboutRef)}>About</button></li>
            <li><button onClick={() => handleScroll(contactRef)}>Contact</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// PropTypes validation
Navbar.propTypes = {
  roomsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  diningRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default Navbar;

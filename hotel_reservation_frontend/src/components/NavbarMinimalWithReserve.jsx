import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import '../styles/NavbarMinimalWithReserve.css';
import hotelLogo from '../assets/hotel-logo.png';

const NavbarMinimalWithReserve = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); 
  };

  const handleReserveClick = () => {
    navigate('/reserve');
  };

  return (
    <header className="navbar-minimal">
      <div className="navbar-minimal-container">
        <div className="logo-container">
          <img
            src={hotelLogo}
            alt="Hotel Logo"
            className="navbar-logo"
            onClick={handleLogoClick} 
          />
        </div>
        <div className="reserve-container">
          <button className="navbar-btn reserve-btn" onClick={handleReserveClick}>
            <FaCalendarAlt className="icon" />
            Reserve
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarMinimalWithReserve;

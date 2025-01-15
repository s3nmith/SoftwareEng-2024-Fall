import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/NavbarMinimalWithReserve.css';
import hotelLogo from '../assets/hotel-logo.png';

const NavbarMinimalWithReserve = () => {
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);

  const handleLogoClick = () => {
    navigate('/'); 
  };

  const handleReserveClick = () => {
    navigate('/reserve');
  };

  const handleSignOut = () => {
    setUserId(null);
    localStorage.removeItem('user_id');
    navigate('/');
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
          <button className="navbar-btn signout-btn" onClick={handleSignOut}>
            <FaSignOutAlt className="icon" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarMinimalWithReserve;

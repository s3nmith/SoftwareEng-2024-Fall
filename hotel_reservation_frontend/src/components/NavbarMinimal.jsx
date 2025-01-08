import { useNavigate } from 'react-router-dom';
import '../styles/NavbarMinimal.css';
import hotelLogo from '../assets/hotel-logo.png';

const NavbarMinimal = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
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
      </div>
    </header>
  );
};

export default NavbarMinimal;

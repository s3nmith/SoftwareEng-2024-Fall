import PropTypes from 'prop-types';
import '../styles/Login.css';
import hotelLogo from '../assets/hotel-logo.png';

const Login = () => (
  <div className="login-page">
    <header className="login-appbar">
      <img src={hotelLogo} alt="Hotel Logo" className="login-logo" />
    </header>
    <div className="login-content">
      <h1>Login / Registration</h1>
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <label htmlFor="email">E-mail Address</label>
          <input type="email" id="email" placeholder="email@mail.com" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="******" required />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  </div>
);

Login.propTypes = {
  navigateToHome: PropTypes.func.isRequired,
};

export default Login;

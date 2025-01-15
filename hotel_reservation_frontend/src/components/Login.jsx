import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Login.css';
import NavbarMinimal from './NavbarMinimal';

const Login = () => {
  const [openSection, setOpenSection] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);

  const handleRegisterSubmit = async (e, isStaff = false) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData(e.target);
      const response = await fetch(isStaff ? '/api/staff/register' : '/api/user/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user_id', data.user_id);
        setUserId(data.user_id);
        alert('Registration Successful');
        navigate('/login');
        window.location.reload();
      } else {
        setError(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginSubmit = async (e, isStaff = false) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData(e.target);
      const response = await fetch(isStaff ? '/api/staff/login' : '/api/user/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user_id);
        navigate(isStaff ? '/admin' : '/mypage');
      } else {
        setError(data.error || 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="login-page">
      <NavbarMinimal />
      <div className="login-content">
        <h1>Login / Registration</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="collapsible-box">
          <div className="box-header" onClick={() => toggleSection('login')}>
            <h2 className="header-text">User Login</h2>
            <span className={`icon ${openSection === 'login' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'login' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={(e) => handleLoginSubmit(e)}>
                <label htmlFor="email">E-mail Address</label>
                <input type="email" id="email" name="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="******" required />
                <button type="submit" className="login-button">Login</button>
              </form>
            </div>
          </div>
        </div>

        <div className="collapsible-box">
          <div className="box-header" onClick={() => toggleSection('register')}>
            <h2 className="header-text">User Registration</h2>
            <span className={`icon ${openSection === 'register' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'register' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={(e) => handleRegisterSubmit(e)}>
                <label htmlFor="username">Full Name</label>
                <input type="text" name="username" placeholder="Your Name" required />
                <label htmlFor="email">E-mail Address</label>
                <input type="email" name="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="******" required />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" name="confirm-password" placeholder="******" required />
                <button type="submit" className="login-button">Register</button>
              </form>
            </div>
          </div>
        </div>

        <div className="collapsible-box">
          <div className="box-header" onClick={() => toggleSection('staff-login')}>
            <h2 className="header-text">Staff Login</h2>
            <span className={`icon ${openSection === 'staff-login' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'staff-login' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={(e) => handleLoginSubmit(e, true)}>
                <label htmlFor="email">E-mail Address</label>
                <input type="email" id="email" name="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="******" required />
                <button type="submit" className="login-button">Login</button>
              </form>
            </div>
          </div>
        </div>

        <div className="collapsible-box">
          <div className="box-header" onClick={() => toggleSection('staff-register')}>
            <h2 className="header-text">Staff Registration</h2>
            <span className={`icon ${openSection === 'staff-register' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'staff-register' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={(e) => handleRegisterSubmit(e, true)}>
                <label htmlFor="username">Full Name</label>
                <input type="text" name="username" placeholder="Your Name" required />
                <label htmlFor="email">E-mail Address</label>
                <input type="email" name="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="******" required />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" name="confirm-password" placeholder="******" required />
                <button type="submit" className="login-button">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

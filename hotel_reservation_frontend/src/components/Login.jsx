import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Login.css';
import NavbarMinimal from './NavbarMinimal';

const Login = () => {
  const [openSection, setOpenSection] = useState('login'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Create a FormData object from the form
      const formData = new FormData(e.target);
  
      // Make the fetch request with FormData
      const response = await fetch('/api/user/register', {
        method: 'POST',
        body: formData, // FormData handles encoding as multipart/form-data
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save the user ID in local storage and navigate to the mypage
        localStorage.setItem('user_id', data.user_id);
        navigate('/mypage');
      } else {
        // Handle errors returned by the API
        setError(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      // Create a FormData object from the form
      const formData = new FormData(e.target);
  
      // Make the fetch request with FormData
      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: formData, // FormData handles encoding as multipart/form-data
      });
  
      const data = await response.json();

      setError(data.error || 'Failed to register. Please try again.');
    } catch (error) {
      console.error('Registration error:', error);
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
            <h2 className="header-text">Login</h2>
            <span className={`icon ${openSection === 'login' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'login' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={handleLoginSubmit}>
                <label htmlFor="email">E-mail Address</label>
                <input type="email" id="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="******" required />
                <button type="submit" className="login-button">Login</button>
              </form>
            </div>
          </div>
        </div>

        <div className="collapsible-box">
          <div className="box-header" onClick={() => toggleSection('register')}>
            <h2 className="header-text">Registration</h2>
            <span className={`icon ${openSection === 'register' ? 'open' : 'closed'}`}></span>
          </div>
          <div
            className={`collapsible-content ${
              openSection === 'register' ? 'collapsible-open' : 'collapsible-closed'
            }`}
          >
            <div className="login-box">
              <form onSubmit={handleRegisterSubmit}>
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

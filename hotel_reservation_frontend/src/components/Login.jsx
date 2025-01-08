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

    const formData = new FormData(e.target);
    const user = {
      email: formData.get('email'),
      password: formData.get('password'),
      username: formData.get('full-name'),
    };

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user_id', data.user_id);
        navigate('/mypage');
      } else {
        setError(data.error || 'Failed to register. Please try again.');
      }
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
              <form onSubmit={(e) => e.preventDefault()}>
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
                <label htmlFor="full-name">Full Name</label>
                <input type="text" name="full-name" placeholder="Your Name" required />
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

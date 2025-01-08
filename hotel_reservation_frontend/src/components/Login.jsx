import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Login.css';
import NavbarMinimal from './NavbarMinimal';

const Login = () => {
  const [openSection, setOpenSection] = useState('login'); 
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate('/mypage'); 
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    navigate('/mypage'); 
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section); 
  };

  return (
    <div className="login-page">
       <NavbarMinimal />
      <div className="login-content">
        <h1>Login / Registration</h1>

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
                <label htmlFor="full-name">Full Name</label>
                <input type="text" id="full-name" placeholder="Your Name" required />
                <label htmlFor="email">E-mail Address</label>
                <input type="email" id="email" placeholder="email@mail.com" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="******" required />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" placeholder="******" required />
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

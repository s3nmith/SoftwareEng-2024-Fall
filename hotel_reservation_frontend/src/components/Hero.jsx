import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Hero.css';
import img1 from '../assets/hotel-img1.jpg';
import img2 from '../assets/hotel-img2.jpg';
import img3 from '../assets/hotel-img3.jpg';
import img4 from '../assets/hotel-img4.jpg';
import img5 from '../assets/hotel-img5.jpg';
import img6 from '../assets/hotel-img6.jpg';

const images = [img1, img2, img3, img4, img5, img6];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className="hero-content">
        <h2>Welcome to Paradise</h2>
        <p>Relax, unwind, and experience the beauty of island life.</p>
        <Link to="/login" className="cta-button">
          Book Your Escape
        </Link>
      </div>
    </section>
  );
};

Hero.propTypes = {
  navigateToLogin: PropTypes.func.isRequired, 
};

export default Hero;

import '../styles/About.css';
import hotelHistoryImage from '../assets/hotel-history.jpg';
import sereneGardenImage from '../assets/hotel-garden.jpg';
import exquisiteDiningImage from '../assets/hotel-dining.jpg';

const About = () => (
  <section id="about" className="about">
    <h2>About Us</h2>
    <div className="about-content">
      <div className="about-section">
        <img src={hotelHistoryImage} alt="Our History" className="about-image" />
        <div className="about-text">
          <h3>Our History</h3>
          <p>
            Nestled on a picturesque island, the Ubayashi Hotel has been a symbol of elegance and hospitality since its establishment in 1925. 
            Combining traditional charm with modern luxury, we pride ourselves on providing an unforgettable experience to all who pass through our doors.
          </p>
        </div>
      </div>

      <div className="about-section reverse">
        <img src={sereneGardenImage} alt="Serene Garden" className="about-image" />
        <div className="about-text">
          <h3>Serene Gardens</h3>
          <p>
            Strolling through the hotel grounds, guests can immerse themselves in lush gardens and tranquil pathways. 
            The serene garden is a favorite among visitors, offering a peaceful escape and a connection to the natural world.
          </p>
        </div>
      </div>

      <div className="about-section">
        <img src={exquisiteDiningImage} alt="Exquisite Dining" className="about-image" />
        <div className="about-text">
          <h3>Exquisite Dining</h3>
          <p>
            At the heart of the Ubayashi experience is our dedication to culinary excellence. Our restaurants feature world-class chefs 
            who craft exquisite dishes using the freshest local ingredients. Whether you are savoring delicate seafood or indulging in rich desserts, 
            every meal is an exploration of flavors.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default About;

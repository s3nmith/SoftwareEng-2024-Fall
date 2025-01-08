import '../styles/Dining.css';
import hanaKazeImage from '../assets/hotel-rest1.jpg';
import kogarashiImage from '../assets/hotel-rest2.jpg';
import ginNoSajiImage from '../assets/hotel-rest3.jpg';

const Dining = () => (
  <section id="dining" className="dining">
    <h2>Dining Options</h2>
    <div className="dining-cards">
      <div className="card">
        <img src={hanaKazeImage} alt="Hana Kaze" className="dining-image" />
        <h3>Hana Kaze</h3>
      </div>
      <div className="card">
        <img src={kogarashiImage} alt="Kogarashi" className="dining-image" />
        <h3>Shima Noir</h3>
      </div>
      <div className="card">
        <img src={ginNoSajiImage} alt="Gin no Saji" className="dining-image" />
        <h3>Azure Isle Bistro</h3>
      </div>
    </div>
  </section>
);

export default Dining;

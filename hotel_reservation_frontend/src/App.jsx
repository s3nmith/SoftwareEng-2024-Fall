import { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Rooms from './components/Rooms';
import Dining from './components/Dining';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
  const roomsRef = useRef(null);
  const diningRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <div className="app">
      <Navbar
        roomsRef={roomsRef}
        diningRef={diningRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
      />
      <Hero />
      <div ref={roomsRef}>
        <Rooms />
      </div>
      <div ref={diningRef}>
        <Dining />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default App;

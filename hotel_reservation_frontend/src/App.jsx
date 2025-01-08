import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Rooms from './components/Rooms';
import Dining from './components/Dining';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import MyPage from './components/MyPage';
import Reserve from './components/Reserve';

const App = () => {
  const roomsRef = useRef(null);
  const diningRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <Router>
      <ConditionalNavbar
        roomsRef={roomsRef}
        diningRef={diningRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
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
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/reserve" element={<Reserve />} />
      </Routes>
      <Footer />
    </Router>
  );
};

const ConditionalNavbar = ({ roomsRef, diningRef, aboutRef, contactRef }) => {
  const location = useLocation();

  if ((location.pathname === '/login') || (location.pathname === '/mypage') || (location.pathname === '/reserve')) {
    return null;
  }

  return (
    <Navbar
      roomsRef={roomsRef}
      diningRef={diningRef}
      aboutRef={aboutRef}
      contactRef={contactRef}
    />
  );
};

ConditionalNavbar.propTypes = {
  roomsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  diningRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  contactRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default App;

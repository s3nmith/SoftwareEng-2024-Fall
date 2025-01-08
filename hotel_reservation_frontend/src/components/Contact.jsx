import '../styles/Contact.css';

const Contact = () => (
  <section id="contact" className="contact">
    <h2>Contact Us</h2>
    <form className="contact-form">
      <input type="text" placeholder="Your Name" />
      <input type="email" placeholder="Your Email" />
      <textarea placeholder="Your Message"></textarea>
      <button type="submit">Send</button>
    </form>
  </section>
);

export default Contact;

import { useState } from 'react';
import NavbarMinimal from './NavbarMinimal'; // Import NavbarMinimal
import '../styles/Payment.css';

const Payment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentMethod) {
      console.log(`Payment Method Selected: ${selectedPaymentMethod}`);
      alert(`Proceeding with ${selectedPaymentMethod} payment.`);
    } else {
      alert('Please select a payment method before proceeding.');
    }
  };

  return (
    <div>
      <NavbarMinimal /> {/* Use NavbarMinimal */}
      <div className="payment-container">
        <div className="payment-method">
          <h2>Payment Method</h2>
          <div className="saved-cards">
            <div
              className={`card-option ${selectedPaymentMethod === 'Visa' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('Visa')}
            >
              <div className="card-info">
                <span>Visa ending in 1234</span>
                <span>Expiry: 06/2024</span>
              </div>
              <input
                type="radio"
                name="payment-method"
                checked={selectedPaymentMethod === 'Visa'}
                readOnly
              />
            </div>
            <div
              className={`card-option ${selectedPaymentMethod === 'MasterCard' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('MasterCard')}
            >
              <div className="card-info">
                <span>MasterCard ending in 5678</span>
                <span>Expiry: 12/2025</span>
              </div>
              <input
                type="radio"
                name="payment-method"
                checked={selectedPaymentMethod === 'MasterCard'}
                readOnly
              />
            </div>
            <div
              className={`card-option ${selectedPaymentMethod === 'In-person' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('In-person')}
            >
              <div className="card-info">
                <span>In-person Payment</span>
              </div>
              <input
                type="radio"
                name="payment-method"
                checked={selectedPaymentMethod === 'In-person'}
                readOnly
              />
            </div>
          </div>
          <button className="add-payment-button">Add New Payment</button>
          <div className="policy-section">
            <h3>Cancellation Policy</h3>
            <p>
              Free cancellation before Nov 30. After that, the reservation is non-refundable.{' '}
              <a href="/">Learn more</a>
            </p>
          </div>
          <div className="policy-section">
            <h3>Ground Rules</h3>
            <ul>
              <li>Follow the house rules</li>
              <li>Treat your Hoss home like your own</li>
            </ul>
          </div>
        </div>
        <div className="trip-summary">
          <img src="your-image-url.jpg" alt="Trip Summary" className="trip-image" />
          <div className="summary-details">
            <h3>Your Trip Summary</h3>
            <p>
              <strong>Check-In:</strong> Fri, Dec 01
            </p>
            <p>
              <strong>Check-Out:</strong> Tue, Dec 05
            </p>
            <p>
              <strong>Guests:</strong> 4
            </p>
          </div>
          <div className="pricing-breakdown">
            <h3>Pricing Breakdown</h3>
            <p>
              $30 x 1 night: <span>$30</span>
            </p>
            <p>
              Cleaning Fee: <span>$10</span>
            </p>
            <p>
              Service Fee: <span>$5</span>
            </p>
            <p>
              Total before taxes: <span>$45</span>
            </p>
          </div>
          <button className="confirm-button" onClick={handleConfirmPayment}>
            Confirm & Pay $185
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

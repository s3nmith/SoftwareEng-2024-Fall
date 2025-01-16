import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarMinimal from './NavbarMinimal';
import '../styles/Payment.css';
import { DateContext } from '../context/DateContext';
import img4 from '../assets/hotel-img4.jpg';

const Payment = () => {
  const { checkInDate, checkOutDate } = useContext(DateContext);
  const { state } = useLocation(); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState(null);
  const navigate = useNavigate();

  const { selectedRooms, totalPrice } = state || {};

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'online') {
      setShowAddPayment(true);
    } else {
      setShowAddPayment(false);
    }
  };

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardDetails = {
      cardNumber: formData.get('cardNumber'),
      expiryDate: formData.get('expiryDate'),
      cvv: formData.get('cvv'),
    };
    setNewPaymentMethod(cardDetails);
    setShowAddPayment(false);
    alert('Payment method added successfully.');
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method before proceeding.');
      return;
    }

    if (selectedPaymentMethod === 'online' && !newPaymentMethod) {
      alert('Please add a payment method before proceeding with online payment.');
      return;
    }

    const reservedRoomNumbers = selectedRooms.map((room) => room.room_number);

    const reservationData = {
      date_of_reservation: new Date().toISOString().split('T')[0],
      reservation_number: '',
      checkIn_date: checkInDate ? checkInDate.toISOString().split('T')[0] : null,
      checkOut_date: checkOutDate ? checkOutDate.toISOString().split('T')[0] : null,
      price: totalPrice,
      status: 'completed',
      payment_method: selectedPaymentMethod.toLowerCase().replace(' ', '_'),
      reserved_room_numbers: reservedRoomNumbers,
    };

    try {
      const response = await fetch('/api/reservation/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Reservation completed successfully. Reservation Number: ${data.reservationNumber}`);
        navigate('/mypage');
      } else if (response.status === 401) {
        alert('Please login to complete the reservation.');
      } else {
        alert('An error occurred while processing your reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleCancelPayment = () => {
    alert('Payment cancelled. Redirecting to home page.');
    navigate('/');
  };

  if (!selectedRooms || !totalPrice) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarMinimal />
      <div className="payment-container">
        <div className="payment-method white-background">
          <h2>Payment Method</h2>
          <div className="saved-cards">
            <div
              className={`card-option ${selectedPaymentMethod === 'in_person' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('in_person')}
            >
              <div className="card-info">
                <span>In-Person Payment</span>
              </div>
            </div>
            <div
              className={`card-option ${selectedPaymentMethod === 'online' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('online')}
            >
              <div className="card-info">
                <span>Online Payment</span>
              </div>
            </div>
            {newPaymentMethod && (
              <div
                className={`card-option ${selectedPaymentMethod === 'credit_card' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('credit_card')}
              >
                <div className="card-info">
                  <span>
                    Card ending in {newPaymentMethod.cardNumber.slice(-4)} - Exp: {newPaymentMethod.expiryDate}
                  </span>
                </div>
              </div>
            )}
            {showAddPayment && (
              <div className="add-payment-method">
                <h3>Add Payment Method</h3>
                <form onSubmit={handleAddPaymentMethod}>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" placeholder="Enter card number" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="Enter CVV" required />
                  </div>
                  <button type="submit" className="save-button">
                    Save Payment Method
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="policy-section">
            <h3>Cancellation Policy</h3>
            <p>
              Free cancellation is available up to 48 hours before the check-in date. After that, a cancellation fee equivalent to the cost of one night will be charged.{' '}
              <a href="/">Learn more</a>
            </p>
          </div>
          <div className="policy-section">
            <h3>Hotel Guidelines</h3>
            <ul>
              <li>Check-in starts at 3:00 PM, and check-out is by 11:00 AM.</li>
              <li>Smoking is prohibited in all rooms and indoor areas.</li>
              <li>Please keep noise levels to a minimum between 10:00 PM and 8:00 AM.</li>
              <li>Pets are not allowed unless specified in the reservation details.</li>
              <li>Report any damages to the reception immediately to avoid additional charges.</li>
            </ul>
          </div>
        </div>
        <div className="trip-summary gray-background">
          <img src={img4} alt="Trip Summary" className="trip-image" />
          <div className="summary-details">
            <h3>Your Trip Summary</h3>
            <p>
              <strong>Check-In:</strong> {checkInDate ? checkInDate.toDateString() : 'N/A'}
            </p>
            <p>
              <strong>Check-Out:</strong> {checkOutDate ? checkOutDate.toDateString() : 'N/A'}
            </p>
            <p>
              <strong>Guests:</strong> {selectedRooms.length}
            </p>
          </div>
          <div className="pricing-breakdown">
            <h3>Pricing Breakdown</h3>
            {selectedRooms.map((room) => (
              <p key={room.room_number}>
                Room {room.room_number} ({room.ppn} JPY Per Night): <span>{room.ppn} JPY</span>
              </p>
            ))}
            <p>
              Total: <span>{totalPrice} JPY</span>
            </p>
          </div>
          <button className="confirm-button" onClick={handleConfirmPayment}>
            Confirm & Pay {totalPrice} JPY
          </button>
          <button className="cancel-button" onClick={handleCancelPayment}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarMinimal from './NavbarMinimal';
import '../styles/Payment.css';
import { DateContext } from '../context/DateContext';

const Payment = () => {
  const { checkInDate, checkOutDate } = useContext(DateContext);
  const { state } = useLocation(); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false); 
  const navigate = useNavigate();

  const { selectedRooms, totalPrice } = state || {};

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'online') {
      setShowAddPayment(true);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method before proceeding.');
      return;
    }

    if (selectedPaymentMethod === 'online' && showAddPayment) {
      alert('Please complete adding your payment method.');
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
        {!showAddPayment ? (
          <>
            <h2>Complete Your Payment</h2>
            <div className="payment-method">
              <h3>Select a Payment Method</h3>
              <div className="payment-options">
                <button
                  className={`payment-option-button ${selectedPaymentMethod === 'in_person' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('in_person')}
                >
                  In-Person Payment
                </button>
                <button
                  className={`payment-option-button ${selectedPaymentMethod === 'online' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('online')}
                >
                  Online Payment
                </button>
              </div>
            </div>
            <div className="trip-summary">
              <h3>Your Trip Summary</h3>
              <p><strong>Check-In:</strong> {checkInDate ? checkInDate.toDateString() : 'N/A'}</p>
              <p><strong>Check-Out:</strong> {checkOutDate ? checkOutDate.toDateString() : 'N/A'}</p>
              <p><strong>Selected Rooms:</strong> {selectedRooms.map(room => room.room_number).join(', ')}</p>
              <p><strong>Total Price:</strong> {totalPrice} JPY</p>
            </div>
            <div className="action-buttons">
              <button className="confirm-button" onClick={handleConfirmPayment}>
                Confirm & Pay {totalPrice} JPY
              </button>
              <button className="cancel-button" onClick={handleCancelPayment}>
                Cancel
              </button>
            </div>
            <div className="payment-notes">
              <h3>Important Notes</h3>
              <p>Your reservation will be confirmed upon successful payment.</p>
              <p>Please ensure your payment details are correct before proceeding.</p>
            </div>
          </>
        ) : (
          <div className="add-payment-method">
            <h2>Add Payment Method</h2>
            <p>Please enter your payment details to proceed with online payment.</p>
            <form>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="Enter card number" />
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="Enter CVV" />
              </div>
              <button
                type="button"
                className="save-button"
                onClick={() => setShowAddPayment(false)}
              >
                Save Payment Method
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;

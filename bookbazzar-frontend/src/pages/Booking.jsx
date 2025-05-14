import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Booking.css';

const API = "http://localhost:5117";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.selectedItems || [];
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const quantityDiscount = totalQuantity >= 5 ? 0.05 : 0;

  useEffect(() => {
    // Calculate initial total with quantity discount
    const total = subtotal * (1 - quantityDiscount);
    setFinalTotal(total);
  }, [subtotal, quantityDiscount]);

  const applyCoupon = async () => {
    try {
      setCouponError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API}/api/order/validate-coupon`,
        { code: couponCode },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const couponDiscount = response.data.discount;
      setDiscount(couponDiscount);
      
      // Calculate final total with both discounts
      const total = subtotal * (1 - Math.min(quantityDiscount + couponDiscount, 0.75));
      setFinalTotal(total);
      
      alert(`Coupon applied successfully! ${couponDiscount * 100}% discount`);
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          bookId: item.book.id,
          quantity: item.quantity
        })),
        couponCode: couponCode,
        totalAmount: finalTotal
      };

      const response = await axios.post(
        `${API}/api/order/place`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(`Order placed successfully! Your claim code is: ${response.data.claimCode}`);
      navigate('/ordersummary');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking-container">
      <header className="booking-header">
        <h1>Booking Summary</h1>
      </header>

      <div className="booking-summary">
        <div className="booking-summary-row">
          <span>Total Items:</span>
          <span>{totalQuantity}</span>
        </div>
         <div className="booking-summary-row">
          <span>Quantity Discount ({totalQuantity >= 5 ? '5%' : '0%'}):</span>
          <span>-Rs.{(subtotal * quantityDiscount).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="booking-summary-row">
            <span>Coupon Discount ({discount * 100}%):</span>
            <span>-RS.{(subtotal * discount).toFixed(2)}</span>
          </div>
        )}
        <div className="booking-summary-row booking-grand-total">
          <span>Final Total:</span>
          <span>Rs.{finalTotal.toFixed(2)}</span>
        </div>

        <div className="booking-coupon-wrapper">
          <div className="booking-coupon-input-wrapper">
            <input
              type="text"
              id="coupon-code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError('');
              }}
              placeholder="Coupon code"
              className="booking-coupon-input"
              aria-describedby="coupon-error"
            />
            <button onClick={applyCoupon} className="booking-coupon-btn">Apply</button>
          </div>
          {couponError && (
            <span id="coupon-error" className="booking-coupon-error">{couponError}</span>
          )}
        </div>

        <button
          className="booking-place-order-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Your Order'}
        </button>
      </div>
    </section>
  );
};

export default Booking;
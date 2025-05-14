import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './Cart.css';

const API = "http://localhost:5117";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading } = useCart();
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return;

    const success = await updateQuantity(itemId, newQuantity);
    if (!success) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
    setSelectedBooks(selectedBooks.filter(id => id !== itemId));
  };

  const handleBookSelect = (id) => {
    setSelectedBooks((prev) => 
      prev.includes(id) ? prev.filter(bookId => bookId !== id) : [...prev, id]
    );
  };

   const proceedToCheckout = () => {
  const selectedItems = cartItems.filter(item => selectedBooks.includes(item.id));
  if (selectedItems.length > 0) {
    navigate('/booking', { state: { selectedItems } }); // Pass selected items as state
  } else {
    alert("Please select at least one book to proceed.");
  }
};

  const selectedSubtotal = cartItems
    .filter(item => selectedBooks.includes(item.id))
    .reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <section className="cart-container">
      <header className="cart-header">
        <h1>Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a href="/books" className="cart-continue-shopping">Continue Shopping</a>
        </div>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="cart-item">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(item.id)}
                        onChange={() => handleBookSelect(item.id)}
                      />
                    </td>
                    <td className="cart-td cart-book-info">
                      <img 
                        src={item.book.coverImage ? `${API}/uploads/books/${item.book.coverImage}` : "https://via.placeholder.com/80"}
                        alt={item.book.title} 
                        className="cart-item-image"
                      />
                      <div className="cart-book-details">
                        <span className="cart-book-title">{item.book.title}</span>
                        <span className="cart-book-author">
                          {item.book.author ? `by ${item.book.author}` : 'Unknown Author'}
                        </span>
                      </div>
                    </td>
                    <td className="cart-td">${item.book.price.toFixed(2)}</td>
                    <td className="cart-td">
                      <div className="cart-quantity">
                        <button
                          className="cart-quantity-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="cart-quantity-input"
                          aria-label="Quantity"
                        />
                        <button
                          className="cart-quantity-btn"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-td">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="cart-remove"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.book.title} from cart`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-row">
              <span>Selected Subtotal:</span>
              <span>${selectedSubtotal.toFixed(2)}</span>
            </div>
            <button 
              className="cart-checkout-btn" 
              onClick={proceedToCheckout}
              disabled={selectedBooks.length === 0}
            >
              Proceed with Selected Books
            </button>
          </aside>
        </>
      )}
    </section>
  );
};

export default Cart;

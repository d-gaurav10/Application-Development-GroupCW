// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
const API = 'http://localhost:5117';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(data);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (bookId, quantity = 1) => {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API}/api/cart`,
      { bookId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

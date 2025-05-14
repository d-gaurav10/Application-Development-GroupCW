import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();
const API = "http://localhost:5117";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (bookId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/cart`, 
        { bookId, quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      await fetchCart();
      return true;
    } catch (error) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
      return true;
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API}/api/cart/${itemId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      await fetchCart();
      return true;
    } catch (error) {
      toast.error('Failed to update quantity');
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      removeFromCart,
      updateQuantity,
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
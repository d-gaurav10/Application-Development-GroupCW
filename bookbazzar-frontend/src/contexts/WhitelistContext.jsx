// src/contexts/WhitelistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WhitelistContext = createContext();

export function WhitelistProvider({ children }) {
  const [wishlistedIds, setWishlistedIds] = useState([]);

  // on mount, you might fetch from localStorage or your API
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistedIds(stored);
  }, []);

  const toggleWhitelist = (bookId) => {
    setWishlistedIds(ids => {
      const next = ids.includes(bookId)
        ? ids.filter(id => id !== bookId)
        : [...ids, bookId];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWhitelisted = (bookId) => wishlistedIds.includes(bookId);

  return (
    <WhitelistContext.Provider value={{ toggleWhitelist, isWhitelisted }}>
      {children}
    </WhitelistContext.Provider>
  );
}

export function useWhitelist() {
  return useContext(WhitelistContext);
}

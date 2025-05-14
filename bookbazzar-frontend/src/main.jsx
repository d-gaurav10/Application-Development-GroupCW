import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WhitelistProvider } from './contexts/WhitelistContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <WhitelistProvider>
        <App />
      </WhitelistProvider>
    </CartProvider>
  </BrowserRouter>
);

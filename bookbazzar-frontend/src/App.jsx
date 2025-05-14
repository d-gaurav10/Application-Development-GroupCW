import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './pages/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StaffRoute from './components/StaffRoute';
import StaffDashboard from './pages/StaffDashboard';
import Booking from './pages/Booking';
import OrderSummary from './pages/OrderSummary';
import ProductPage from './pages/ProductPage';
import BookOverview from './components/BookOverview';
import ProfileSettings from './components/ProfileSettings';

const App = () => {
  return (
    <>
      <CartProvider>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductPage />} /> {/* Add this route */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/ordersummary" element={<OrderSummary />} />
            <Route path="/book/:bookId" element={<BookOverview />} />
            <Route path="/profile" element={<ProfileSettings />} />
            
          </Route>

           {/* Staff Routes */}
          <Route element={<StaffRoute />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/pending-orders" element={<StaffDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CartProvider>
    </>
  );
};

export default App;
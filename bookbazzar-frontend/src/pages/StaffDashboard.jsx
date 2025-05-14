import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StaffDashboard.css';

const API = 'http://localhost:5117';

const StaffDashboard = () => {
  const [formData, setFormData] = useState({
    claimCode: '',
    userId: ''  
  });
  const [searchResults, setSearchResults] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch pending orders on mount
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `${API}/api/staff/pending-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPending();
  }, []);

  // generic change handler
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(d => ({ ...d, [name]: value }));
  };

  const handleSearch = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(
      `${API}/api/staff/search?code=${formData.claimCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Update both searchResults and formData
    setSearchResults(data);
    setFormData(prev => ({
      ...prev,
      userId: data.userId // Make sure this matches the backend property
    }));
  } catch (error) {
    toast.error('Order not found');
    setSearchResults(null);
  }
};


 const handleSubmit = async e => {
  e.preventDefault();
  // Add validation
  if (!formData.claimCode || !formData.userId) {
    toast.error('Missing claim code or user ID');
    return;
  }
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const payload = {
      claimCode: formData.claimCode,
      userId: formData.userId
    };
    console.log('Sending payload:', payload); // Add this for debugging

    await axios.post(
      `${API}/api/staff/fulfill-order`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    toast.success('Order fulfilled successfully!');
    setFormData({ claimCode: '', userId: '' });
    setSearchResults(null);
    
    // Refresh pending orders
    const { data } = await axios.get(
      `${API}/api/staff/pending-orders`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingOrders(data);
  } catch (error) {
    console.error('Error details:', error.response?.data); // Add this for debugging
    toast.error(error.response?.data?.message || 'Failed to fulfill order');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="staff-dashboard">
  <div className="container">
    <div className="text-center mb-8">
      <h2>Staff Dashboard</h2>
      <p className="subtitle">Process claims and manage orders</p>
    </div>

    <div className="grid-two">
      {/* Order Processing Form */}
      <div className="card order-form">
        <h3>Process Order</h3>
        <div className="form-group">
          <div className="form-row">
            <input
              name="claimCode"
              type="text"
              placeholder="Enter claim code"
              value={formData.claimCode}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleSearch} className="btn-search">
              Search
            </button>
          </div>
        </div>

       {searchResults && (
  <div className="form-group">
    <h4>Order Details</h4>
    <p>Order #: {searchResults.id}</p>
    <p>Total: ${searchResults.totalAmount.toFixed(2)}</p>
    <p>User ID: {searchResults.userId}</p>
    <p>Status: {searchResults.status}</p>
    <p>Claim Code: {searchResults.claimCode}</p>
    {/* Remove the hidden input as we're storing userId in formData already */}
  </div>
)}

        {searchResults && (
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Mark as Completed'}
          </button>
        )}
      </div>

      {/* Pending Orders List */}
      <div className="card orders-list">
        <h3>Pending Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Claim Code</th>
              <th>Amount</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.claimCode}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
} 

export default StaffDashboard;
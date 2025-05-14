import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import OrderStatusForm from './OrderStatusForm';
import './OrderManagement.css';

const API = "http://localhost:5117";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add token to requests
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await axios.delete(`${API}/api/admin/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error("Failed to delete order");
    }
  };

  const handleUpdateStatus = (order) => {
    setEditingOrder(order);
    setShowStatusForm(true);
  };

  const handleStatusSave = async (updatedOrder) => {
    try {
      const response = await axios.patch(
        `${API}/api/admin/orders/${updatedOrder.id}/status`,
        null,
        { params: { status: updatedOrder.status } }
      );
      setOrders(orders.map(order => 
        order.id === updatedOrder.id ? response.data : order
      ));
      setShowStatusForm(false);
      toast.success("Order status updated successfully");
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-management">
      <div className="order-header">
        <h2>🛍️ Order Management</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.items?.length || 0} items</td>
                <td>Rs. {order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleUpdateStatus(order)}
                    title="Update Status"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(order.id)}
                    title="Delete Order"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showStatusForm && (
        <OrderStatusForm
          order={editingOrder}
          onSave={handleStatusSave}
          onClose={() => setShowStatusForm(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
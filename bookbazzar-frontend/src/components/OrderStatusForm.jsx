import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API = "http://localhost:5117";

const OrderStatusForm = ({ order, onSave, onClose }) => {
  const [status, setStatus] = useState(order ? order.status : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/api/admin/order/${order.id}/status`, null, {
        params: { status }
      });
      toast.success("Order status updated");
      onSave({ ...order, status });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="order-status-form">
      <h3>Update Order Status</h3>
      <form onSubmit={handleSubmit}>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OrderStatusForm;

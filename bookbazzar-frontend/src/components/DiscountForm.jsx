import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API = "http://localhost:5117";

const DiscountForm = ({ onAdd, onClose }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/admin/discount`, {
        code,
        discount: parseFloat(discount)
      });
      toast.success("Discount code added");
      onAdd(response.data);
      onClose();
    } catch (err) {
      toast.error("Failed to add discount");
    }
  };

  return (
    <div className="discount-form">
      <h3>Add Discount</h3>
      <form onSubmit={handleSubmit}>
        <label>Code:</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <label>Discount (%):</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          min="0"
          max="100"
          required
        />
        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;

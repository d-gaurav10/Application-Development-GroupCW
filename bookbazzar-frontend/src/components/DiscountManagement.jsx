import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscountForm from './DiscountForm';
import './DiscountManagement.css';

const API = "http://localhost:5117";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/discounts`);
      setDiscounts(response.data);
    } catch (err) {
      toast.error("Error fetching discounts");
    }
  };

  const handleDelete = async (code) => {
    try {
      await axios.delete(`${API}/api/admin/discount/${code}`);
      setDiscounts(discounts.filter(discount => discount.code !== code));
      toast.success("Discount code deleted");
    } catch (err) {
      toast.error("Failed to delete discount");
    }
  };

  const handleAdd = (newDiscount) => {
    setDiscounts([...discounts, newDiscount]);
    setShowForm(false);
  };

  return (
    <div className="discount-management">
      <h2>Discount Management</h2>
      <button className="btn-add" onClick={() => setShowForm(true)}>Add Discount</button>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.code}>
              <td>{discount.code}</td>
              <td>{discount.discount}</td>
              <td>
                <button onClick={() => handleDelete(discount.code)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <DiscountForm
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default DiscountManagement;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API = "http://localhost:5117";

const UserForm = ({ user, onSave, onClose }) => {
  const [fullName, setFullName] = useState(user ? user.fullName : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [role, setRole] = useState(user ? user.role : 'Member');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (user) {
        // Update existing user
        await axios.put(`${API}/api/admin/users/${user.id}`, {
          fullName,
          email,
          role
        });
        toast.success("User updated successfully");
        onSave({ ...user, fullName, email, role });
      } else {
        // Add new user
        await axios.post(`${API}/api/admin/users`, {
          fullName,
          email,
          password,
          role
        });
        toast.success("User added successfully");
        onSave({ fullName, email, role });
      }
      onClose();
    } catch (err) {
      toast.error("Error saving user");
    }
  };

  return (
    <div className="user-form">
      <h3>{user ? "Edit User" : "Add User"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!user && (
          <>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
          <option value="Staff">Staff</option>
        </select>
        <button type="submit">{user ? "Update" : "Add"}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UserForm;

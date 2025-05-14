import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserForm from './UserForm';
import './UserManagement.css';

const API = "http://localhost:5117";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/users`);
      setUsers(response.data);
    } catch (err) {
      toast.error("Error fetching users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleSave = (user) => {
    if (editingUser) {
      // Update user
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      // Add new user
      setUsers([...users, user]);
    }
    setShowForm(false);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <button className="btn-add" onClick={handleAdd}>Add User</button>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;

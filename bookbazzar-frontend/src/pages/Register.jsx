import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "Member",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:5117/api/auth/register", {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="title">Register New User</h1>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Eg. John Doe"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Re-enter Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Eg. John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>

          <div className="checkbox">
            <input type="checkbox" required /> I agree to Terms and Policy
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="link-text">
          I already have an account, Click here to{" "}
          <Link to="/login">go Login page</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

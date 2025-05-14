import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import logo from '../assets/images/logo.png'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Member',
  })
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  
  if (!agree) {
    setError('You must agree to Terms and Policy');
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match.');
    return;
  }
  
  try {
    // Send the registration data to the backend
    await axios.post('http://localhost:5117/api/auth/register', {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role, // Pass the selected role
    });
    
    alert('Registration successful!');
    navigate('/login');
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
  }
};


  return (
    <div className="register-wrapper">
      <div className="register-box">
        <img src={logo} alt="logo" className="register-logo" />
        <h1 className="register-title">Register New User</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-label">
            <FiMail className="register-icon" />
            Email:
          </label>
          <div className="register-input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="eg. JohnDoe@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <label className="register-label">
            <FiLock className="register-icon" />
            Password:
          </label>
          <div className="register-input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <label className="register-label">
            <FiLock className="register-icon" />
            Re-enter Password:
          </label>
          <div className="register-input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <label className="register-label">
            <FiUser className="register-icon" />
            Full Name:
          </label>
          <div className="register-input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Eg. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <label className="register-label">
            Role:
          </label>
          <div className="register-input-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="register-input"
              required
            >
              <option value="Member">Member</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="register-checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={() => setAgree(a => !a)}
            />
            <label htmlFor="agree">I agree to Terms and Policy</label>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
          {error && <p className="register-error">{error}</p>}
        </form>

        <p className="register-footer">
          I already have an account, Click here to{' '}
          <Link to="/login" className="register-link">
            go Login page
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register;

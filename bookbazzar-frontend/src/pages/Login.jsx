// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiMail, FiLock } from 'react-icons/fi'
import logo from '../assets/images/logo.png'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [savePassword, setSavePassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      // call your API
      const { data } = await axios.post(
        'http://localhost:5117/api/auth/login',
        formData
      )

      // data should be { token: string, userDetails: { id, fullName, email, role } }
      const { token, userDetails } = data
      if (!token) {
        setError('Login failed – no token returned')
        return
      }

      // store JWT
      localStorage.setItem('token', token)

      // get role from the server payload
      const role = userDetails.role

      // redirect based on role
      if (role === 'Admin')      navigate('/admin')
      else if (role === 'Member') navigate('/home')
      else if (role === 'Staff')  navigate('/staff')
      else setError('Unknown role – access denied')

    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src={logo} alt="BookBazzar logo" className="login-logo" />
        <h1 className="login-title">Login or Register</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            <FiMail className="login-icon" />
            Email:
          </label>
          <div className="login-input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <label className="login-label">
            <FiLock className="login-icon" />
            Password:
          </label>
          <div className="login-input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <div className="login-checkbox">
            <input
              type="checkbox"
              id="savePassword"
              checked={savePassword}
              onChange={() => setSavePassword(p => !p)}
            />
            <label htmlFor="savePassword">Save Password</label>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>

        <p className="login-footer">
          Don’t have an account?{' '}
          <Link to="/register" className="login-link">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;

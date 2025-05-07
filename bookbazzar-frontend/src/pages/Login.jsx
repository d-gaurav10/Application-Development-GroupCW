import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5117/api/auth/login", formData);
      const { token } = response.data;

      if (!token) {
        setError("Login failed - no token received");
        return;
      }

      // Store token
      localStorage.setItem("token", token);

      // Decode token and check role
      const decoded = jwt_decode(token);
      const userRole = decoded[`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`];
      
      console.log("User role:", userRole); // Debug log

      // Navigate based on role
      if (userRole === "Admin") {
        navigate("/admin");
      } else if (userRole === "Staff" || userRole === "Member") {
        navigate("/home");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="title">Login or Register</h1>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Eg. johndoe@gmail.com"
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

          <div className="checkbox">
            <input type="checkbox" /> Save Password
          </div>

          <button type="submit">Login</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <div className="link-text">
          I didn’t register yet, Click here to{" "}
          <Link to="/register">Create New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

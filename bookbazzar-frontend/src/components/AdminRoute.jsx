// src/components/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // no token at all → kick back to login
    return <Navigate to="/login" replace />;
  }

  let payload;
  try {
    payload = jwtDecode(token);
  } catch (e) {
    console.error('Invalid JWT:', e);
    return <Navigate to="/login" replace />;
  }

  // JWTs often put role under the full ClaimTypes URI
  const role =
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    payload.role;

  if (role !== 'Admin') {
    // if not an Admin, go to member home
    return <Navigate to="/home" replace />;
  }

  // finally, render whatever nested <Routes> you defined under /admin
  return <Outlet />;
};

export default AdminRoute;

import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const StaffRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;

    if (role !== 'Staff') {
      return <Navigate to="/staff" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
};

export default StaffRoute;
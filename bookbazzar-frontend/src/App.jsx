import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const decoded = jwt_decode(token)
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        setUserRole(role)
      } catch (error) {
        localStorage.removeItem('token')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading) return <div>Loading...</div>
    
    if (!localStorage.getItem('token')) {
      return <Navigate to="/login" replace />
    }

    return allowedRoles.includes(userRole) ? children : <Navigate to="/" replace />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/home" element={
        <ProtectedRoute allowedRoles={['Member', 'Staff']}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        localStorage.getItem('token') ? (
          userRole === 'Admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;
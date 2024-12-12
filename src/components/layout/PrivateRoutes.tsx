import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
  const isLogin = localStorage.getItem('token') && localStorage.getItem('user')

  return isLogin ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes

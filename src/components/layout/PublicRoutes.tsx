import { Navigate, Outlet } from 'react-router-dom'

const PublicRoutes = () => {
  const isLogin = localStorage.getItem('token') && localStorage.getItem('user')

  return isLogin ? <Navigate to="/" /> : <Outlet />
}

export default PublicRoutes

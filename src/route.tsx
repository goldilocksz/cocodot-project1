import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import PrivateRoutes from '@/components/layout/PrivateRoutes'
import Login from '@/pages/login'
import Layout from '@/components/layout'
import Dashboard from '@/pages/dashboard'
import Monitoring from '@/pages/monitoring'
import Users from '@/pages/users'
import Orders from '@/pages/orders'
import TrReport from '@/pages/trreport'
import BlReport from '@/pages/blreport'
import Common from '@/pages/common'
import RouteCom from '@/pages/route'
import Customer from '@/pages/customer'
import GPSMap from '@/pages/GPSMap'
import RouteShare from '@/pages/route.share'
import My from './pages/my'

import NotFound from '@/pages/not-found'
import { useEffect } from 'react'
import request from '@/utils/request'

export default function AppRoute() {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const isAuth = localStorage.getItem('token')

  useEffect(() => {
    const getMenu = async () => {
      if (!isAuth) {
        navigate('/login');
      } else {
        // 특정 경로일 경우 getMenu 요청을 보내지 않음
        if (!pathname.startsWith('/order/') || !pathname.startsWith('/gps/')) {
          const response = await request.post('/webCommon/getMenu', {
            OS_TYPE: 'WEB',
          });
          const findMenu = response.data.find(
            (item: any) => item.SRC_PATH === pathname,
          );

          const findMenu2 = response.data.find(
            (item: any) => item.SRC_PATH === '/orders',
          );

          if (!findMenu && findMenu2) {
            navigate('/orders');
          }

          if (!findMenu && !findMenu2) {
            navigate('/my');
          }
        }
      }
    }

    if (!pathname.startsWith('/order/') && !pathname.startsWith('/gps/')) {
      getMenu();
    }

  }, [pathname, isAuth, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/gps/:id" element={<GPSMap />}></Route>
      <Route path="/order/:id" element={<RouteShare />}></Route>
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/monitoring" element={<Monitoring />}></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/trreport" element={<TrReport />}></Route>
          <Route path="/blreport" element={<BlReport />}></Route>
          <Route path="/common" element={<Common />}></Route>
          <Route path="/route" element={<RouteCom />}></Route>
          <Route path="/customer" element={<Customer />}></Route>
          <Route path="/my" element={<My />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  )
}

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
import My from './pages/my'

import NotFound from '@/pages/not-found'
import { useEffect } from 'react'
import request from './utils/request'

export default function AppRoute() {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const isAuth = localStorage.getItem('token')

  useEffect(() => {
    const getMenu = async () => {
      const response = await request.post('/webCommon/getMenu', {
        OS_TYPE: 'WEB',
      })
      const findMenu = response.data.find(
        (item: any) => item.SRC_PATH === pathname,
      )
      if (!findMenu) {
        navigate('/404')
      } else {
        navigate(response.data[0].SRC_PATH)
      }
    }
    if (isAuth) {
      getMenu()
    }
  }, [pathname, isAuth])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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

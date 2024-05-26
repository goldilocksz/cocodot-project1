import { Routes, Route } from 'react-router-dom'

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

import NotFound from '@/pages/not-found'

export default function AppRoute() {
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
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  )
}

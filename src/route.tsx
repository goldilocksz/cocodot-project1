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
import Customer from '@/pages/customer'
import My from './pages/my'

import NotFound from '@/pages/not-found'
import { useQuery } from '@tanstack/react-query'
import request from './utils/request'

const componentMapping: Record<
  string,
  React.ComponentType<{
    className?: string
  }>
> = {
  Dashboard,
  Monitoring,
  Users: Users,
  Customer,
  Orders,
  'TR Report': TrReport,
  'B/L Report': BlReport,
  Common,
  Route: RouteCom,
  'My page': My,
}

interface MenuItem {
  MENU_ID: string
  MENU_NAME: string
  OS_TYPE: string
  SRC_PATH: string
  MENU_TYPE: string
}

export default function AppRoute() {
  const { data: Menu } = useQuery<MenuItem[]>({
    queryKey: ['getMenu'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getMenu', {
        OS_TYPE: 'WEB',
      })
      return data
    },
  })

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          {Menu?.map((item) => {
            const Component = componentMapping[item.MENU_NAME]
            return (
              <Route
                key={item.MENU_ID}
                path={item.SRC_PATH}
                element={<Component />}
              ></Route>
            )
          })}
        </Route>
      </Route>
    </Routes>
  )
}

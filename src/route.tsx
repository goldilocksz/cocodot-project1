import { Routes, Route, useNavigate } from 'react-router-dom'

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
  MN0510: Dashboard,
  MN0520: Monitoring,
  MN0530: Users,
  MN0540: Customer,
  MN0550: Orders,
  MN0561: TrReport,
  MN0562: BlReport,
  MN0570: Common,
  MN0580: RouteCom,
  MN0590: My,
}

interface MenuItem {
  MENU_ID: string
  MENU_NAME: string
  OS_TYPE: string
  SRC_PATH: string
  MENU_TYPE: string
}

export default function AppRoute() {
  const user = localStorage.getItem('user')
  const navigate = useNavigate()

  const { data: Menu } = useQuery<MenuItem[]>({
    queryKey: ['getMenu'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getMenu', {
        OS_TYPE: 'WEB',
      })
      if (data.length === 0) {
        navigate('/my')
      } else {
        setTimeout(() => {
          navigate(data[0].SRC_PATH)
        }, 500)
      }

      return data
    },
    enabled: !!user,
  })

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          {Menu?.filter((item) => item.SRC_PATH !== '').map((item) => {
            const Component = componentMapping[item.MENU_ID]
            return (
              <Route
                key={item.MENU_ID}
                path={item.SRC_PATH}
                element={
                  Component ? <Component /> : <div>Component not found</div>
                }
              ></Route>
            )
          })}
          <Route path="/my" element={<My />} />
        </Route>
      </Route>
    </Routes>
  )
}

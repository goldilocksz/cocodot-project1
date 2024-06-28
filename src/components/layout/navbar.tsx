import { Link, NavLink } from 'react-router-dom'

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code,
  Database,
  LayoutDashboard,
  Monitor,
  Route,
  Truck,
  Users,
  Contact,
  UserRoundCog,
} from 'lucide-react'

import { useLocation } from 'react-router-dom'
import { cn } from '@/utils/utils'
import { Fragment, useState } from 'react'
import request from '@/utils/request'
import { useQuery } from '@tanstack/react-query'

// const Menu = [
//   {
//     name: 'Dashboard',
//     icon: LayoutDashboard,
//     href: '/',
//   },
//   {
//     name: 'Monitoring',
//     icon: Monitor,
//     href: '/monitoring',
//   },
//   {
//     name: 'Users',
//     icon: Users,
//     href: '/users',
//   },
//   {
//     name: 'Customer',
//     icon: Contact,
//     href: '/customer',
//   },
//   {
//     name: 'Orders',
//     icon: Truck,
//     href: '/orders',
//   },
//   {
//     name: 'Database',
//     icon: Database,
//     href: '#',
//     subMenu: [
//       {
//         name: 'TR Report',
//         href: '/trreport',
//       },
//       {
//         name: 'B/L Report',
//         href: '/blreport',
//       },
//     ],
//   },
//   {
//     name: 'Common',
//     icon: Code,
//     href: '/common',
//   },
//   {
//     name: 'Route',
//     icon: Route,
//     href: '/route',
//   },
//   {
//     name: 'My page',
//     icon: UserRoundCog,
//     href: '/my',
//   },
// ]

// 아이콘 매핑 객체
const iconMapping: Record<
  string,
  React.ComponentType<{
    className?: string
  }>
> = {
  Dashboard: LayoutDashboard,
  Monitoring: Monitor,
  Users: Users,
  Customer: Contact,
  Orders: Truck,
  Database: Database,
  Common: Code,
  Route: Route,
  'My page': UserRoundCog,
}

interface MenuItem {
  MENU_ID: string
  MENU_NAME: string
  OS_TYPE: string
  SRC_PATH: string
}

export default function navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

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
    <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
      {Menu?.filter((item) => item.SRC_PATH !== '').map((item) => {
        const IconComponent = iconMapping[item.MENU_NAME]

        return (
          <NavLink
            key={item.MENU_ID}
            to={item.SRC_PATH}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
              item.SRC_PATH.split('/')[1] ===
                pathname.split('/')[1].split('?')[0] &&
                'bg-zinc-200 text-black',
            )}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {item.MENU_NAME}
          </NavLink>
        )
      })}
    </nav>
  )
}

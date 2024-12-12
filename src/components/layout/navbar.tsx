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
  MENU_TYPE: string
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
      {Menu?.map((item) => {
        const IconComponent = iconMapping[item.MENU_NAME]

        return (
          <Fragment key={item.MENU_ID}>
            <NavLink
              to={item.SRC_PATH === '' ? '#' : item.SRC_PATH}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
                item.SRC_PATH === pathname && 'bg-zinc-200 text-black',
                (item.MENU_ID === 'MN0561' || item.MENU_ID === 'MN0562') &&
                  'pl-10',
              )}
              onClick={() => item.SRC_PATH === '' && setOpen(!open)}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {item.MENU_NAME}
              {item.MENU_TYPE === 'F' && (
                <ChevronDown className="ml-auto h-4 w-4" />
              )}
            </NavLink>
            {/* {item.subMenu?.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'ml-2 flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
                item.href === pathname && 'bg-zinc-200 text-black',
              )}
            >
              {item.href === pathname && <ChevronRight className="h-4 w-4" />}
              {item.name}
            </NavLink>
          ))} */}
          </Fragment>
        )
      })}
    </nav>
  )
}

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

const Menu = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    name: 'Monitoring',
    icon: Monitor,
    href: '/monitoring',
  },
  {
    name: 'Users',
    icon: Users,
    href: '/users',
  },
  {
    name: 'Customer',
    icon: Contact,
    href: '/customer',
  },
  {
    name: 'Orders',
    icon: Truck,
    href: '/orders',
  },
  {
    name: 'Database',
    icon: Database,
    href: '#',
    subMenu: [
      {
        name: 'TR Report',
        href: '/trreport',
      },
      {
        name: 'B/L Report',
        href: '/blreport',
      },
    ],
  },
  {
    name: 'Common',
    icon: Code,
    href: '/common',
  },
  {
    name: 'Route',
    icon: Route,
    href: '/route',
  },
  {
    name: 'My page',
    icon: UserRoundCog,
    href: '/my',
  },
]

export default function navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const { data: menu } = useQuery({
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
      {Menu.map((item) => (
        <Fragment key={item.name}>
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
              item.href.split('/')[1] ===
                pathname.split('/')[1].split('?')[0] &&
                !item.subMenu &&
                'bg-zinc-200 text-black',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
            {item.subMenu &&
              (open ? (
                <ChevronUp className="ml-auto h-4 w-4" />
              ) : (
                <ChevronDown className="ml-auto h-4 w-4" />
              ))}
          </NavLink>
          {item.subMenu?.map((item) => (
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
          ))}
        </Fragment>
      ))}
    </nav>
  )
}

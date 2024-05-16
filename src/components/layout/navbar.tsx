'use client'

import Link from 'next/link'

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code,
  Database,
  Home,
  Monitor,
  Route,
  ShoppingCart,
  Users,
} from 'lucide-react'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Fragment, useState } from 'react'

const Menu = [
  {
    name: 'Dashboard',
    icon: Home,
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
    name: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    name: 'Database',
    icon: Database,
    href: '#',
    subMenu: [
      {
        name: 'Tr Report',
        href: '/database/trreport',
      },
      {
        name: 'Bl Report',
        href: '/database/blreport',
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
]

export default function navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
      {Menu.map((item) => (
        <Fragment key={item.name}>
          <Link
            key={item.name}
            href={item.href}
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
            {item.subMenu ? (
              open ? (
                <ChevronUp className="ml-auto h-4 w-4" />
              ) : (
                <ChevronDown className="ml-auto h-4 w-4" />
              )
            ) : null}
          </Link>
          {item.subMenu?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'ml-2 flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
                item.href === pathname && 'bg-zinc-200 text-black',
              )}
            >
              {item.href === pathname && <ChevronRight className="h-4 w-4" />}
              {item.name}
            </Link>
          ))}
        </Fragment>
      ))}
    </nav>
  )
}

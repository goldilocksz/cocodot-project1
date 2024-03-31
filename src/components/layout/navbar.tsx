'use client'

import Link from 'next/link'

import {
  Home,
  LineChart,
  Package,
  ScrollText,
  ShoppingCart,
  Users,
} from 'lucide-react'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const Menu = [
  {
    name: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    name: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    name: 'Products',
    icon: Package,
    href: '/products',
  },
  {
    name: 'Customers',
    icon: Users,
    href: '/customers',
  },
  {
    name: 'Analytics',
    icon: LineChart,
    href: '/analytics',
  },
  {
    name: 'Post',
    icon: ScrollText,
    href: '/post',
  },
]

export default function navbar() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
      {Menu.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
            item.href.split('/')[1] === pathname.split('/')[1].split('?')[0] &&
              'bg-zinc-200 text-black',
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

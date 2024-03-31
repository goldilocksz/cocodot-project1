import Link from 'next/link'
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ScrollText,
  ShoppingCart,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import Navbar from './navbar'

export default function side() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex flex-1 items-center gap-2 font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <Navbar />
        </div>
      </div>
    </div>
  )
}

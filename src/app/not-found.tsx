'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-xl font-semibold">404 Not Found</div>
      <Link href="/" className={cn(buttonVariants(), 'mt-4')}>
        Home
      </Link>
    </div>
  )
}

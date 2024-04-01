import { buttonVariants } from '@/components/ui/button'
import PostDetail from '@/components/view/post/PostDetail'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
      <div className="flex-middle justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Post Detail</h1>
        <Link href="/post/create" className={cn(buttonVariants())}>
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Link>
      </div>
      <PostDetail />
    </div>
  )
}

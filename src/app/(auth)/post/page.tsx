import { buttonVariants } from '@/components/ui/button'
import PostList from '@/components/view/post/PostList'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function page() {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex-middle justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Post List</h1>
        <Link
          href="/post/create"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          Create
        </Link>
      </div>

      <PostList />
    </section>
  )
}

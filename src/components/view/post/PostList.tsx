'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useSupabase from '@/hooks/useSupabase'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'

export default function PostList() {
  const supabase = useSupabase()

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('post').select('*')
      if (error) throw error
      return data
    },
  })
  return (
    <div>
      {data?.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <Link href={`/post/detail?postId=${post.id}`}>{post.title}</Link>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {dayjs(post.createdAt).format('YYYY-MM-DD hh:mm:ss')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="line-clamp-3">{post.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

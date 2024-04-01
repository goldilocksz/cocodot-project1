'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useSupabase from '@/hooks/useSupabase'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { format } from 'timeago.js'

export default function PostDetail() {
  const params = useSearchParams()
  const supabase = useSupabase()

  if (!params.get('postId')) {
    return null
  }

  const { data: post } = useQuery({
    queryKey: ['posts', params.get('postId') as string],
    queryFn: async ({ queryKey }) => {
      const { data, error } = await supabase
        .from('post')
        .select('*')
        .eq('id', queryKey[1])
        .single()
      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    if (params.get('postId')) {
      supabase.rpc('post_views_increment', {
        id: params.get('postId') as string,
      })
    }
  }, [params.get('postId')])

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{post?.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="">
              {post?.createdAt && format(new Date(post.createdAt))}
            </div>
            <div className="flex items-center gap-1">
              <Eye strokeWidth="1" className="h-4 w-4" />
              {post?.views?.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line">{post?.content}</div>
        </CardContent>
      </Card>
    </div>
  )
}

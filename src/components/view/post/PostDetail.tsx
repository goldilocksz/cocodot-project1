'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useSupabase from '@/hooks/useSupabase'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PostDetail() {
  const params = useSearchParams()
  const supabase = useSupabase()

  const { data: Post } = useQuery({
    queryKey: ['posts', params.get('postId')],
    queryFn: async ({ queryKey }) => {
      if (queryKey[1] === null) return undefined
      const { data, error } = await supabase
        .from('post')
        .select('*')
        .eq('id', queryKey[1])
        .single()
      if (error) throw error
      return data
    },
  })

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{Post?.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {dayjs(Post?.createdAt).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line">{Post?.content}</div>
        </CardContent>
      </Card>
    </div>
  )
}

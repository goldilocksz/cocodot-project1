'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const EditorPostContent = dynamic(
  () => import('@/components/view/post/EditorPostContent'),
  {
    ssr: false,
  },
)

export const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  content: z.string().min(1, {
    message: 'Content is required',
  }),
})

export default function PostCreate() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const supabase = createClient()
    const { data } = await supabase.from('post').insert({
      title: value.title,
      content: 'test \n content',
      user_id: '24502553-591c-45bf-b0ae-36421ddf1278',
    })
    console.log(data)
  }

  return (
    <div className="mt-6 grid gap-6">
      <Card>
        <CardContent className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Post Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <EditorPostContent
                        onChange={(data) => {
                          console.log(JSON.stringify(data))

                          field.onChange(JSON.stringify(data))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="-mx-6 flex items-center justify-center gap-2 border-t py-4">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

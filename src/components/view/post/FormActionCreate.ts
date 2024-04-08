'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export const PostCreateAction = async (form: FormData) => {
  const supabase = createClient()
  const header = headers()
  const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

  console.log(form.get('title'), form.get('content'))

  // const { data, error } = await supabase.from('post').insert({
  //   ip,
  //   user_id: '2d32f132-d42d-4e5a-8195-7d587c9506b2',
  //   title: form.get('title'),
  //   content: form.get('content'),
  // })

  // console.log(data, error)
}

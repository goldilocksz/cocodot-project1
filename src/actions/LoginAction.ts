'use server'

import request from '@/lib/request'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type FormState = {
  message: string
}

export const LoginAction = async (
  prevState: FormState,
  value: FormData,
): Promise<FormState> => {
  const formData = Object.fromEntries(value)

  const data = await request({
    url: '/webCommon/getLoginInfo',
    body: {
      ...formData,
      licenceKey: 'dfoTg05dkQflgpsVdklub',
    },
    server: true,
  })

  if (data.length === 0 || data.error) {
    return {
      message: 'Invalid UserId or Password',
    }
  }

  const cookieStore = cookies()
  cookieStore.set('user', JSON.stringify(data[0]))
  redirect('/')
}

export const LogoutAction = () => {
  const cookieStore = cookies()
  cookieStore.delete('user')
  redirect('/login')
}

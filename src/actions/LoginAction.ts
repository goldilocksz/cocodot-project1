'use server'

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

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/webCommon/getLoginInfo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        licenceKey: 'dfoTg05dkQflgpsVdklub',
      }),
    },
  )
  const data = await response.json()
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

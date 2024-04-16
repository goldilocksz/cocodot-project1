import UserView from '@/components/view/user'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/user/getUserList',
    {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        licenceKey: 'dfoTg05dkQflgpsVdklub',
      }),
    },
  )
  const data = await response.json()
  const users = data.map((user: any, index: number) => ({
    ...user,
    id: index + 1,
  }))

  return <UserView auth={user} users={users} />
}

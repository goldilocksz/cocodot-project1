import UserView from '@/components/view/user'
import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/user/getUserList',
    server: true,
  })

  const users = data.map((user: any, index: number) => ({
    ...user,
    id: index + 1,
  }))

  return <UserView auth={user} users={users} />
}

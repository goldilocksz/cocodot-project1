import Route from '@/components/view/route'
import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/webCommon/getRouteMstList',
    server: true,
  })

  const routes = data.map((route: any, index: number) => ({
    ...route,
    id: index + 1,
  }))

  return <Route auth={user} routes={routes} />
}

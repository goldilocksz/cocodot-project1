import Common from '@/components/view/common'
import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/webCommon/getCommonCodeList',
    server: true,
  })

  const codes = data.map((route: any, index: number) => ({
    ...route,
    id: index + 1,
  }))

  return <Common auth={user} data={codes} />
}

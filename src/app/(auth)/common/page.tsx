import Common from '@/components/pages/common'
import request from '@/utils/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/webCommon/getCommonCodeList',
  })

  const codes = data.map((route: any, index: number) => ({
    ...route,
    id: index + 1,
  }))

  return <Common auth={user} data={codes} />
}

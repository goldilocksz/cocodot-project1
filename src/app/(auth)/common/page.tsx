import Common from '@/components/view/common'
import { User } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as User

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/webCommon/getCommonCodeList',
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
  console.log(data)

  const codes = data.map((route: any, index: number) => ({
    ...route,
    id: index + 1,
  }))

  return <Common data={codes} />
}

import Route from '@/components/view/route'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/webCommon/getRouteMstList',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        S_COMPANY_CODE: user.COMPANY_CODE,
        licenceKey: 'dfoTg05dkQflgpsVdklub',
      }),
    },
  )
  const data = await response.json()
  const routes = data.map((route: any, index: number) => ({
    ...route,
    id: index + 1,
  }))

  return <Route auth={user} routes={routes} />
}

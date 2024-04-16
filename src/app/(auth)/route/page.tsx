import Route from '@/components/view/route'
import { User } from '@/types/data'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as User
  return <Route user={user} />
}

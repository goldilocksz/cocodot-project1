import Login from '@/components/view/login'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function page() {
  const cookieStore = cookies()
  if (cookieStore.get('user')?.value) {
    redirect('/')
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 py-10">
      <Login />
    </div>
  )
}

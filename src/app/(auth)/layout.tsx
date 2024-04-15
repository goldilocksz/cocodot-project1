import Side from '@/components/layout/side'
import Header from '@/components/layout/header'
// import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation'
import Breadcrumb from '@/components/breadcrumb'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@/types/data'

export default function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  if (!cookieStore.get('user')?.value) {
    redirect('/login')
  }
  const user = JSON.parse(cookieStore.get('user')?.value!) as User
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Side />

      <div className="flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  )
}

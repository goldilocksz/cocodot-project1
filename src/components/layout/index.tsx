import Side from '@/components/layout/side'
import Header from '@/components/layout/header'
import Breadcrumb from '@/components/breadcrumb'
import { Outlet } from 'react-router-dom'
import AuthProvider from './authProvider'

export default function layout() {
  return (
    <AuthProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Side />

        <div className="flex flex-col overflow-hidden">
          <Header />
          <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Breadcrumb />
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

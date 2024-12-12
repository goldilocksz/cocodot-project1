import { Link } from 'react-router-dom'
import Navbar from './navbar'

export default function side() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex flex-1 items-center gap-2 font-semibold">
            <img src="/images/logo.png" alt="" className="h-[30px]" />
          </Link>
        </div>
        <div className="flex-1">
          <Navbar />
        </div>
      </div>
    </div>
  )
}

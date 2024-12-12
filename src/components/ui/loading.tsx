import { Loader2 } from 'lucide-react'

export default function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}

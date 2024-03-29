export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 py-10">
      {children}
    </div>
  )
}

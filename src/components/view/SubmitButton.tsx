import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export default function SubmitButton() {
  const { pending, data } = useFormStatus()

  return (
    <div>
      <pre>{JSON.stringify(data && Object.fromEntries(data), null, 2)}</pre>
      <Button type="submit" className="mt-4 w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
    </div>
  )
}

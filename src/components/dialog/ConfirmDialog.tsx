import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Loader2 } from 'lucide-react'

type Props = {
  title: string
  desc: string
  btnText: string
  loading: boolean
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  callback: () => void
}

export default function ConfirmDialog({
  title,
  desc,
  btnText,
  loading,
  isOpen,
  setIsOpen,
  callback,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-center">{desc}</div>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => callback()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {btnText}
          </Button>
          <Button
            className="mr-2"
            onClick={() => setIsOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

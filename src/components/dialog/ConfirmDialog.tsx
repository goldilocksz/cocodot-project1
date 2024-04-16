import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

type Props = {
  title: string
  desc: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  callback: () => void
}

export default function ConfirmDialog({
  title,
  desc,
  isOpen,
  setIsOpen,
  callback,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-center">{desc}</div>
        <DialogFooter className="sm:justify-center">
          <Button variant="destructive" onClick={() => callback()}>
            Delete
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

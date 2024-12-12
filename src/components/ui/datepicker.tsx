import * as React from 'react'
import { cn } from '@/utils/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'

interface Props {
  date: string
  setDate: React.Dispatch<React.SetStateAction<String | undefined>>
}

export function Datepicker({ date, setDate }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {!date ? (
              <span>Pick a date</span>
            ) : (
              dayjs(date).format('YYYY-MM-DD')
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Calendar
            initialFocus
            mode="single"
            selected={date ? dayjs(date, 'YYYYMMDD').toDate() : undefined}
            onSelect={(e) => {
              if (e) {
                setDate(dayjs(e).format('YYYYMMDD'))
              }
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

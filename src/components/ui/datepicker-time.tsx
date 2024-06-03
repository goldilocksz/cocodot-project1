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
import { Input } from './input'

interface Props {
  date: string
  setDate: React.Dispatch<React.SetStateAction<String | undefined>>
}

export function DatepickerTime({ date, setDate }: Props) {
  const [time, setTime] = React.useState<string | undefined>(
    date ? dayjs(date).format('HH:mm') : '00:00',
  )
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
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {!date ? (
              <span>Pick a date</span>
            ) : (
              dayjs(date).format('YYYY-MM-DD') + ' ' + time
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Calendar
            initialFocus
            mode="single"
            selected={date ? dayjs(date).toDate() : undefined}
            onSelect={(e) => setDate(dayjs(e).format('YYYY-MM-DD'))}
          />
          <div className="flex items-center gap-2 p-2">
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block"
            />
            <Button
              onClick={() => {
                setDate(`${dayjs(date).format('YYYY-MM-DD')} ${time}`)
                setOpen(false)
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

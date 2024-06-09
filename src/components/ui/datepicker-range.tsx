import { Dispatch, SetStateAction, useState } from 'react'
import { subMonths, format, startOfWeek, endOfWeek, isSameWeek } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/utils/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  date: DateRange
  setDate: (value: DateRange) => void
}

export function DatepickerRange({ date, setDate }: Props) {
  const [open, setOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: date.from || subMonths(new Date(), 1),
    to: date.to || new Date(),
  })
  const handleDayClick = (day: Date) => {
    setDateRange((prev) => {
      if (prev?.to) {
        return { from: day, to: undefined }
      } else if (prev?.from) {
        if (day < prev.from) {
          return { from: day, to: prev.from }
        } else {
          return { from: prev.from, to: day }
        }
      } else {
        return { from: day, to: undefined }
      }
    })
  }
  const handleApply = () => {
    setDate(dateRange as DateRange)
    setOpen(false)
  }
  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={(is) => setOpen(is)}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'yyyy-MM-dd')} -{' '}
                  {format(date.to, 'yyyy-MM-dd')}
                </>
              ) : (
                format(date.from, 'yyyy-MM-dd')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from || new Date()}
            selected={dateRange}
            onDayClick={handleDayClick}
            min={2}
            className="pb-0"
          />
          <div className="flex items-center justify-center p-3">
            <Button
              size="sm"
              disabled={!dateRange?.from || !dateRange?.to}
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

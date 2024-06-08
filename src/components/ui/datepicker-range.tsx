import { Dispatch, SetStateAction } from 'react'
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
  date?: DateRange
  setDate: Dispatch<
    SetStateAction<
      | {
          from: Date
          to: Date
        }
      | undefined
    >
  >
}

export function DatepickerRange({ date, setDate }: Props) {
  return (
    <div className="grid gap-2">
      <Popover>
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
            modifiers={{
              selected: date as any,
            }}
            onDayClick={(day, modifiers) => {
              if (modifiers.selected) {
                setDate(undefined)
                return
              }
              setDate({
                from: startOfWeek(day),
                to: endOfWeek(day),
              })
            }}
            onWeekNumberClick={(weekNumber, dates) => {
              if (date?.from && isSameWeek(dates[0], date.from)) {
                setDate(undefined)
                return
              }
              setDate({
                from: startOfWeek(dates[0]),
                to: endOfWeek(dates[dates.length - 1]),
              })
            }}
            defaultMonth={date?.from}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

dayjs.extend(utc)

export function dateFormat(date: string) {
  const utcDate = dayjs.utc(date)
  return dayjs(utcDate).format('YYYY-MM-DD HH:mm')
}

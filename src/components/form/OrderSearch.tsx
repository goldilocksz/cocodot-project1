import { Search as SearchIcon } from 'lucide-react'
import { DatepickerRange } from '../ui/datepicker-range'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search } from '@/pages/orders'
import { Dispatch } from 'react'
import LspCode from './LspCode'

export const formSchema = z.object({
  JOB_DATE_FROM: z.string().optional(),
  JOB_DATE_TO: z.string().optional(),
  LSP_CD: z.string(),
  TR_NO: z.string(),
})

interface Props {
  search: Search
  setSearch: Dispatch<Partial<Search>>
}

export default function OrderSearch({ search, setSearch }: Props) {
  const { watch, setValue, register, handleSubmit } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: search,
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setSearch({
      ...(data.JOB_DATE_FROM
        ? { JOB_FROM: dayjs(data.JOB_DATE_FROM).format('YYYYMMDD') }
        : {}),
      ...(data.JOB_DATE_TO
        ? { JOB_TO: dayjs(data.JOB_DATE_TO).format('YYYYMMDD') }
        : {}),
      ...data,
      random: Math.random(),
    })
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DatepickerRange
        date={{
          from: dayjs(watch('JOB_DATE_FROM')).toDate(),
          to: dayjs(watch('JOB_DATE_TO')).toDate(),
        }}
        setDate={(date) => {
          setValue('JOB_DATE_FROM', dayjs(date.from).format('YYYYMMDD'))
          setValue('JOB_DATE_TO', dayjs(date.to).format('YYYYMMDD'))
        }}
      />
      <LspCode className="w-[200px]" {...register('LSP_CD')} />
      <Input className="w-[200px]" placeholder="TR_NO" {...register('TR_NO')} />
      <Button type="submit">
        <SearchIcon className="mr-1 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
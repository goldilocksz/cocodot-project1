import { Search as SearchIcon } from 'lucide-react'
import { DatepickerRange } from '../ui/datepicker-range'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import CneeSelect from './Cnee'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import request from '@/utils/request'
import { TrReport } from '@/types/data'
import { Search } from '@/pages/trreport'
import { Dispatch } from 'react'

export const formSchema = z.object({
  JOB_FROM: z.string().optional(),
  JOB_TO: z.string().optional(),
  TR_NO: z.string(),
  BL_NO: z.string(),
  CNEE_CODE: z.string(),
  URGENT: z.string(),
})

interface Props {
  search: Search
  setSearch: Dispatch<Partial<Search>>
}

export default function ReportSearch({ search, setSearch }: Props) {
  const { watch, setValue, register, handleSubmit } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: search,
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setSearch({
      ...(data.JOB_FROM
        ? { JOB_FROM: dayjs(data.JOB_FROM).format('YYYYMMDD') }
        : {}),
      ...(data.JOB_TO ? { JOB_TO: dayjs(data.JOB_TO).format('YYYYMMDD') } : {}),
      ...data,
    })
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DatepickerRange
        date={{
          from: dayjs(watch('JOB_FROM')).toDate(),
          to: dayjs(watch('JOB_TO')).toDate(),
        }}
        setDate={(date) => {
          setValue('JOB_FROM', dayjs(date.from).format('YYYYMMDD'))
          setValue('JOB_TO', dayjs(date.to).format('YYYYMMDD'))
        }}
      />
      <CneeSelect className="w-[200px]" {...register('CNEE_CODE')} />
      <Input className="w-[200px]" placeholder="TR_NO" {...register('TR_NO')} />
      <Input className="w-[200px]" placeholder="BL_NO" {...register('BL_NO')} />
      <Switch
        id="urgent"
        checked={watch('URGENT') === 'Y'}
        onCheckedChange={(value) => setValue('URGENT', value ? 'Y' : 'N')}
      ></Switch>
      <Label htmlFor="urgent">Urgent</Label>
      <Button type="submit">
        <SearchIcon className="mr-1 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}

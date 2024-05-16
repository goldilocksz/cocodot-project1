import { Search } from 'lucide-react'
import { DatepickerRange } from '../ui/datepicker-range'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import CneeSelect from './Cnee'
import { useForm } from 'react-hook-form'
import { subMonths, format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import request from '@/lib/request'
import { Auth, TrReport } from '@/types/data'

export const formSchema = z.object({
  TR_NO: z.string(),
  BL_NO: z.string(),
  CNEE_CODE: z.string(),
  FROM_DATE: z.date().optional(),
  TO_DATE: z.date().optional(),
  URGENT: z.boolean(),
})

interface Props {
  auth: Auth
  setIsLoading: (value: boolean) => void
  setList: (value: TrReport[]) => void
}

export default function ReportSearch({
  auth,
  setIsLoading,
  setList,
}: {
  auth: Auth
  setIsLoading: (value: boolean) => void
  setList: (value: TrReport[]) => void
}) {
  const { watch, setValue, register, handleSubmit } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TR_NO: '',
      BL_NO: '',
      CNEE_CODE: '',
      FROM_DATE: subMonths(new Date(), 1),
      TO_DATE: new Date(),
      URGENT: false,
    },
  })

  const { mutate: search } = useMutation({
    mutationFn: async (value: any) => {
      setIsLoading(true)
      const response = await request({
        url: '/report/getTRReport',
        body: {
          ...value,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      })
      setIsLoading(false)
      setList(response)
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    search({
      TR_NO: data.TR_NO,
      BL_NO: data.BL_NO,
      CNEE_CODE: data.CNEE_CODE,
      JOB_FRM: data.FROM_DATE ? format(data.FROM_DATE, 'yyyyMMdd') : '',
      JOB_TO: data.TO_DATE ? format(data.TO_DATE, 'yyyyMMdd') : '',
      Urgent: data.URGENT ? 'Y' : 'N',
    })
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input className="w-[200px]" placeholder="TR_NO" {...register('TR_NO')} />
      <Input className="w-[200px]" placeholder="BL_NO" {...register('BL_NO')} />
      <CneeSelect className="w-[200px]" {...register('CNEE_CODE')} />
      <DatepickerRange
        date={{
          from: watch('FROM_DATE'),
          to: watch('TO_DATE'),
        }}
        setDate={(date) => {
          if (!date.from || !date.to) return
          setValue('FROM_DATE', date.from)
          setValue('TO_DATE', date.to)
        }}
      />
      <Switch
        id="urgent"
        checked={watch('URGENT')}
        onCheckedChange={(value) => setValue('URGENT', value)}
      ></Switch>
      <Label htmlFor="urgent">Urgent</Label>
      <Button type="submit">
        <Search className="mr-1 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}

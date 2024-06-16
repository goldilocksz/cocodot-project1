import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, Save, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Order, TrakingInfo } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import NationCode from '../form/NationCode'
import GoogleMap from '../map'
import { omit } from 'radash'
import dayjs from 'dayjs'
import ConfirmDialog from './ConfirmDialog'

type Props = {
  detail: Order | undefined
  open: boolean
  setOpen: (open: boolean) => void
}

const formSchema = z.object({
  JOB_DATE: z.string().optional(),
  TR_NO: z.string().optional(),
  TO_ROUTE_CODE: z.string().optional(),
  LATITUDE: z.number().optional(),
  LONGITUDE: z.number().optional(),
})
type FormKeys = keyof z.infer<typeof formSchema>

const RouteDefault = {
  JOB_DATE: '',
  TR_NO: '',
  TO_ROUTE_CODE: '',
  LATITUDE: undefined,
  LONGITUDE: undefined,
}

export default function RouteInfoControl({ detail, open, setOpen }: Props) {
  const [isConfirm, setIsConfirm] = useState(false)
  const [seq, setSeq] = useState<string>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RouteDefault,
  })

  const {
    data: trakingInfo,
    isPending: isTrakingInfo,
    refetch,
  } = useQuery<TrakingInfo[]>({
    queryKey: ['getTrackingInfo', detail?.TR_NO],
    queryFn: async () => {
      const { data } = await request.post('/order/getTrackingInfo', {
        TR_NO: detail?.TR_NO,
      })
      return data
    },
    enabled: !!detail?.TR_NO && open,
  })

  const { mutate: UpdateRoute, isPending: isUpdateRoute } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request.post('/webCommon/RouteMstSave', value)
      if (!response.data) {
        toast.error('Failed to update route code information')
      } else {
        setOpen(false)
      }
    },
  })

  const { mutate: SaveRoute, isPending: isSaveRoute } = useMutation({
    mutationFn: async () => {
      const response = await request.post('/order/updateTrackingInfo', {
        TR_NO: detail?.TR_NO,
        SEQ: seq,
      })
      if (!response.data) {
        toast.error('Failed to save route code information')
      } else {
        refetch()
      }
    },
  })

  const { mutate: DeleteRoute, isPending: isDeleteRoute } = useMutation({
    mutationFn: async () => {
      const response = await request.post('/order/deleteTrackingInfo', {
        TR_NO: detail?.TR_NO,
        SEQ: seq,
      })
      if (!response.data) {
        toast.error('Failed to delete route code information')
      } else {
        setIsConfirm(false)
        setSeq(undefined)
        refetch()
      }
    },
  })

  useEffect(() => {
    if (detail) {
      form.reset(detail)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('LATITUDE', position.coords.latitude)
          form.setValue('LONGITUDE', position.coords.longitude)
        },
        (error) => {
          toast.error(error.message)
        },
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }, [open])

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    UpdateRoute(value)
  }
  const formSchemaMap = Object.keys(
    omit(formSchema.shape, ['LATITUDE', 'LONGITUDE']),
  ) as FormKeys[]

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Route Information</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="routeForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-3 gap-4"
          >
            {formSchemaMap.map((key: FormKeys) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {key.replace(/_/g, ' ').toLowerCase()}
                      {/* @ts-ignore */}
                      {formSchema.shape[key]?.min && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>

        {form.watch('LATITUDE') && form.watch('LONGITUDE') && (
          <div className="relative h-[300px]">
            <GoogleMap
              lat={form.watch('LATITUDE') as number}
              lng={form.watch('LONGITUDE') as number}
              setPosition={(value) => {
                form.setValue('LATITUDE', value.lat)
                form.setValue('LONGITUDE', value.lng)
              }}
            />
          </div>
        )}

        <div className="h-[300px] overflow-y-auto px-1">
          {trakingInfo?.map((item) => (
            <div
              key={item.SEQ}
              className="relative flex items-center justify-between gap-4 border-l p-4"
            >
              <div>
                <div className="absolute -left-3 top-[18px] bg-white p-2">
                  <div className="h-2 w-2 overflow-hidden rounded-full border border-black"></div>
                </div>
                <div>{item.SEQ_NAME}</div>
                <div className="text-muted-foreground">{item.JOB_DATE}</div>
              </div>
              <div>
                {item.BTN_STATUS === 'D' ? (
                  <Button
                    variant="outline"
                    className="h-auto rounded-full border-0 px-2 text-destructive"
                    onClick={() => {
                      setSeq(item.SEQ)
                      setIsConfirm(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  item.BTN_STATUS === 'S' && (
                    <Button
                      variant="outline"
                      className="h-auto rounded-full border-0 px-2"
                      onClick={() => {
                        setSeq(item.SEQ)
                        SaveRoute()
                      }}
                      disabled={isSaveRoute}
                    >
                      {isSaveRoute ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <ConfirmDialog
          title="Delete Route"
          desc={`Are you sure you want to delete route?`}
          btnText="Delete"
          loading={isDeleteRoute}
          isOpen={isConfirm}
          setIsOpen={setIsConfirm}
          callback={() => DeleteRoute()}
        />

        <DialogFooter className="sm:justify-center">
          <Button type="submit" form="routeForm">
            {isUpdateRoute && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {detail ? 'Update' : 'Add'}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

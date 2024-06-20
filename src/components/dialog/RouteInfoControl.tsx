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
import { omit } from 'radash'
import ConfirmDialog from './ConfirmDialog'
import GoogleMapMulti from '../map/multi'

type Props = {
  detail: Order | undefined
  open: boolean
  setOpen: (open: boolean) => void
}

const formSchema = z.object({
  JOB_DATE: z.string().optional(),
  TR_NO: z.string().optional(),
  FROM_ROUTE_CODE: z.string().optional(),
  TO_ROUTE_CODE: z.string().optional(),
})
type FormKeys = keyof z.infer<typeof formSchema>

const RouteDefault = {
  JOB_DATE: '',
  TR_NO: '',
  FROM_ROUTE_CODE: '',
  TO_ROUTE_CODE: '',
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

  const { mutate: SaveRoute, isPending: isSaveRoute } = useMutation({
    mutationFn: async ({
      SEQ,
      LATITUDE,
      LONGITUDE,
    }: {
      SEQ: string
      LATITUDE: string
      LONGITUDE: string
    }) => {
      const response = await request.post('/order/updateTrackingInfo', {
        TR_NO: detail?.TR_NO,
        SEQ,
        LATITUDE,
        LONGITUDE,
      })
      if (!response.data) {
        toast.error('Failed to save route code information')
      } else {
        refetch()
      }
    },
  })

  const { mutate: DeleteRoute, isPending: isDeleteRoute } = useMutation({
    mutationFn: async (SEQ: string) => {
      const response = await request.post('/order/deleteTrackingInfo', {
        TR_NO: detail?.TR_NO,
        SEQ,
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

  const handleSave = async (SEQ: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          SaveRoute({
            SEQ,
            LATITUDE: position.coords.latitude.toString(),
            LONGITUDE: position.coords.longitude.toString(),
          })
        },
        (error) => {
          toast.error(error.message)
        },
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }
  const formSchemaMap = Object.keys(formSchema.shape) as FormKeys[]

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Route Information</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="routeForm" className="relative grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="JOB_DATE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Date</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TR_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TR No</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TO_ROUTE_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Code</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={`${form.watch('FROM_ROUTE_CODE')}-${form.watch('TO_ROUTE_CODE')}`}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="relative h-[300px]">
          {trakingInfo && trakingInfo?.length > 0 && (
            <GoogleMapMulti data={trakingInfo} />
          )}
        </div>

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
                <div className="text-muted-foreground">{item.CHECK_DATE}</div>
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
                      onClick={() => handleSave(item.SEQ)}
                      type="submit"
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
          callback={() => DeleteRoute(seq!)}
        />
      </DialogContent>
    </Dialog>
  )
}

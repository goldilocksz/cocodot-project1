import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Ban, Play, Sheet, Copy } from 'lucide-react'
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
import GoogleRouteInfo from '../map/routeInfoMap'
import { encodeBase64 } from '@/utils/base64'
import { set } from 'lodash'
import { is } from 'date-fns/locale'
import { saveGPSData } from '@/utils/db'
import { registerSync } from '@/utils/sync'
import { requestNotificationPermission } from '@/utils/notification'

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
  const [isSaveConfirm, setIsSaveConfirm] = useState(false) // Save 확인 대화상자 상태
  const [seq, setSeq] = useState<string>()
  const [intervalId, setIntervalId] = useState<number | null>(null)
  const [gpsStatus, setGpsStatus] = useState<string>('ready')

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
      console.log('data', data)
      return data
    },
    enabled: !!detail?.TR_NO && open,
  })

  const {
    data: fetchedRouteHistory,
    isFetching: isRouteHistory,
    refetch: refetchRouteHistory,
  } = useQuery({
    queryKey: ['getOrderRouteHistory', detail?.TR_NO],
    queryFn: async () => {
      const { data } = await request.post('/order/getOrderRouteHistory', {
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

  // useEffect(() => {
  //   requestNotificationPermission()
  // }, []);

  const handleSave = async (item: TrakingInfo) => {
    setSeq(item.SEQ)
    setIsSaveConfirm(true)

    // GPS API 시작 위치, 종료 위치
    if (trakingInfo) {
      const index = trakingInfo.findIndex((i) => i.SEQ === item.SEQ)
      if (index === 0 || trakingInfo[index - 1].NATION_CD !== trakingInfo[index].NATION_CD) {
        setGpsStatus('start')
      }

      if (index + 1 < trakingInfo.length && trakingInfo[index + 1].NATION_CD !== trakingInfo[index].NATION_CD) {
        setGpsStatus('end')
      }
    }
  }

  // ******************************************

  const gpsControlTest2 = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const data = {
            latutyde: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          }
          await saveGPSData(data);
          await registerSync();

          const id = window.setInterval(async () => {
            refetchRouteHistory();
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const data = {
                    latutyde: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: new Date().toISOString(),
                  }
                  await saveGPSData(data);
                  await registerSync();
                },
                (error) => {
                  toast.error(error.message);
                },
                {
                  enableHighAccuracy: true,
                }
              )
            } else {
              toast.error('Geolocation is not supported by this browser.');
            }
          }, 10 * 1000); // 15분마다 위치 요청

          setIntervalId(id);
        },
        (error) => {
          toast.error(error.message);
        },
        {
          enableHighAccuracy: true
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }

  const gpsControlTest = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('Initial position:', latitude, longitude);

          // Background Sync 등록
          navigator.serviceWorker.ready.then((registration) => {
            (registration as ServiceWorkerRegistration).sync.register('gps-sync');
            console.log('Background Sync registered');
          });

          const id = window.setInterval(() => {
            refetchRouteHistory();
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log('Position at interval:', position.coords.latitude, position.coords.longitude);
                const requestData = updateTrackingDistance(position.coords.latitude, position.coords.longitude);

                request
                  .post('/order/updateRouteHistory', requestData)
                  .then((response) => {
                    if (!response.data) {
                      toast.error('Failed to send tracking data');
                    } else {
                      toast.success('Tracking data sent successfully');
                    }
                  })
                  .catch((error) => {
                    toast.error('Error sending tracking data: ' + error.message);
                  });
              },
              (error) => {
                toast.error(error.message);
              },
              { enableHighAccuracy: true }
            );
          }, 10 * 1000); // 15분마다 위치 요청

          setIntervalId(id);
        },
        (error) => {
          toast.error(error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }

  const gpsControl = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            'Initial position:',
            position.coords.latitude,
            position.coords.longitude,
          )
          const requsetData = updateTrackingDistance(
            position.coords.latitude,
            position.coords.longitude,
          )

          request
            .post('/order/updateRouteHistory', requsetData)
            .then((response) => {
              if (!response.data) {
                toast.error('Failed to send tracking data')
              } else {
                toast.success('Tracking data sent successfully')
              }
            })
            .catch((error) => {
              toast.error('Error sending tracking data: ' + error.message)
            })

          const id = window.setInterval(
            () => {
              refetchRouteHistory()
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    console.log(
                      'Position at interval:',
                      position.coords.latitude,
                      position.coords.longitude,
                    )
                    const requsetData = updateTrackingDistance(
                      position.coords.latitude,
                      position.coords.longitude,
                    )
                    request
                      .post('/order/updateRouteHistory', requsetData)
                      .then((response) => {
                        if (!response.data) {
                          toast.error('Failed to send tracking data')
                        } else {
                          toast.success('Tracking data sent successfully')
                        }
                      })
                      .catch((error) => {
                        toast.error(
                          'Error sending tracking data: ' + error.message,
                        )
                      })
                  },
                  (error) => {
                    toast.error(error.message)
                  },
                  {
                    enableHighAccuracy: true,
                  },
                )
              } else {
                toast.error('Geolocation is not supported by this browser.')
              }
              // }, 5 * 1000) //test용 5초마다 위치 요청
            },
            15 * 60 * 1000,
          ) // 15분마다 위치 요청

          setIntervalId(id)
        },
        (error) => {
          toast.error(error.message)
        },
        {
          enableHighAccuracy: true,
        },
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371 // 지구 반경 (킬로미터 단위)
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // 거리 (킬로미터 단위)
  }

  const updateTrackingDistance = (latitude: number, longitude: number) => {
    if (trakingInfo && trakingInfo.length > 0) {
      const distances = trakingInfo.map((info) => {
        const prevLat = parseFloat(info.LATITUDE)
        const prevLon = parseFloat(info.LONGITUDE)
        return getDistance(prevLat, prevLon, latitude, longitude)
      })
      console.log(distances)
      const minDistanceIndex = distances.indexOf(Math.min(...distances))
      console.log(minDistanceIndex)

      const data = {
        COMPANY_CODE: detail?.COMPANY_CODE,
        TR_NO: detail?.TR_NO,
        SEQ: 1,
        TRUCK_NO: trakingInfo[minDistanceIndex].TRUCK_NO,
        CHECK_DATE: new Date().toISOString(),
        LATITUDE: latitude.toString(),
        LONGITUDE: longitude.toString(),
        STATUS: detail?.STATUS,
        REMARKS: detail?.REMARKS,
        TIME_ZONE: '+09:00',
        ADD_DATE: new Date().toISOString(),
        ADD_USER_ID: detail?.ADD_USER_ID,
        ADD_USER_NAME: detail?.ADD_USER_NAME,
        UPDATE_DATE: new Date().toISOString(),
        UPDATE_USER_ID: new Date().toISOString(),
        UPDATE_USER_NAME: detail?.ADD_USER_NAME,
      }

      console.log(data)
      return data
    }
  }

  // ******************************************

  const confirmSave = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (gpsStatus === 'start') {
            setGpsStatus('running')
            gpsControl()
          } else if (gpsStatus === 'end') {
            gpsControl()
          }

          SaveRoute({
            SEQ: seq!,
            LATITUDE: position.coords.latitude.toString(),
            LONGITUDE: position.coords.longitude.toString(),
          })
          setIsSaveConfirm(false)
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

  const handleCopyUrlClick = () => {
    const { protocol, host } = window.location;
    const base64URL =
      detail!.TR_NO + ' ' + detail?.ADD_DATE + ' ' + detail?.UPDATE_DATE
    const encodeTRNO = encodeBase64(base64URL)

    const newUrl = `${protocol}//${host}/order/${encodeTRNO}`
    navigator.clipboard
      .writeText(newUrl)
      .then(() => {
        toast.success('Copied to clipboard')
      })
      .catch((error) => {
        console.log('Error copying to clipboard:', error)
      })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Route Information</DialogTitle>
          <div className='flex justify-end'>
            <Button className="flex gap-1" onClick={handleCopyUrlClick}>
              <Copy className="h-4 w-4" />
              COPY
            </Button>
          </div>
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

        <div className="relative h-[150px] mb-4">
          {trakingInfo && trakingInfo.length > 0 && (
            <GoogleRouteInfo key={trakingInfo.length} data={trakingInfo} />
          )}
        </div>

        <div className="h-[150px] overflow-y-auto px-1">
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
                      onClick={() => handleSave(item)}
                      type="button" // submit에서 button으로 변경
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

        <ConfirmDialog
          title="Save Route"
          desc={`Are you sure you want to save route?`}
          btnText="Save"
          loading={isSaveRoute}
          isOpen={isSaveConfirm}
          setIsOpen={setIsSaveConfirm}
          callback={confirmSave}
        />
      </DialogContent>
    </Dialog>
  )
}

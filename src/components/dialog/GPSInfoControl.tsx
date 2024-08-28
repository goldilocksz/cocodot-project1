import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Ban, Play, Sheet, Copy } from 'lucide-react'
import { Dialog, DialogContent } from '../ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Order,
  RouteHistory,
  TimeTableData,
  TrakingInfo,
  Monitoring,
} from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import ConfirmDialog from './ConfirmDialog'
import GoogleMapMulti from '../map/multi'
import TimeTableDialog from './TimeTableDialog'
import { decodeBase64, encodeBase64 } from '@/utils/base64'
import { Loader } from '@googlemaps/js-api-loader'

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

export default function GPSInfoControl({ detail, open, setOpen }: Props) {
  const [isTimeTableOpen, setIsTimeTableOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(-1)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isSaveConfirm, setIsSaveConfirm] = useState(false) // Save 확인 대화상자 상태
  const [intervalId, setIntervalId] = useState<number | null>(null)
  const [routeHistory, setRouteHistory] = useState<TimeTableData[]>([])
  const [seq, setSeq] = useState<string>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RouteDefault,
  })
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>()

  const {
    data: trakingInfo,
    isPending: isTrakingInfo,
    refetch: refetchTrackingInfo,
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
      console.log(data)
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
        refetchTrackingInfo()
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
        refetchTrackingInfo()
      }
    },
  })

  useEffect(() => {
    if (!fetchedRouteHistory || fetchedRouteHistory.length === 0) {
      refetchRouteHistory()
    }
  }, [fetchedRouteHistory, refetchRouteHistory])

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAUul4WOPFSjQoEI8z99NF-UadzHiyBr0s',
      version: 'weekly',
    })

    loader
      .load()
      .then(() => {
        const googleGeocoder = new google.maps.Geocoder()
        setGeocoder(googleGeocoder)
      })
      .catch((e) => {
        console.error('Google Maps API 로드에 실패했습니다:', e)
      })
  }, [])

  useEffect(() => {
    const updateAddress = async () => {
      if (fetchedRouteHistory && trakingInfo) {
        console.log(fetchedRouteHistory)
        const enrichedRouteHistory: any = []

        for (const history of fetchedRouteHistory) {
          const { SEQ, ADD_DATE } = history
          if (geocoder) {
            const address = await geocodeLatLng(
              geocoder,
              parseFloat(history.LATITUDE),
              parseFloat(history.LONGITUDE),
            )
            enrichedRouteHistory.push({
              SEQ,
              Datetime: ADD_DATE,
              SEQ_NAME: address || ' ',
            })
          }
        }

        // SEQ에 따라 정렬
        enrichedRouteHistory.sort((a, b) => a.SEQ - b.SEQ);

        console.log(enrichedRouteHistory)
        setRouteHistory(enrichedRouteHistory)
      } else {
        const enrichedRouteHistory: any = []
        setRouteHistory(enrichedRouteHistory)
      }
    }
    updateAddress()
  }, [fetchedRouteHistory])

  async function geocodeLatLng(
    geocoder: google.maps.Geocoder,
    lat: number,
    lng: number,
  ): Promise<string> {
    const latlng = {
      lat: lat,
      lng: lng,
    }
    return new Promise((resolve, reject) => {
      //에러발생시 reject [then], 정상실행시 resolve [catch] (callback)
      geocoder
        .geocode({ location: latlng })
        .then((response) => {
          if (response.results[0]) {
            const address = response.results[0].address_components
              .map((address) => address.short_name)
              .join(' ')
            resolve(address)
          } else {
            console.log('error')
            resolve(' ')
          }
        })
        .catch((error) => {
          console.log(error)
          reject(' ')
        })
    })
  }

  useEffect(() => {
    if (detail) {
      form.reset(detail)
    }
  }, [open])

  const handleSave = async (SEQ: string) => {
    setSeq(SEQ)
    setIsSaveConfirm(true)
  }

  const confirmSave = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const handlePlayClick = () => {
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

  const handleTimeTableClick = () => {
    setIsTimeTableOpen(true)
  }

  const handleSelectRow = (index: number) => {
    setHighlightedIndex(index)
    setIsTimeTableOpen(false)
  }

  const handleCopyUrlClick = () => {
    const { protocol, host } = window.location
    const base64URL =
      detail!.TR_NO + ' ' + detail?.ADD_DATE + ' ' + detail?.UPDATE_DATE
    const encodeTRNO = encodeBase64(base64URL)

    const newUrl = `${protocol}//${host}/gps/${encodeTRNO}`
    navigator.clipboard
      .writeText(newUrl)
      .then(() => {
        alert('URL Copied to Clipboard')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="max-w-4xl">
        <div className="relative mb-4 h-[700px]">
          <div
            className="absolute right-[60px] top-[10px] z-10 flex gap-2 max-[550px]:right-[10px] 
          max-[550px]:top-[55px]"
          >
            <Button className="flex gap-1" onClick={handlePlayClick}>
              {!intervalId ? (
                <>
                  <Play className="h-4 w-4" />
                  PLAY
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  STOP
                </>
              )}
            </Button>
            <Button className="flex gap-1" onClick={handleTimeTableClick}>
              <Sheet className="h-4 w-4" />
              TIMETABLE
            </Button>
            <Button className="flex gap-1" onClick={handleCopyUrlClick}>
              <Copy className="h-4 w-4" />
              COPY
            </Button>
          </div>
          {trakingInfo && trakingInfo.length > 0 && (
            <GoogleMapMulti
              key={trakingInfo.length}
              data={trakingInfo}
              gps={fetchedRouteHistory}
              highlightedIndex={highlightedIndex}
            />
          )}
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

        <TimeTableDialog
          // detail={detail}
          TR_NO={detail?.TR_NO}
          ADD_DATE={detail?.ADD_DATE}
          UPDATE_DATE={detail?.UPDATE_DATE}
          isOpen={isTimeTableOpen}
          setIsOpen={setIsTimeTableOpen}
          callback={confirmSave}
          trakingInfo={trakingInfo}
          routeHistory={routeHistory}
          onSelectRow={handleSelectRow}
        />
      </DialogContent>
    </Dialog>
  )
}

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Ban, Play, Sheet } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Order, TimeTableData, TrakingInfo } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import GoogleMapMulti from '@/components/map/multi'
import TimeTableDialog from '@/components/dialog/TimeTableDialog'
import { useParams } from 'react-router-dom'
import { decodeBase64 } from '@/utils/base64'
import publicRequest from '@/utils/public.request'

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

export default function GPSMap() {
  const { id } = useParams<{ id: string }>()
  const [TRNO, setTRNO] = useState<string>()
  const [addDate, setAddDate] = useState<string>()
  const [updateDate, setUpdateDate] = useState<string>()
  const [isTimeTableOpen, setIsTimeTableOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(-1)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isSaveConfirm, setIsSaveConfirm] = useState(false)
  const [seq, setSeq] = useState<string>()
  const [routeHistory, setRouteHistory] = useState<TimeTableData[]>([])
  const [intervalId, setIntervalId] = useState<number | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RouteDefault,
  })

  useEffect(() => {
    if (id) {
      const decodeId = decodeBase64(id)
      setAddDate(decodeId.split(' ')[1])
      setUpdateDate(decodeId.split(' ')[2])
      setTRNO(decodeId.split(' ')[0])
    }
  }, [id])

  // const {
  //   data: trakingInfo,
  //   isPending: isTrakingInfo,
  //   refetch,
  // } = useQuery<TrakingInfo[]>({
  //   queryKey: ['getTrackingInfo', TRNO],
  //   queryFn: async () => {
  //     const { data } = await request.post('/order/getTrackingInfo', {
  //       TR_NO: TRNO,
  //     })
  //     console.log('원피스', data)
  //     return data
  //   },
  //   enabled: !!TRNO,
  // })

  const {
    data: fetchedRouteHistory,
    isFetching: isRouteHistory,
    refetch: refetchRouteHistory,
  } = useQuery({
    queryKey: ['getOrderRouteHistory', TRNO],
    queryFn: async () => {
      const { data } = await publicRequest.post('/public-data/getTrackingInfo', {
        TR_NO: TRNO,
      })
      console.log('원피스', data)
      return data.data;
    },
    enabled: !!TRNO,
  })

  // const {
  //   data: fetchedRouteHistory,
  //   isFetching: isRouteHistory,
  //   refetch: refetchRouteHistory,
  // } = useQuery({
  //   queryKey: ['getOrderRouteHistory', TRNO],
  //   queryFn: async () => {
  //     const { data } = await request.post('/order/getOrderRouteHistory', {
  //       TR_NO: TRNO,
  //     })
  //     console.log(data)
  //     return data
  //   },
  //   enabled: !!TRNO,
  // })

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
        TR_NO: id,
        SEQ,
        LATITUDE,
        LONGITUDE,
      })
      if (!response.data) {
        toast.error('Failed to save route code information')
      } else {
        refetchRouteHistory
      }
    },
  })

  const { mutate: DeleteRoute, isPending: isDeleteRoute } = useMutation({
    mutationFn: async (SEQ: string) => {
      const response = await request.post('/order/deleteTrackingInfo', {
        TR_NO: id,
        SEQ,
      })
      if (!response.data) {
        toast.error('Failed to delete route code information')
      } else {
        setIsConfirm(false)
        setSeq(undefined)
        refetchRouteHistory
      }
    },
  })

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
  const handleTimeTableClick = () => {
    setIsTimeTableOpen(true)
  }
  const handleSelectRow = (index: number) => {
    setHighlightedIndex(index)
    setIsTimeTableOpen(false)
  }

  useEffect(() => {
    if (fetchedRouteHistory) {
      const enrichedRouteHistory = fetchedRouteHistory.map((history: any) => {
        const { SEQ, ADD_DATE } = history

        // const closestTrackingInfo = trakingInfo.reduce((closest, info) => {
        //   const prevLat = parseFloat(info.LATITUDE)
        //   const prevLon = parseFloat(info.LONGITUDE)
        //   const currentDistance = getDistance(
        //     prevLat,
        //     prevLon,
        //     parseFloat(info.LATITUDE),
        //     parseFloat(info.LONGITUDE),
        //   )
        //   const closestDistance = getDistance(
        //     prevLat,
        //     prevLon,
        //     parseFloat(closest.LATITUDE),
        //     parseFloat(closest.LONGITUDE),
        //   )

        //   return currentDistance < closestDistance ? info : closest
        // }, trakingInfo[0])

        return {
          SEQ,
          Datetime: ADD_DATE,
          // SEQ_NAME: closestTrackingInfo.SEQ_NAME || '',
        }
      })
      setRouteHistory(enrichedRouteHistory)
    }
  }, [fetchedRouteHistory])

  return (
    <div className="">
      <div className="relative mb-4 h-[700px]">
        <div
          className="absolute right-[60px] top-[10px] z-10 flex gap-2 max-[500px]:right-[10px] 
          max-[500px]:top-[55px]"
        >
          {/* <Button className="flex gap-1" onClick={handlePlayClick}>
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
          </Button> */}
          <Button className="flex gap-1" onClick={handleTimeTableClick}>
            <Sheet className="h-4 w-4" />
            TIMETABLE
          </Button>
        </div>
        <div className="h-full w-full">
          {fetchedRouteHistory && fetchedRouteHistory.length > 0 && (
            <GoogleMapMulti
              key={fetchedRouteHistory.length}
              data={null}
              gps={fetchedRouteHistory}
              highlightedIndex={highlightedIndex}
            />
          )}
        </div>
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
        TR_NO={TRNO}
        ADD_DATE={addDate}
        UPDATE_DATE={updateDate}
        isOpen={isTimeTableOpen}
        setIsOpen={setIsTimeTableOpen}
        callback={confirmSave}
        // trakingInfo={trakingInfo}
        routeHistory={routeHistory}
        onSelectRow={handleSelectRow}
      />
    </div>
  )
}

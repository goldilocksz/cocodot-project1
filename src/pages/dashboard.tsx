import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import Chart from '@/components/chart'
import dayjs from 'dayjs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useQuery } from '@tanstack/react-query'
import request from '@/utils/request'
import { useEffect, useState } from 'react'
import { Monitoring as Monit } from '@/types/data'
import { group } from 'radash'
import MultiBar from '@/components/chart/MultiBar'
import Cnee from '@/components/form/Cnee'
import { DatepickerRange } from '@/components/ui/datepicker-range'
import Loading from '@/components/ui/loading'
import { DateRange } from 'react-day-picker'
import { Select } from '@/components/ui/select'
import { cn } from '@/utils/utils'

const CountdownTimer = ({
  start,
  initialSeconds,
  refetch,
}: {
  start: boolean
  initialSeconds: number
  refetch: (num: number) => void
}) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds)

  useEffect(() => {
    if (!start) return
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          refetch(Math.random())
          return initialSeconds
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [start])

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <div>
      <h1>{formatTime(seconds)}</h1>
    </div>
  )
}
export default function DashboardView() {
  const [CNEE_CODE, setCNEECODE] = useState<string>('')
  const [isRefetch, setIsRefetch] = useState<boolean>(true)
  const [countDown, setCountDown] = useState<number>(5 * 60)
  const [progressRangeDate, setProgressRangeDate] = useState<DateRange>({
    from: dayjs().subtract(6, 'day').toDate(),
    to: new Date(),
  })
  const [refetch, setRefetch] = useState(0)

  const {
    data: Count,
    isLoading: isGetCount,
    isRefetching: isRefetchingCount,
  } = useQuery({
    queryKey: ['getMainCount', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMainCount', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data[0]
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Progress,
    isLoading: isGetProgress,
    isRefetching: isRefetchProgress,
  } = useQuery({
    queryKey: ['getRateOfProgress', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getRateOfProgress', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      const titleGroup = group(response.data, (item: any) => item.VIEW_DATE)

      const data = {
        labels: Object.keys(titleGroup),
        datasets: [
          {
            name: 'ATD FACTORY(actual)',
            data: response.data.map((item: any) => item['ATD FACTORY']),
          },
          {
            name: 'ETD FACTORY(plan)',
            data: response.data.map((item: any) => item['ETD FACTORY']),
          },
        ],
      }
      return data
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Delivery,
    isLoading: isGetDelivery,
    isRefetching: isRefetchDelivery,
  } = useQuery({
    queryKey: ['getDelivery', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getDelivery', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: LeadTimeAVG,
    isLoading: isGetLeadTime,
    isRefetching: isRefetchLeadTime,
  } = useQuery({
    queryKey: ['getLeadTimeAVG', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTimeAVG', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const { data: LeadTime } = useQuery({
    queryKey: ['getLeadTime', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTime', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })
      const routeGroup = group(response.data, (item: any) => item.ROUTE)
      const titleGroup = group(response.data, (item: any) => item.TITLE)

      const data = {
        labels: Object.keys(titleGroup),
        datasets: Object.values(routeGroup).map((item: any) => ({
          name: item[0].ROUTE,
          data: item.map((item: any) => item.READTIME),
        })),
      }

      return data
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: ListOfProcessing,
    isLoading: isGetListOfProcessing,
    isRefetching: isRefetchingListOfProcessing,
  } = useQuery({
    queryKey: ['getListOfProcessing', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getListOfProcessing', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
    enabled: !!progressRangeDate,
  })

  const {
    data: Monitoring,
    isLoading: isGetMonitoring,
    isRefetching: isRefetchMonitoring,
  } = useQuery<Monit[]>({
    queryKey: ['getMonitoring', progressRangeDate, CNEE_CODE, refetch],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMonitoring', {
        CNEE_CODE,
        FROM_DATE:
          progressRangeDate?.from &&
          dayjs(progressRangeDate.from).format('YYYYMMDD'),
        TO_DATE:
          progressRangeDate?.to &&
          dayjs(progressRangeDate.to).format('YYYYMMDD'),
      })
      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  return (
    <>
      <div className="grid grid-cols-2 items-center justify-start gap-2 lg:flex lg:justify-end lg:gap-4">
        <CountdownTimer
          start={isRefetch}
          initialSeconds={countDown}
          refetch={setRefetch}
        />
        <Select
          defaultValue="5"
          onChange={(e) => setCountDown(Number(e.target.value) * 60)}
          className="w-[120px]"
        >
          <option value="5">5 Minutes</option>
          <option value="10">10 Minutes</option>
        </Select>
        <div className="flex items-center gap-2">
          <Label htmlFor="airplane-mode" className="cursor-pointer">
            Auto Refetch
          </Label>
          <Switch
            id="airplane-mode"
            checked={isRefetch}
            onCheckedChange={setIsRefetch}
          />
        </div>
        <Cnee
          className="w-[100px]"
          value={CNEE_CODE}
          onChange={(e) => setCNEECODE(e.target.value)}
        />
        <DatepickerRange
          date={progressRangeDate}
          setDate={setProgressRangeDate}
        ></DatepickerRange>
        <Button onClick={() => setRefetch(Math.random())}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      <div className="flex items-center justify-end">Unit: shpt</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.PROCESSING} />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of ata border
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && (
                <div className="flex items-center justify-center gap-1">
                  <CountUp duration={1} end={Count.ATA_BORDER_CNT} /> {'/'}
                  <CountUp duration={1} end={Count.PROCESSING} />
                </div>
              )}
            </div>
            <div className="mt-2">{Count?.ATA_BORDER_PER}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of pass border
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && (
                <div className="flex items-center justify-center gap-1">
                  <CountUp duration={1} end={Count.PASS_BORDER_CNT} /> {'/'}
                  <CountUp duration={1} end={Count.PROCESSING} />
                </div>
              )}
            </div>
            <div className="mt-2">{Count?.PASS_BORDER_PER}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of ata factory
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <Loading isLoading={isGetCount || isRefetchingCount}></Loading>
            <div className="h-8 text-2xl font-bold">
              {Count && (
                <div className="flex items-center justify-center gap-1">
                  <CountUp duration={1} end={Count.ATA_FACTORY_CNT} /> {'/'}
                  <CountUp duration={1} end={Count.PROCESSING} />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              {Count?.ATA_FACTORY_PER}%
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>A Rate Of Progress</div>
              <span className="text-sm font-normal">(Unit: shpt)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[400px]">
            <Loading isLoading={isGetProgress || isRefetchProgress}></Loading>
            {Progress && <Chart data={Progress}></Chart>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>Lead Time(Border Passing)</div>
              <span className="text-sm font-normal">(Unit: hours)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[400px]">
            <Loading isLoading={isGetDelivery || isRefetchDelivery}></Loading>
            {LeadTime && <MultiBar data={LeadTime}></MultiBar>}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex flex-1 items-center justify-between">
              <div>Delivery Leadtime by Regional</div>
              <span className="text-sm font-normal">(Unit: hours)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Loading isLoading={isGetDelivery || isRefetchDelivery}></Loading>
            {Delivery && Delivery?.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="whitespace-pre-line text-xs">
                    <TableHead></TableHead>
                    <TableHead>ATD ~ ATA Border</TableHead>
                    <TableHead>~ Pass Border</TableHead>
                    <TableHead>~ ATA VN Yard</TableHead>
                    <TableHead>~ ATA Factory</TableHead>
                    <TableHead>~ Total leadtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Delivery?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.REGION_NAME}</TableCell>
                      <TableCell>{item.ATA_BORDER}</TableCell>
                      <TableCell>{item.PASS_BORDER}</TableCell>
                      <TableCell>{item.ATA_VN_YARD}</TableCell>
                      <TableCell>{item.ATA_FACTORY}</TableCell>
                      <TableCell>
                        {item.READTIME} {item.REDDAY}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Estimated L/T(Border Passing)</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <Loading isLoading={isGetLeadTime || isRefetchLeadTime}></Loading>
            {LeadTimeAVG?.map((item: any) => (
              <div
                key={item.id}
                className="flex h-10 items-center justify-between"
              >
                <div>{item.ROUTE}</div>
                <div className="flex items-center gap-1">
                  <div className="text-xl font-bold">{item.READTIME}</div>
                  <div className="text-sm text-muted-foreground">hrs</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex flex-1 items-center justify-between">
              <div>A list of progress</div>
              <span className="text-sm font-normal">(Unit: shpt)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[300px]">
            <Loading
              isLoading={isGetListOfProcessing || isRefetchingListOfProcessing}
            ></Loading>
            {ListOfProcessing && ListOfProcessing?.length > 0 && (
              <Table className="mt-2">
                <TableHeader>
                  <TableRow className="[&>th]:text-center">
                    <TableHead></TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY1_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY2_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY3_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY4_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY5_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY6_DATE).format('DD-MMMM')}
                    </TableHead>
                    <TableHead>
                      {dayjs(ListOfProcessing?.[0].DAY7_DATE).format('DD-MMMM')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ListOfProcessing?.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="[&>td]:relative [&>td]:p-2 [&>td]:text-center"
                    >
                      <TableCell>{item.LOC}</TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY1 / ListOfProcessing?.[0].DAY1) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY1}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY2 / ListOfProcessing?.[0].DAY2) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY2}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY3 / ListOfProcessing?.[0].DAY3) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY3}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY4 / ListOfProcessing?.[0].DAY4) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY4}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY5 / ListOfProcessing?.[0].DAY5) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY5}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY6 / ListOfProcessing?.[0].DAY6) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY6}</div>
                      </TableCell>
                      <TableCell>
                        <div className="absolute inset-1">
                          <div
                            className="absolute inset-0 right-auto flex items-center justify-center border border-green-400 bg-gradient-to-r from-green-300 to-green-100 text-[#111111]"
                            style={{
                              width: `${(item.DAY7 / ListOfProcessing?.[0].DAY7) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">{item.DAY7}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Monitoring</CardTitle>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/monitoring">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="relative flex flex-col gap-1">
            <Loading
              isLoading={isGetMonitoring || isRefetchMonitoring}
            ></Loading>
            {Monitoring?.slice(0, 5).map((item) => (
              <div key={item.id} className="border-b py-1 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="grow">
                    <div className="flex items-center gap-1">
                      <div className="whitespace-nowrap">LSP:</div>
                      <div>{item.LSP_CD}</div>
                    </div>
                    <div className="flex items-start gap-1">
                      <div className="whitespace-nowrap">Remarks:</div>
                      <div>{item.REF_NO}</div>
                    </div>
                    <div className="flex items-start gap-1">
                      <div className="whitespace-nowrap">Now Status:</div>
                      <div>{item.NOW_STATUS}</div>
                    </div>
                  </div>
                  <div className="relative ml-auto flex h-3 w-3">
                    <span
                      className={cn(
                        'absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75',
                        item.CHECK_YN === 'N' && 'bg-red-400',
                      )}
                    ></span>
                    <span
                      className={cn(
                        'relative inline-flex h-3 w-3 rounded-full bg-green-500',
                        item.CHECK_YN === 'N' && 'bg-red-400',
                      )}
                    ></span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

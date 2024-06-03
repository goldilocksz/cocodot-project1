import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { Input } from '@/components/ui/input'
import Chart from '@/components/chart'
import dayjs from 'dayjs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import request from '@/utils/request'
import { useState } from 'react'
import { Monitoring as Monit } from '@/types/data'

export default function DashboardView() {
  const [fromDate, setFromDate] = useState('20240501')
  const [toDate, setToDate] = useState('20240507')

  const { data: Count } = useQuery({
    queryKey: ['getMainCount'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMainCount', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })

      return response.data[0]
    },
  })

  const { data: Progress } = useQuery({
    queryKey: ['getRateOfProgress'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getRateOfProgress', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })
      return [
        {
          name: 'ATA_CNT',
          data: response.data.map((item: any) => item.ATA_CNT),
          date: response.data.map((item: any) =>
            dayjs(item.JOB_DATE).format('MM-DD'),
          ),
        },
        {
          name: 'ETD_CNT',
          data: response.data.map((item: any) => item.ETD_CNT),
          date: response.data.map((item: any) =>
            dayjs(item.JOB_DATE).format('MM-DD'),
          ),
        },
      ]
    },
  })

  const { data: Delivery } = useQuery({
    queryKey: ['getDelivery'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getDelivery', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  const { data: LeadTimeAVG } = useQuery({
    queryKey: ['getLeadTimeAVG'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTimeAVG', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  const { data: LeadTime } = useQuery({
    queryKey: ['getLeadTime'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getLeadTime', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })

      return [
        {
          name: 'LeadTime',
          data: response.data.map((item: any) => item.LEADTIME),
          date: response.data.map((item: any) =>
            dayjs(item.JOB_DATE).format('MM-DD'),
          ),
        },
      ]
    },
  })

  const { data: ListOfProcessing } = useQuery({
    queryKey: ['getListOfProcessing'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getListOfProcessing', {
        FROM_DATE: fromDate,
        TO_DATE: toDate,
      })

      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  const { data: Monitoring } = useQuery<Monit[]>({
    queryKey: ['getMonitoring'],
    queryFn: async () => {
      const response = await request.post('/monitoring/getMonitoring', {})
      return response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }))
    },
  })

  return (
    <>
      <div className="grid grid-cols-2 items-center justify-start gap-2 lg:flex lg:justify-end lg:gap-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="airplane-mode" className="cursor-pointer">
            Auto Refetch
          </Label>
          <Switch id="airplane-mode" checked={true} />
        </div>
        <Select className="w-[120px] justify-self-end">
          <option value="10">10 minutes</option>
        </Select>
        <div className="col-span-2">
          <span className="text-sm text-muted-foreground">Last UpdatedAt:</span>{' '}
          <span>{dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss')}</span>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
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
          <CardContent className="text-center">
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.ATA_BORDER_CNT} />}
            </div>
            <div className="mt-2">
              {Count?.ATA_BORDER_CNT}/{Count?.ATA_BORDER_PER}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of pass border
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="h-8 text-2xl font-bold">
              {Count && (
                <CountUp duration={1} end={Count.PASS_BORDER_CNT}></CountUp>
              )}
            </div>
            <div className="mt-2">
              {Count?.PASS_BORDER_CNT}/{Count?.PASS_BORDER_PER}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ratio of ata factory
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="h-8 text-2xl font-bold">
              {Count && <CountUp duration={1} end={Count.ATA_FACTORY_CNT} />}
            </div>
            <p className="mt-2">
              {Count?.ATA_FACTORY_CNT}/{Count?.ATA_FACTORY_PER}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>A Rate Of Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {Progress && <Chart data={Progress}></Chart>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Time(Border Passing)</CardTitle>
          </CardHeader>
          <CardContent>
            LeadTimeAVG
            {/* {LeadTimeAVG && <Chart data={LeadTimeAVG}></Chart>} */}
          </CardContent>
          {/* <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/images/avatars/avatar_1.jpg" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">$1,999</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/images/avatars/avatar_2.jpg" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">$39</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/images/avatars/avatar_3.jpg" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">$299</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/images/avatars/avatar_4.jpg" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">$99</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/images/avatars/avatar_5.jpg" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">$39</div>
            </div>
          </CardContent> */}
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Delivery Leadtime by Regional</CardTitle>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>ESTIMATED L/T(Border Passing)</CardTitle>
          </CardHeader>
          <CardContent>
            {LeadTimeAVG?.map((item: any) => (
              <div
                key={item.id}
                className="flex h-10 items-center justify-between"
              >
                <div>{item.ROUTE}</div>
                <div className="flex items-center gap-1">
                  <div className="text-xl font-bold">{item.READTIME}</div>
                  <div className="text-sm text-muted-foreground">hrc</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>A list of progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>DAY1</TableCell>
                <TableCell>DAY2</TableCell>
                <TableCell>DAY3</TableCell>
                <TableCell>DAY4</TableCell>
                <TableCell>DAY5</TableCell>
                <TableCell>DAY6</TableCell>
                <TableCell>DAY7</TableCell>
              </TableRow>
              <TableBody>
                {ListOfProcessing?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.LOC}</TableCell>
                    <TableCell>{item.DAY1}</TableCell>
                    <TableCell>{item.DAY2}</TableCell>
                    <TableCell>{item.DAY3}</TableCell>
                    <TableCell>{item.DAY4}</TableCell>
                    <TableCell>{item.DAY5}</TableCell>
                    <TableCell>{item.DAY6}</TableCell>
                    <TableCell>{item.DAY7}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          <CardContent className="flex flex-col gap-1">
            {Monitoring?.map((item) => (
              <div key={item.id} className="border-b py-1">
                <div className="flex items-start gap-1">
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
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

import { useReducer, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrReport } from '@/types/data'
import ReportSearch from '@/components/form/ReportSearch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import request from '@/utils/request'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/ui/loading'
import { RefreshCcw } from 'lucide-react'
import { omit } from 'radash'
import { dateFormat } from '@/utils/utils'
import dayjs from 'dayjs'

export interface Search {
  JOB_FROM: string
  JOB_TO: string
  TR_NO: string
  BL_NO: string
  CNEE_CODE: string | undefined
  URGENT: string
  random: number
}

export default function TrReportView() {
  const [list, setList] = useState<TrReport[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [search, setSearch] = useReducer(
    (state: Search, newState: Partial<Search>) => ({ ...state, ...newState }),
    {
      JOB_FROM: dayjs().subtract(6, 'day').format('YYYYMMDD'),
      JOB_TO: dayjs().format('YYYYMMDD'),
      TR_NO: '',
      BL_NO: '',
      CNEE_CODE: undefined,
      URGENT: 'N',
      random: Math.random(),
    },
  )
  const {
    data: TrReports,
    isLoading: isGetTrReports,
    isRefetching: isRefetchTrReports,
    refetch,
  } = useQuery<TrReport[]>({
    queryKey: ['getTrReport', search],
    queryFn: async () => {
      const { data }: { data: TrReport[] } = await request.post(
        '/report/getTRReport',
        {
          ...omit(search, ['random']),
        },
      )

      setList(data)
      return data
    },
  })

  function downloadXlsx() {
    if (!TrReports?.length) return
    console.log(TrReports)

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils?.json_to_sheet(TrReports)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'test')

    XLSX.writeFile(workbook, `TrReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
  }

  return (
    <section className="relative grow">
      <Loading isLoading={isGetTrReports || isRefetchTrReports} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">TR Report</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button onClick={() => downloadXlsx()}>Download</Button>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <ReportSearch search={search} setSearch={setSearch} />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>Tr Number</TableHead>
              <TableHead>Bl Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CNEE</TableHead>
              <TableHead>LSP Name</TableHead>
              <TableHead>Pol</TableHead>
              <TableHead>Vendor name</TableHead>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Incoterms</TableHead>
              <TableHead>Item code</TableHead>
              <TableHead>PLT</TableHead>
              <TableHead>Single or Consol</TableHead>
              <TableHead>URGENT</TableHead>
              <TableHead>REGION</TableHead>
              <TableHead>Route code</TableHead>
              <TableHead>CN Truck no.</TableHead>
              <TableHead>CN Truck type</TableHead>
              <TableHead>VN Truck no.</TableHead>
              <TableHead>VN Truck type</TableHead>
              <TableHead>From_Nation</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>JOB DATE</TableHead>
              <TableHead>ETD Factory</TableHead>
              <TableHead>ATA Factory to pick up</TableHead>
              <TableHead>Pick up Time</TableHead>
              <TableHead>ATD Factory</TableHead>
              <TableHead>ETA Border</TableHead>
              <TableHead>ATA Border</TableHead>
              <TableHead>CC done(CN)</TableHead>
              <TableHead>Border pass</TableHead>
              <TableHead>Arrive Vietam yard(CN)</TableHead>
              <TableHead>Arrive Vietam yard(VN)</TableHead>
              <TableHead>Transloading</TableHead>
              <TableHead>Depart from Vietnam yard</TableHead>
              <TableHead>ETA CNEE Factory</TableHead>
              <TableHead>ATA Cnee Factory</TableHead>
              <TableHead>Unloading</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list
              ?.slice(
                (page - 1) * parseInt(pageSize),
                page * parseInt(pageSize),
              )
              .map((item, index) => (
                <TableRow key={`trreport-${index}`}>
                  <TableCell>{item?.TR_NO}</TableCell>
                  <TableCell>{item?.BL_NO}</TableCell>
                  <TableCell>{item?.STATUS}</TableCell>
                  <TableCell>{item?.CNEE}</TableCell>
                  <TableCell>{item?.LSP_CD}</TableCell>
                  <TableCell>{item?.POL}</TableCell>
                  <TableCell>{item?.VENDOR_NAME}</TableCell>
                  <TableCell>{item?.INVOICE_NO}</TableCell>
                  <TableCell>{item?.INCOTERMS}</TableCell>
                  <TableCell>{item?.ITEM_CODE}</TableCell>
                  <TableCell>{item?.PLT_QTY}</TableCell>
                  <TableCell>{item?.SINGLE_OR_CONSOL}</TableCell>
                  <TableCell>{item?.URGENT}</TableCell>
                  <TableCell>{item?.REGION_NAME}</TableCell>
                  <TableCell>{item?.FROM_ROUTE_CODE}</TableCell>
                  <TableCell>{item?.CN_TRUCK_NO}</TableCell>
                  <TableCell>{item?.CN_TRUCK_TYPE}</TableCell>
                  <TableCell>{item?.VN_TRUCK_NO}</TableCell>
                  <TableCell>{item?.VN_TRUCK_TYPE}</TableCell>
                  <TableCell>{item?.FROM_NATION}</TableCell>
                  <TableCell>{item?.WEEK}</TableCell>
                  <TableCell>{item?.JOB_DATE}</TableCell>
                  <TableCell>{item?.ETD_FACTORY}</TableCell>
                  <TableCell>{item?.ATA_FACTORY_TO_PICK_UP}</TableCell>
                  <TableCell>{item?.PICK_UP_TIME}</TableCell>
                  <TableCell>{item?.ATD_FACTORY}</TableCell>
                  <TableCell>{item?.ETA_BORDER}</TableCell>
                  <TableCell>{item?.ATA_BORDER}</TableCell>
                  <TableCell>{item?.CC_DONE_TIME}</TableCell>
                  <TableCell>{item?.BORDER_PASS}</TableCell>
                  <TableCell>{item?.ARRIVE_VIETAM_YARD_CN}</TableCell>
                  <TableCell>{item?.ARRIVE_VIETAM_YARD_VN}</TableCell>
                  <TableCell>{item?.TRANSLOADING}</TableCell>
                  <TableCell>{item?.DEPART_FROM_VIETNAM_YARD}</TableCell>
                  <TableCell>{item?.ETA_CNEE_FACTORY}</TableCell>
                  <TableCell>{item?.ATA_CNEE_FACTORY}</TableCell>
                  <TableCell>{item?.UNLOADING}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={
            list?.length ? Math.ceil(list.length / parseInt(pageSize)) : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>
    </section>
  )
}

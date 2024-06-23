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
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import request from '@/utils/request'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/ui/loading'
import { RefreshCcw } from 'lucide-react'
import { omit } from 'radash'

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

      const allKeys = Array.from(
        new Set(data.flatMap((obj) => Object.keys(obj))),
      ) as (keyof TrReport)[]

      const filterList = data.map((obj, index: number) => {
        let newObj: any = {}
        newObj['id'] = index + 1
        allKeys.forEach((key) => {
          newObj[key] = obj[key] ?? ''
        })
        return newObj
      })
      setList(filterList)
      return filterList
    },
  })

  function downloadXlsx() {
    if (!TrReports?.length) return
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
              <TableHead>Company Code</TableHead>
              <TableHead>Tr No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bl No</TableHead>
              <TableHead>Lsp Cd</TableHead>
              <TableHead>Job Date</TableHead>
              <TableHead>Pol</TableHead>
              <TableHead>Single Or Consol</TableHead>
              <TableHead>From Route Code</TableHead>
              <TableHead>From Nation</TableHead>
              <TableHead>Cn Truck No</TableHead>
              <TableHead>Cn Truck Type</TableHead>
              <TableHead>To Route Code</TableHead>
              <TableHead>To Nation</TableHead>
              <TableHead>Vn Truck No</TableHead>
              <TableHead>Vn Truck Type</TableHead>
              <TableHead>Etd</TableHead>
              <TableHead>Plt Qty</TableHead>
              <TableHead>Ata Factory To Pick Up</TableHead>
              <TableHead>Pick Up Time</TableHead>
              <TableHead>Atd Factory</TableHead>
              <TableHead>Eta Border</TableHead>
              <TableHead>Ata Border</TableHead>
              <TableHead>Border Pass</TableHead>
              <TableHead>Urgent</TableHead>
              <TableHead>Region Code</TableHead>
              <TableHead>Region Name</TableHead>
              <TableHead>Cc Done Time</TableHead>
              <TableHead>Arrive Vietam Yard Cn</TableHead>
              <TableHead>Arrive Vietam Yard Vn</TableHead>
              <TableHead>Transloading</TableHead>
              <TableHead>Depart From Vietnam Yard</TableHead>
              <TableHead>Eta Cnee Factory</TableHead>
              <TableHead>Ata Cnee Factory</TableHead>
              <TableHead>Unloading</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list
              ?.slice(
                (page - 1) * parseInt(pageSize),
                page * parseInt(pageSize),
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.COMPANY_CODE || ''}</TableCell>
                  <TableCell>{item.TR_NO || ''}</TableCell>
                  <TableCell>{item?.STATUS || ''}</TableCell>
                  <TableCell>{item?.BL_NO || ''}</TableCell>
                  <TableCell>{item?.LSP_CD || ''}</TableCell>
                  <TableCell>{item?.JOB_DATE || ''}</TableCell>
                  <TableCell>{item?.POL || ''}</TableCell>
                  <TableCell>{item.SINGLE_OR_CONSOL || ''}</TableCell>
                  <TableCell>{item.FROM_ROUTE_CODE || ''}</TableCell>
                  <TableCell>{item.FROM_NATION || ''}</TableCell>
                  <TableCell>{item.CN_TRUCK_NO || ''}</TableCell>
                  <TableCell>{item.CN_TRUCK_TYPE || ''}</TableCell>
                  <TableCell>{item.TO_ROUTE_CODE || ''}</TableCell>
                  <TableCell>{item.TO_NATION || ''}</TableCell>
                  <TableCell>{item.VN_TRUCK_NO || ''}</TableCell>
                  <TableCell>{item.VN_TRUCK_TYPE || ''}</TableCell>
                  <TableCell>
                    {item.ETD
                      ? dayjs(item.ETD).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>{item.PLT_QTY || ''}</TableCell>
                  <TableCell>
                    {item.ATA_FACTORY_TO_PICK_UP
                      ? dayjs(item.ATA_FACTORY_TO_PICK_UP).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.PICK_UP_TIME).isValid()
                      ? dayjs(item.PICK_UP_TIME).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ATD_FACTORY).isValid()
                      ? dayjs(item.ATD_FACTORY).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ETA_BORDER).isValid()
                      ? dayjs(item.ETA_BORDER).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>{item.ATA_BORDER || ''}</TableCell>
                  <TableCell>
                    {dayjs(item.BORDER_PASS).isValid()
                      ? dayjs(item.BORDER_PASS).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>{item.URGENT || ''}</TableCell>
                  <TableCell>{item.REGION_CODE || ''}</TableCell>
                  <TableCell>{item.REGION_NAME || ''}</TableCell>
                  <TableCell>
                    {dayjs(item.CC_DONE_TIME).isValid()
                      ? dayjs(item.CC_DONE_TIME).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ARRIVE_VIETAM_YARD_CN).isValid()
                      ? dayjs(item.ARRIVE_VIETAM_YARD_CN).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ARRIVE_VIETAM_YARD_VN).isValid()
                      ? dayjs(item.ARRIVE_VIETAM_YARD_VN).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.TRANSLOADING).isValid()
                      ? dayjs(item.TRANSLOADING).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.DEPART_FROM_VIETNAM_YARD).isValid()
                      ? dayjs(item.DEPART_FROM_VIETNAM_YARD).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ETA_CNEE_FACTORY).isValid()
                      ? dayjs(item.ETA_CNEE_FACTORY).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : ''}
                  </TableCell>
                  <TableCell>{item.ATA_CNEE_FACTORY || ''}</TableCell>
                  <TableCell>
                    {dayjs(item.UNLOADING).isValid()
                      ? dayjs(item.UNLOADING).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
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

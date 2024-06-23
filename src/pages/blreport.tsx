import { useReducer, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Auth, TrReport } from '@/types/data'
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
import { Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import request from '@/utils/request'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/ui/loading'
import { omit } from 'radash'
import { dateFormat } from '@/utils/utils'

export interface Search {
  JOB_FROM: string
  JOB_TO: string
  TR_NO: string
  BL_NO: string
  CNEE_CODE: string | undefined
  URGENT: string
  random: number
}

export default function BlReportView() {
  const [list, setList] = useState<TrReport[]>()
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
    data: BlReports,
    isLoading: isGetBlReports,
    isRefetching: isRefetchBlReports,
    refetch,
  } = useQuery<TrReport[]>({
    queryKey: ['getBlReport', page, pageSize, search],
    queryFn: async () => {
      const { data }: { data: TrReport[] } = await request.post(
        '/report/getBLReport',
        {
          ...omit(search, ['random']),
        },
      )
      setList(data)
      return data
    },
  })

  function downloadXlsx() {
    if (!BlReports?.length) return
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils?.json_to_sheet(BlReports)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'test')

    XLSX.writeFile(workbook, `BlReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
  }

  return (
    <section className="relative grow">
      <Loading isLoading={isGetBlReports || isRefetchBlReports} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">B/L Report</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button onClick={() => downloadXlsx()}>Download</Button>
        </div>
      </div>

      <Card className="relative mt-6 p-6">
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
              .map((item, index) => (
                <TableRow key={`blreport-${index}`}>
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
                    {item.ETD !== 'NULL' && dateFormat(item.ETD)}
                  </TableCell>
                  <TableCell>{item.PLT_QTY || ''}</TableCell>
                  <TableCell>
                    {item.ATA_FACTORY_TO_PICK_UP !== 'NULL' &&
                      item.ATA_FACTORY_TO_PICK_UP &&
                      dateFormat(item.ATA_FACTORY_TO_PICK_UP)}
                  </TableCell>
                  <TableCell>
                    {item.PICK_UP_TIME !== 'NULL' &&
                      item.PICK_UP_TIME &&
                      dateFormat(item.PICK_UP_TIME)}
                  </TableCell>
                  <TableCell>
                    {item.ATD_FACTORY !== 'NULL' &&
                      item.ATD_FACTORY &&
                      dateFormat(item.ATD_FACTORY)}
                  </TableCell>
                  <TableCell>
                    {item.ETA_BORDER !== 'NULL' &&
                      item.ETA_BORDER &&
                      dateFormat(item.ETA_BORDER)}
                  </TableCell>
                  <TableCell>
                    {item.ATA_BORDER !== 'NULL' &&
                      item.ATA_BORDER &&
                      dateFormat(item.ATA_BORDER)}
                  </TableCell>
                  <TableCell>
                    {item.BORDER_PASS !== 'NULL' &&
                      item.BORDER_PASS &&
                      dateFormat(item.BORDER_PASS)}
                  </TableCell>
                  <TableCell>{item.URGENT || ''}</TableCell>
                  <TableCell>{item.REGION_CODE || ''}</TableCell>
                  <TableCell>{item.REGION_NAME || ''}</TableCell>
                  <TableCell>
                    {item.CC_DONE_TIME !== 'NULL' &&
                      item.CC_DONE_TIME &&
                      dateFormat(item.CC_DONE_TIME)}
                  </TableCell>
                  <TableCell>
                    {item.ARRIVE_VIETAM_YARD_CN !== 'NULL' &&
                      item.ARRIVE_VIETAM_YARD_CN &&
                      dateFormat(item.ARRIVE_VIETAM_YARD_CN)}
                  </TableCell>
                  <TableCell>
                    {item.ARRIVE_VIETAM_YARD_VN !== 'NULL' &&
                      item.ARRIVE_VIETAM_YARD_VN &&
                      dateFormat(item.ARRIVE_VIETAM_YARD_VN)}
                  </TableCell>
                  <TableCell>
                    {item.TRANSLOADING !== 'NULL' &&
                      item.TRANSLOADING &&
                      dateFormat(item.TRANSLOADING)}
                  </TableCell>
                  <TableCell>
                    {item.DEPART_FROM_VIETNAM_YARD !== 'NULL' &&
                      item.DEPART_FROM_VIETNAM_YARD &&
                      dateFormat(item.DEPART_FROM_VIETNAM_YARD)}
                  </TableCell>
                  <TableCell>
                    {item.ETA_CNEE_FACTORY !== 'NULL' &&
                      item.ETA_CNEE_FACTORY &&
                      dateFormat(item.ETA_CNEE_FACTORY)}
                  </TableCell>
                  <TableCell>
                    {item.ATA_CNEE_FACTORY !== 'NULL' &&
                      item.ATA_CNEE_FACTORY &&
                      dateFormat(item.ATA_CNEE_FACTORY)}
                  </TableCell>
                  <TableCell>
                    {item.UNLOADING !== 'NULL' &&
                      item.UNLOADING &&
                      dateFormat(item.UNLOADING)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={
            BlReports?.length
              ? Math.ceil(BlReports.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>
    </section>
  )
}

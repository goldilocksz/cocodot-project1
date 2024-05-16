'use client'

import { useState } from 'react'
import { Card } from '../ui/card'
import { Auth, TrReport } from '@/types/data'
import ReportSearch from '../form/ReportSearch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import Pagination from '../pagination'
import dayjs from 'dayjs'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import * as XLSX from 'xlsx'

export default function TrReportView({
  auth,
  data,
}: {
  auth: Auth
  data: TrReport[]
}) {
  const [list, setList] = useState<TrReport[]>(data)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isLoading, setIsLoading] = useState(false)

  function downloadXlsx() {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils?.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'test')

    XLSX.writeFile(workbook, `TrReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
  }
  // const { data: trReport } = useQuery({
  //   queryKey: ['getTrReport'],
  //   queryFn: async () =>
  //     request({
  //       url: '/webReport/getTRReport',
  //       body: {
  //         TR_NO: '',
  //         ETD_FROM: '20240401',
  //         ETD_TO: '20240430',
  //         JOB_FRM: '20240401',
  //         JOB_TO: '20240430',
  //         Urgent: 'Y',
  //         BL_NO: '',
  //         CNEE_CODE: 'SEV',
  //       },
  //     }),
  // })

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Tr Report</h1>
        <Button onClick={() => downloadXlsx()}>Download</Button>
      </div>

      <Card className="relative mt-6 p-6">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        <ReportSearch
          auth={auth}
          setIsLoading={setIsLoading}
          setList={setList}
        />

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
            {data
              ?.slice(
                (page - 1) * parseInt(pageSize),
                page * parseInt(pageSize),
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item?.COMPANY_CODE || ''}</TableCell>
                  <TableCell>{item?.TR_NO || ''}</TableCell>
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
                    {dayjs(item.ETD).isValid()
                      ? dayjs(item.ETD).format('YYYY-MM-DD HH:mm:ss')
                      : ''}
                  </TableCell>
                  <TableCell>{item.PLT_QTY || ''}</TableCell>
                  <TableCell>
                    {dayjs(item.ATA_FACTORY_TO_PICK_UP).isValid()
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
            data?.length ? Math.ceil(data.length / parseInt(pageSize)) : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>
    </section>
  )
}

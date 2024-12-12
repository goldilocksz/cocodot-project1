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
import gridStyle from '@/gridStyle.css'

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
        try {
          const { data }: { data: TrReport[] | null } = await request.post(
            '/report/getTRReport',
            {
              ...omit(search, ['random']),
            },
          )
          
          // data가 null이 아니면 setList와 return 수행
          if (data) {
            setList(data)
            return data
          } else {
            // data가 null일 경우 빈 배열 또는 다른 적절한 값을 반환
            setList([])
            return []
          }
        } catch (error) {
          // 오류 처리 로직
          console.error("Error fetching TR report data:", error)
          setList([])  // 오류 시에도 빈 배열로 처리
          return []
        }
      },
    }) 
  
  

  function downloadXlsx() {
      if (!TrReports?.length) return;

      // 엑셀 열 순서와 헤더 레이블 정의
      const orderedKeys = [
          'TR_NO', 'BL_NO', 'STATUS', 'CNEE', 'LSP_CD', 'POL', 'VENDOR_NAME', 
          'INVOICE_NO', 'INCOTERMS', 'ITEM_CODE', 'PLT_QTY', 'SINGLE_OR_CONSOL', 
          'URGENT', 'REGION_NAME', 'FROM_ROUTE_CODE', 'CN_TRUCK_NO', 
          'CN_TRUCK_TYPE', 'VN_TRUCK_NO', 'VN_TRUCK_TYPE', 'FROM_NATION', 'WEEK', 
          'JOB_DATE', 'ETD_FACTORY', 'ATA_FACTORY_TO_PICK_UP', 'PICK_UP_TIME', 
          'ATD_FACTORY', 'ETA_BORDER', 'ATA_BORDER', 'CC_DONE_TIME', 
          'BORDER_PASS', 'ARRIVE_VIETAM_YARD_CN', 'ARRIVE_VIETAM_YARD_VN', 
          'TRANSLOADING', 'DEPART_FROM_VIETNAM_YARD', 'ETA_CNEE_FACTORY', 
          'ATA_CNEE_FACTORY', 'UNLOADING'
      ];

      const headers = [
          'Tr Number', 'Bl Number', 'Status', 'CNEE', 'LSP Name', 'Pol', 'Vendor Name', 
          'Invoice No.', 'Incoterms', 'Item Code', 'PLT', 'Single or Consol', 
          'URGENT', 'REGION', 'Route Code', 'CN Truck No.', 'CN Truck Type', 
          'VN Truck No.', 'VN Truck Type', 'From Nation', 'Week', 'Job Date', 
          'ETD Factory', 'ATA Factory to Pick Up', 'Pick Up Time', 'ATD Factory', 
          'ETA Border', 'ATA Border', 'CC Done (CN)', 'Border Pass', 
          'Arrive Vietnam Yard (CN)', 'Arrive Vietnam Yard (VN)', 'Transloading', 
          'Depart from Vietnam Yard', 'ETA CNEE Factory', 'ATA CNEE Factory', 'Unloading'
      ];

      // 데이터를 헤더와 순서에 맞게 정렬
      const orderedData = TrReports.map(item =>
          orderedKeys.reduce((acc, key, index) => {
              acc[headers[index]] = item[key as keyof TrReport];
              return acc;
          }, {} as Record<string, any>)
      );

      // Excel 워크북과 시트 생성
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(orderedData, { header: headers });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'TR Report');

      // Excel 파일 다운로드
      XLSX.writeFile(workbook, `TrReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
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
              <TableHead className="table-cell" >Tr Number</TableHead>
              <TableHead className="table-cell" >Bl Number</TableHead>
              <TableHead className="table-cell" >Status</TableHead>
              <TableHead className="table-cell" >CNEE</TableHead>
              <TableHead className="table-cell" >LSP Name</TableHead>
              <TableHead className="table-cell" >Pol</TableHead>
              <TableHead className="table-cell" >Vendor name</TableHead>
              <TableHead className="table-cell" >Invoice No.</TableHead>
              <TableHead className="table-cell" >Incoterms</TableHead>
              <TableHead className="table-cell" >Item code</TableHead>
              <TableHead className="table-cell" >PLT</TableHead>
              <TableHead className="table-cell" >Single or Consol</TableHead>
              <TableHead className="table-cell" >URGENT</TableHead>
              <TableHead className="table-cell" >REGION</TableHead>
              <TableHead className="table-cell" >Route code</TableHead>
              <TableHead className="table-cell" >CN Truck no.</TableHead>
              <TableHead className="table-cell" >CN Truck type</TableHead>
              <TableHead className="table-cell" >VN Truck no.</TableHead>
              <TableHead className="table-cell" >VN Truck type</TableHead>
              <TableHead className="table-cell" >From_Nation</TableHead>
              <TableHead className="table-cell" >Week</TableHead>
              <TableHead className="table-cell" >JOB DATE</TableHead>
              <TableHead className="table-cell" >ETD Factory</TableHead>
              <TableHead className="table-cell" >ATA Factory to pick up</TableHead>
              <TableHead className="table-cell" >Pick up Time</TableHead>
              <TableHead className="table-cell" >ATD Factory</TableHead>
              <TableHead className="table-cell" >ETA Border</TableHead>
              <TableHead className="table-cell" >ATA Border</TableHead>
              <TableHead className="table-cell" >CC done(CN)</TableHead>
              <TableHead className="table-cell" >Border pass</TableHead>
              <TableHead className="table-cell" >Arrive Vietam yard(CN)</TableHead>
              <TableHead className="table-cell" >Arrive Vietam yard(VN)</TableHead>
              <TableHead className="table-cell" >Transloading</TableHead>
              <TableHead className="table-cell" >Depart from Vietnam yard</TableHead>
              <TableHead className="table-cell" >ETA CNEE Factory</TableHead>
              <TableHead className="table-cell" >ATA Cnee Factory</TableHead>
              <TableHead className="table-cell" >Unloading</TableHead>
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
                  <TableCell className="table-cell" >{item?.TR_NO}</TableCell>
                  <TableCell className="table-cell" >{item?.BL_NO}</TableCell>
                  <TableCell className="table-cell" >{item?.STATUS}</TableCell>
                  <TableCell className="table-cell" >{item?.CNEE}</TableCell>
                  <TableCell className="table-cell" >{item?.LSP_CD}</TableCell>
                  <TableCell className="table-cell" >{item?.POL}</TableCell>
                  <TableCell className="table-cell" >{item?.VENDOR_NAME}</TableCell>
                  <TableCell className="table-cell" >{item?.INVOICE_NO}</TableCell>
                  <TableCell className="table-cell" >{item?.INCOTERMS}</TableCell>
                  <TableCell className="table-cell" >{item?.ITEM_CODE}</TableCell>
                  <TableCell className="table-cell" >{item?.PLT_QTY}</TableCell>
                  <TableCell className="table-cell" >{item?.SINGLE_OR_CONSOL}</TableCell>
                  <TableCell className="table-cell" >{item?.URGENT}</TableCell>
                  <TableCell className="table-cell" >{item?.REGION_NAME}</TableCell>
                  <TableCell className="table-cell" >{item?.FROM_ROUTE_CODE}</TableCell>
                  <TableCell className="table-cell" >{item?.CN_TRUCK_NO}</TableCell>
                  <TableCell className="table-cell" >{item?.CN_TRUCK_TYPE}</TableCell>
                  <TableCell className="table-cell" >{item?.VN_TRUCK_NO}</TableCell>
                  <TableCell className="table-cell" >{item?.VN_TRUCK_TYPE}</TableCell>
                  <TableCell className="table-cell" >{item?.FROM_NATION}</TableCell>
                  <TableCell className="table-cell" >{item?.WEEK}</TableCell>
                  <TableCell className="table-cell" >{item?.JOB_DATE}</TableCell>
                  <TableCell className="table-cell" >{item?.ETD_FACTORY}</TableCell>
                  <TableCell className="table-cell" >{item?.ATA_FACTORY_TO_PICK_UP}</TableCell>
                  <TableCell className="table-cell" >{item?.PICK_UP_TIME}</TableCell>
                  <TableCell className="table-cell" >{item?.ATD_FACTORY}</TableCell>
                  <TableCell className="table-cell" >{item?.ETA_BORDER}</TableCell>
                  <TableCell className="table-cell" >{item?.ATA_BORDER}</TableCell>
                  <TableCell className="table-cell" >{item?.CC_DONE_TIME}</TableCell>
                  <TableCell className="table-cell" >{item?.BORDER_PASS}</TableCell>
                  <TableCell className="table-cell" >{item?.ARRIVE_VIETAM_YARD_CN}</TableCell>
                  <TableCell className="table-cell" >{item?.ARRIVE_VIETAM_YARD_VN}</TableCell>
                  <TableCell className="table-cell" >{item?.TRANSLOADING}</TableCell>
                  <TableCell className="table-cell" >{item?.DEPART_FROM_VIETNAM_YARD}</TableCell>
                  <TableCell className="table-cell" >{item?.ETA_CNEE_FACTORY}</TableCell>
                  <TableCell className="table-cell" >{item?.ATA_CNEE_FACTORY}</TableCell>
                  <TableCell className="table-cell" >{item?.UNLOADING}</TableCell>
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

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
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <TableHead key={key}>
                    {key.toLocaleLowerCase().replaceAll('_', ' ')}
                  </TableHead>
                ))}
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
                  {Object.values(item).map((value, index) =>
                    dayjs(value).isValid() ? (
                      <TableCell key={index}>
                        {dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                    ) : (
                      <TableCell key={index}>{value}</TableCell>
                    ),
                  )}
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

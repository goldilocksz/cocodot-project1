'use client'

import { useState } from 'react'
import { Card } from '../ui/card'
import { TrReport } from '@/types/data'
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

export default function BlReport({ data }: { data: TrReport[] }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')

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
        <h1 className="text-lg font-semibold md:text-2xl">BL Report</h1>
      </div>

      <Card className="relative mt-6 p-6">
        <ReportSearch />

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
                  {Object.values(item).map((value, index) => (
                    <TableCell key={index}>{value}</TableCell>
                  ))}
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

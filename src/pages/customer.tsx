import CustomerControl from '@/components/dialog/CustomerControl'
import ReportSearch from '@/components/form/ReportSearch'
import SearchLine from '@/components/form/SearchLine'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Customer } from '@/types/data'
import request from '@/utils/request'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function customer() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchData, setSearchData] = useState<Customer[]>([])
  const [detail, setDetail] = useState<Customer | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isLoading, setIsLoading] = useState(false)

  const { data: customerList, isPending } = useQuery<Customer[]>({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      const { data }: { data: Customer[] } = await request.post(
        '/customer/getCustomer',
        {},
      )

      const allKeys = Array.from(
        new Set(data.flatMap((obj) => Object.keys(obj))),
      ) as (keyof Customer)[]

      const filterList = data.map((obj, index: number) => {
        let newObj: any = {}
        newObj['id'] = index + 1
        allKeys.forEach((key) => {
          newObj[key] = obj[key] ?? ''
        })
        return newObj
      })
      setSearchData(filterList)
      return filterList
    },
  })

  return (
    <section className="relative grow">
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Customer</h1>
        <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card className="mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchData={searchData}
          queryKey={['getUserList']}
          searchKey={[
            'USER_ID',
            'COMPANY_CODE',
            'CUSTOMER_CODE',
            'USER_NAME',
            'TEL_NO',
          ]}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>UPDATE_USER_ID</TableHead>
              <TableHead>CUSTOMER_NAME_ENG</TableHead>
              <TableHead>TEL_NO</TableHead>
              <TableHead>UPDATE_DATE</TableHead>
              <TableHead>ADD_USER_ID</TableHead>
              <TableHead>CUSTOMER_TYPE</TableHead>
              <TableHead>ADD_USER_NAME</TableHead>
              <TableHead>REMARKS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>FAX_NO</TableHead>
              <TableHead>TIME_ZONE</TableHead>
              <TableHead>CUSTOMER_NAME</TableHead>
              <TableHead>ADD_DATE</TableHead>
              <TableHead>CUSTOMER_CODE</TableHead>
              <TableHead>UPDATE_USER_NAME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerList
              ?.slice(
                (page - 1) * parseInt(pageSize),
                page * parseInt(pageSize),
              )
              .map((item) => (
                <TableRow
                  key={item.id}
                  onDoubleClick={() => {
                    setDetail(item)
                    setIsOpen(true)
                  }}
                >
                  <TableCell>{item.UPDATE_USER_ID}</TableCell>
                  <TableCell>{item.CUSTOMER_NAME_ENG}</TableCell>
                  <TableCell>{item.TEL_NO}</TableCell>
                  <TableCell>
                    {item.UPDATE_DATE &&
                      dayjs(item.UPDATE_DATE).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell>{item.ADD_USER_ID}</TableCell>
                  <TableCell>{item.CUSTOMER_TYPE}</TableCell>
                  <TableCell>{item.ADD_USER_NAME}</TableCell>
                  <TableCell>{item.REMARKS}</TableCell>
                  <TableCell>{item.STATUS}</TableCell>
                  <TableCell>{item.FAX_NO}</TableCell>
                  <TableCell>{item.TIME_ZONE}</TableCell>
                  <TableCell>{item.CUSTOMER_NAME}</TableCell>
                  <TableCell>
                    {item.ADD_DATE && dayjs(item.ADD_DATE).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell>{item.CUSTOMER_CODE}</TableCell>
                  <TableCell>{item.UPDATE_USER_NAME}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={
            customerList?.length
              ? Math.ceil(customerList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>

      <CustomerControl detail={detail} isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
}

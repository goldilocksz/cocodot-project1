import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import CustomerControl from '@/components/dialog/CustomerControl'
import ReportSearch from '@/components/form/ReportSearch'
import SearchLine from '@/components/form/SearchLine'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Loading from '@/components/ui/loading'
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
import { dateFormat } from '@/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Plus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'

export default function customer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [searchData, setSearchData] = useState<Customer[]>([])
  const [detail, setDetail] = useState<Customer | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: customerList,
    isLoading: isGetCustomerList,
    isRefetching: isRefetching,
    refetch,
  } = useQuery<Customer[]>({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      const { data }: { data: Customer[] } = await request.post(
        '/customer/getCustomer',
        {},
      )
      setSearchData(data)
      return data
    },
  })

  const { mutate: deleteCustomer, isPending: isDeleteCustomer } = useMutation({
    mutationKey: ['deleteCustomer'],
    mutationFn: async () => {
      await request.post('/customer/CustomerDelete', {
        CUSTOMER_CODE: detail?.CUSTOMER_CODE,
      })
      setIsConfirm(false)
      setIsOpen(false)
      refetch()
    },
  })

  return (
    <section className="relative grow">
      <Loading isLoading={isGetCustomerList || isRefetching} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Customer</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchData={searchData}
          queryKey={['getCustomer']}
          searchKey={['CUSTOMER_CODE', 'CUSTOMER_NAME', 'CUSTOMER_TYPE']}
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
              .map((item, index) => (
                <TableRow
                  key={`CUSTOMER-${index}`}
                  onDoubleClick={() => {
                    setDetail(item)
                    setIsOpen(true)
                  }}
                >
                  <TableCell>{item.UPDATE_USER_ID}</TableCell>
                  <TableCell>{item.CUSTOMER_NAME_ENG}</TableCell>
                  <TableCell>{item.TEL_NO}</TableCell>
                  <TableCell>
                    {item.UPDATE_DATE && dateFormat(item.UPDATE_DATE)}
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
                    {item.ADD_DATE && dateFormat(item.ADD_DATE)}
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

      <CustomerControl
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsConfirm={setIsConfirm}
        isDeleteCustomer={isDeleteCustomer}
        refetch={refetch}
      />

      <ConfirmDialog
        title="Delete Order"
        desc="Are you sure you want to delete order"
        btnText="Delete"
        loading={isDeleteCustomer}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => deleteCustomer()}
      />
    </section>
  )
}

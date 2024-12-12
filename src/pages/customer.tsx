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
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (!isOpen) {
      setDetail(undefined)
    }
  }, [isOpen])

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
              <TableHead>Customer Code</TableHead>
              <TableHead>CUSTOMER TYPE</TableHead>
              <TableHead>Dept Code</TableHead>
              <TableHead>Dept Name</TableHead>
              <TableHead>Dept Name Eng</TableHead>
              <TableHead>Pic Name</TableHead>
              <TableHead>Pic Tel</TableHead>
              <TableHead>Pic Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Time Zone</TableHead>
              <TableHead>Add Date</TableHead>
              <TableHead>Add User Id</TableHead>
              <TableHead>Add User Name</TableHead>
              <TableHead>Update Date</TableHead>
              <TableHead>Update User id</TableHead>
              <TableHead>Update User Name</TableHead>
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
                  <TableCell>{item.CUSTOMER_CODE}</TableCell>
                  <TableCell>{item.CUSTOMER_TYPE}</TableCell>
                  <TableCell>{item.DEPT_CODE}</TableCell>
                  <TableCell>{item.DEPT_NAME}</TableCell>
                  <TableCell>{item.DEPT_NAME_ENG}</TableCell>
                  <TableCell>{item.PIC_NAME}</TableCell>
                  <TableCell>{item.PIC_TEL}</TableCell>
                  <TableCell>{item.PIC_EMAIL}</TableCell>
                  <TableCell>{item.STATUS}</TableCell>
                  <TableCell>{item.REMARKS}</TableCell>
                  <TableCell>{item.TIME_ZONE}</TableCell>
                  <TableCell>{dateFormat(item.ADD_DATE)}</TableCell>
                  <TableCell>{item.ADD_USER_ID}</TableCell>
                  <TableCell>{item.ADD_USER_NAME}</TableCell>
                  <TableCell>{dateFormat(item.UPDATE_DATE)}</TableCell>
                  <TableCell>{item.UPDATE_USER_ID}</TableCell>
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

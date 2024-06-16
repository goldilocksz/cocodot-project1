import { Plus, RefreshCcw, Route } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Order } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'
import { Card } from '@/components/ui/card'
import { useMutation, useQuery } from '@tanstack/react-query'
import request from '@/utils/request'
import Loading from '@/components/ui/loading'
import SearchLine from '@/components/form/SearchLine'
import OrderControl from '@/components/dialog/OrderControl'
import Pagination from '@/components/pagination'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import RouteInfoControl from '@/components/dialog/RouteInfoControl'

export default function OrderView() {
  const [searchData, setSearchData] = useState<Order[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [detail, setDetail] = useState<Order | undefined>()

  const {
    data: orderList,
    isPending,
    isRefetching,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ['getOrderList'],
    queryFn: async () => {
      const { data } = await request.post('/order/getOrderList', {})

      const orders: Order[] = data?.map((user: any, index: number) => ({
        ...user,
        id: index + 1,
      }))

      const allKeys = Array.from(
        new Set(orders.flatMap((obj) => Object.keys(obj))),
      ) as (keyof Order)[]

      const filterList = orders.map((obj, index: number) => {
        let newObj: any = {}
        newObj['id'] = index + 1
        allKeys.forEach((key) => {
          newObj[key] = obj[key] ?? ''
        })
        return newObj
      })
      setSearchData(orders)
      return filterList
    },
  })

  const { mutate: deleteOrder, isPending: isDeleteOrder } = useMutation({
    mutationKey: ['deleteOrder'],
    mutationFn: async () => {
      await request.post('/order/OrderDelete', {
        TR_NO: detail?.TR_NO,
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
      <Loading isLoading={isPending || isRefetching} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Order
          </Button>
        </div>
      </div>

      <Card className="relative mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchData={searchData}
          queryKey={['getOrderList']}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              {orderList?.[0] &&
                Object.keys(orderList?.[0]).map((key) => (
                  <TableHead key={key}>
                    {key.toLocaleLowerCase().replaceAll('_', ' ')}
                  </TableHead>
                ))}
              <TableHead>Route</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList
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
                  {Object.values(item).map((value, index) =>
                    dayjs(value).isValid() ? (
                      <TableCell
                        key={index}
                        onDoubleClick={() => {
                          setDetail(item)
                          setIsOpen(true)
                        }}
                      >
                        {dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                    ) : (
                      <TableCell key={index}>
                        {value !== 'NULL' && value}
                      </TableCell>
                    ),
                  )}
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => {
                        setDetail(item)
                        setOpen(true)
                      }}
                    >
                      <Route className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={
            orderList?.length
              ? Math.ceil(orderList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>

      <OrderControl
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsConfirm={setIsConfirm}
        refetch={refetch}
      />

      <RouteInfoControl
        open={open}
        setOpen={setOpen}
        detail={detail}
      ></RouteInfoControl>

      <ConfirmDialog
        title="Delete Order"
        desc="Are you sure you want to delete order"
        btnText="Delete"
        loading={isDeleteOrder}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => deleteOrder()}
      />
    </section>
  )
}

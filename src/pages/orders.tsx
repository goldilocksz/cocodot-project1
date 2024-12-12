import { Check, Plus, RefreshCcw, Route, X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useReducer, useState } from 'react'
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
import OrderSearch from '@/components/form/OrderSearch'
import { dateFormat } from '@/utils/utils'
import gridStyle from '@/gridStyle.css' // CSS 모듈 파일을 import합니다.
import GPSInfoControl from '@/components/dialog/GPSInfoControl'

export interface Search {
  JOB_DATE_FROM: string
  JOB_DATE_TO: string
  LSP_CD: string
  TR_NO: string
  random: number
}

export default function OrderView() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [list, setList] = useState<Order[]>([])
  const [search, setSearch] = useReducer(
    (state: Search, newState: Partial<Search>) => ({ ...state, ...newState }),
    {
      JOB_DATE_FROM: dayjs().subtract(13, 'day').format('YYYYMMDD'),
      JOB_DATE_TO: dayjs().format('YYYYMMDD'),
      LSP_CD: '',
      TR_NO: '',
      random: Math.random(),
    },
  )
  const [isOpen, setIsOpen] = useState(false)
  const [isRouteInfoOpen, setIsRouteInfoOpen] = useState(false)
  const [isGPSInfoOpen, setIsGPSInfoOpen] = useState(false)
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
    queryKey: ['getOrderList', search],
    queryFn: async () => {
      const { data } = await request.post('/order/getOrderList', {
        JOB_DATE_FROM: search.JOB_DATE_FROM,
        JOB_DATE_TO: search.JOB_DATE_TO,
        LSP_CD: search.LSP_CD,
        TR_NO: search.TR_NO,
      })

      return data
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

  // RouteInfoControl이 닫힐 때 OrderControl을 닫는 useEffect 추가
  useEffect(() => {
    if (!isRouteInfoOpen) {
      setIsOpen(false)
    }
  }, [isRouteInfoOpen])

  // GPSInfoControl이 닫힐 때 OrderControl을 닫는 useEffect 추가
  useEffect(() => {
    if (!isGPSInfoOpen) {
      setIsOpen(false)
    }
  }, [isGPSInfoOpen])

  const handleItemClick = (item: Order) => {
    if (user.CUSTOMER_TYPE === 'LSP' && user.GRADE === '3') {
      console.log('LSP')
      setDetail(item)
      // setIsGPSInfoOpen(true)
      // setIsRouteInfoOpen(true)
    } else {
      console.log('ADMIN')
      setDetail(item)
      setIsOpen(true)
    }
  }

  const handleRouteInfoClick = (item: Order) => {
    setDetail(item)
    setIsRouteInfoOpen(true) // RouteInfoControl 열기
    setIsOpen(false) // OrderControl 닫기
  }

  const handleGPSInfoClick = (item: Order) => {
    setDetail(item)
    setIsGPSInfoOpen(true) // GPSInfoControl 열기
    setIsOpen(false) // OrderControl 닫기
  }

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
          {user?.GRADE !== '3' && (
            <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          )}
        </div>
      </div>

      <Card className="relative mt-6 p-6">
        <OrderSearch search={search} setSearch={setSearch} />
        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>GPS</TableHead>
              <TableHead>TR No</TableHead>
              <TableHead>BL NO</TableHead>
              <TableHead>CNEE</TableHead>
              <TableHead>LSP CD</TableHead>
              <TableHead>POL</TableHead>
              <TableHead>VENDOR NAME</TableHead>
              <TableHead>INVOICE NO</TableHead>
              <TableHead>INCOTERMS</TableHead>
              <TableHead>FROM(BORDER)</TableHead>
              <TableHead>TO(BORDER)</TableHead>
              <TableHead>FROM TRUCK NO</TableHead>
              <TableHead>TRUCK TYPE</TableHead>
              <TableHead>TO TRUCK NO</TableHead>
              <TableHead>TRUCK TYPE</TableHead>
              <TableHead>REGION</TableHead>
              <TableHead>CC DONE TIME</TableHead>
              <TableHead>ITEM CODE</TableHead>
              <TableHead>PLT</TableHead>
              <TableHead>URGENT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(orderList) && orderList.length > 0 ? (
              orderList
                .slice(
                  (page - 1) * parseInt(pageSize),
                  page * parseInt(pageSize),
                )
                .map((item) => (
                  <TableRow
                    key={item.TR_NO}
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer md:cursor-auto"
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => handleRouteInfoClick(item)}
                      >
                        <Route className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => handleGPSInfoClick(item)}
                      >
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </TableCell>
                    <TableCell>{item.TR_NO}</TableCell>
                    <TableCell>{item.BL_NO}</TableCell>
                    <TableCell>{item.CNEE}</TableCell>
                    <TableCell>{item.LSP_CD}</TableCell>
                    <TableCell>{item.POL}</TableCell>
                    <TableCell>{item.VENDOR_NAME}</TableCell>
                    <TableCell>{item.REF_INVOICE_NO}</TableCell>
                    <TableCell>{item.INCOTERMS}</TableCell>
                    <TableCell>{item.FROM_ROUTE_CODE}</TableCell>
                    <TableCell>{item.TO_ROUTE_CODE}</TableCell>
                    <TableCell>{item.FROM_TRUCK_NO}</TableCell>
                    <TableCell>{item.FROM_TRUCK_TYPE}</TableCell>
                    <TableCell>{item.TO_TRUCK_NO}</TableCell>
                    <TableCell>{item.TO_TRUCK_TYPE}</TableCell>
                    <TableCell>{item.REGION_NAME}</TableCell>
                    <TableCell>{dateFormat(item.CC_DONE_TIME)}</TableCell>
                    <TableCell>{item.ITEM_CODE}</TableCell>
                    <TableCell>{item.PLT_QTY}</TableCell>
                    <TableCell>
                      {item.URGENT === 'Y' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </TableCell>
                  </TableRow>
                ))) : (
              <TableRow>
                <TableCell colSpan={21} className="text-center">
                  No data
                </TableCell>
              </TableRow>
            )
            }
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
        isOpen={!isRouteInfoOpen && !isGPSInfoOpen && isOpen} // RouteInfoControl이 열릴 때 OrderControl을 닫기
        setIsOpen={setIsOpen}
        setIsConfirm={setIsConfirm}
        isDeleteOrder={isDeleteOrder}
        refetch={refetch}
      />

      <RouteInfoControl
        open={isRouteInfoOpen}
        setOpen={setIsRouteInfoOpen}
        detail={detail}
      />

      <GPSInfoControl
        open={isGPSInfoOpen}
        setOpen={setIsGPSInfoOpen}
        detail={detail}
      />

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

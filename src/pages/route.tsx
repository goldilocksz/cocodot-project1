import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Edit, Plus, RefreshCcw, Trash2, X } from 'lucide-react'
import { Route, Auth } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/pagination'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import request from '@/utils/request'
import SearchLine from '@/components/form/SearchLine'
import RouteControl from '@/components/dialog/RouteControl'
import Loading from '@/components/ui/loading'
import dayjs from 'dayjs'

export default function RouteView() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [searchData, setSearchData] = useState<Route[]>([])
  const [detail, setDetail] = useState<Route | undefined>()
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

  const {
    data: routeList,
    isPending: isGetRouteList,
    isFetching: isRouteListFetching,
    refetch,
  } = useQuery<Route[]>({
    queryKey: ['getRouteList'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getRouteMstList', {})

      const routes = data?.map((route: any, index: number) => ({
        ...route,
        id: index + 1,
      }))
      setSearchData(routes)
      return routes
    },
  })

  const { mutate: deleteRoute, isPending: isDeleteRoute } = useMutation({
    mutationFn: async ({
      COMPANY_CODE,
      CUSTOMER_CODE,
      ROUTE_CODE,
      SEQ,
    }: {
      COMPANY_CODE: string
      CUSTOMER_CODE: string
      ROUTE_CODE: string
      SEQ: string
    }) => {
      const response = await request.post('/webCommon/RouteMstDelete', {
        COMPANY_CODE,
        CUSTOMER_CODE,
        ROUTE_CODE,
        SEQ,
      })

      if (response.data) {
        toast.error(response.data)
      } else {
        toast.success('User deleted successfully')
        window.location.reload()
      }
    },
  })

  const handleDelete = () => {
    if (!detail) return
    deleteRoute(detail)
    setIsConfirm(false)
  }

  return (
    <section className="relative grow">
      <Loading isLoading={isGetRouteList || isRouteListFetching} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Route Mst</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Route
          </Button>
        </div>
      </div>

      <Card className="relative mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchData={searchData}
          queryKey={['getRouteList']}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>customer code</TableHead>
              <TableHead>route code</TableHead>
              <TableHead>route name</TableHead>
              <TableHead>nation cd</TableHead>
              <TableHead>Seq</TableHead>
              <TableHead>Seq name</TableHead>
              <TableHead>status</TableHead>
              <TableHead>add user id</TableHead>
              <TableHead>add user name</TableHead>
              <TableHead>update date</TableHead>
              <TableHead>update date user name</TableHead>
              <TableHead>company code</TableHead>
              <TableHead>add date</TableHead>
              <TableHead>edit</TableHead>
              <TableHead>delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routeList?.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
            {routeList
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
                  <TableCell>{item.CUSTOMER_CODE}</TableCell>
                  <TableCell>{item.ROUTE_CODE}</TableCell>
                  <TableCell>{item.ROUTE_NAME}</TableCell>
                  <TableCell>{item.NATION_CD}</TableCell>
                  <TableCell>{item.SEQ}</TableCell>
                  <TableCell>{item.SEQ_NAME}</TableCell>
                  <TableCell>{item.STATUS}</TableCell>
                  <TableCell>{item.ADD_USER_ID}</TableCell>
                  <TableCell>{item.ADD_USER_NAME}</TableCell>
                  <TableCell>
                    {dayjs(item.UPDATE_DATE).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell>{item.UPDATE_USER_NAME}</TableCell>
                  <TableCell>{item.COMPANY_CODE}</TableCell>
                  <TableCell>
                    {dayjs(item.ADD_DATE).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell className="py-0">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => {
                        setDetail(item)
                        setIsOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="py-0">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => {
                        setDetail(item)
                        setIsConfirm(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={
            routeList?.length
              ? Math.ceil(routeList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>
      <ConfirmDialog
        title="Delete Route"
        desc="Are you sure you want to delete route"
        btnText="Delete"
        loading={isDeleteRoute}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => handleDelete()}
      />
      <RouteControl
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={refetch}
      />
    </section>
  )
}

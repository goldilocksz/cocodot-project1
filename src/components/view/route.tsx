'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { Card } from '../ui/card'
import { Edit, Search, Trash2, X } from 'lucide-react'
import { Route, Auth } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Button } from '../ui/button'
import page from './login'
import Pagination from '../pagination'
import Fuse from 'fuse.js'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import ConfirmDialog from '../dialog/ConfirmDialog'
import request from '@/lib/request'
import SearchLine from '../form/SearchLine'
import RouteControl from '../dialog/RouteControl'

export default function RouteView({
  auth,
  data,
}: {
  auth: Auth
  data: Route[]
}) {
  console.log(data)

  const [routeList, setRouteList] = useState<Route[]>(data)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [detail, setDetail] = useState<Route | undefined>()
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

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
      const data = await request({
        url: '/webCommon/RouteMstDelete',
        body: {
          COMPANY_CODE,
          CUSTOMER_CODE,
          ROUTE_CODE,
          SEQ,
        },
      })

      if (data.error) {
        toast.error(data.error)
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
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Route Mst</h1>
      </div>

      <Card className="relative mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          initData={data}
          list={routeList}
          setList={setRouteList}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader>
            <TableRow>
              <TableHead>COMPANY_CODE</TableHead>
              <TableHead>CUSTOMER_CODE</TableHead>
              <TableHead>ADD_USER_ID</TableHead>
              <TableHead>ADD_USER_NAME</TableHead>
              <TableHead>NATION_CD</TableHead>
              <TableHead>ROUTE_CODE</TableHead>
              <TableHead>ROUTE_NAME</TableHead>
              <TableHead>NATION_CD</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>UPDATE_DATE</TableHead>
              <TableHead>ADD_DATE</TableHead>
              <TableHead>EDIT</TableHead>
              <TableHead>DELETE</TableHead>
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
                  <TableCell>{item.COMPANY_CODE}</TableCell>
                  <TableCell>{item.CUSTOMER_CODE}</TableCell>
                  <TableCell>{item.ADD_USER_ID}</TableCell>
                  <TableCell>{item.ADD_USER_NAME}</TableCell>
                  <TableCell>{item.NATION_CD}</TableCell>
                  <TableCell>{item.ROUTE_CODE}</TableCell>
                  <TableCell>{item.ROUTE_NAME}</TableCell>
                  <TableCell>{item.NATION_CD}</TableCell>
                  <TableCell>{item.STATUS}</TableCell>
                  <TableCell>{item.UPDATE_DATE}</TableCell>
                  <TableCell>{item.ADD_DATE}</TableCell>
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
        auth={auth}
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}

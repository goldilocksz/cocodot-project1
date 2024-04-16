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

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

export default function route({
  auth,
  routes,
}: {
  auth: Auth
  routes: Route[]
}) {
  const [routeList, setRouteList] = useState<Route[]>(routes)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [detail, setDetail] = useState<Route | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

  // const {
  //   data: RouteMst,
  //   isPending: isGetRouteMst,
  //   isRefetching: isRouteMstRefetching,
  //   refetch,
  // } = useQuery<Route[]>({
  //   queryKey: ['getRouteMstList'],
  //   queryFn: async () => {
  //     const response = await fetch('/api/webCommon/getRouteMstList', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         COMPANY_CODE: auth.COMPANY_CODE,
  //         licenceKey: 'dfoTg05dkQflgpsVdklub',
  //       }),
  //     })
  //     const data = await response.json()

  //     if (data.length === 0 || data?.error) {
  //       toast.error(data.error)
  //       return []
  //     }
  //     const routes = data.map((route: Route, index: number) => ({
  //       ...route,
  //       id: index + 1,
  //     }))

  //     setRouteList(routes)
  //     return routes ?? []
  //   },
  // })

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
      const response = await fetch('/api/webCommon/RouteMstDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          COMPANY_CODE,
          CUSTOMER_CODE,
          ROUTE_CODE,
          SEQ,
          licenceKey: 'dfoTg05dkQflgpsVdklub',
        }),
      })
      const data = await response.json()

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

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
      setRouteList(routes ?? [])
    } else {
      if (!routes) return
      const fuse = new Fuse(routes, {
        includeScore: true,
        threshold: 0.3,
        keys: ['COMPANY_CODE', 'CUSTOMER_CODE', 'ADD_USER_ID', 'ADD_USER_NAME'],
      })
      setRouteList(fuse.search(search).map((item) => item.item) as Route[])
    }
  }

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Route Mst</h1>
      </div>

      <Card className="relative mt-6 p-6">
        <div className="flex items-center justify-between gap-2">
          <form
            className="flex w-80 items-center gap-2"
            onSubmit={handleSearch}
          >
            <div className="relative">
              <Input
                placeholder="search..."
                name="search"
                autoComplete="off"
                className="w-auto pr-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              {search.trim() && (
                <div
                  className="absolute right-0 top-0 cursor-pointer p-3"
                  onClick={() => {
                    setSearch('')
                    setRouteList(routes ?? [])
                  }}
                >
                  <X className="h-4 w-4" />
                </div>
              )}
            </div>
            <Button type="submit" disabled={search.trim().length === 0}>
              <Search className="mr-1 h-4 w-4" />
              Search
            </Button>
          </form>
          <div className="flex items-center gap-6 whitespace-nowrap">
            <div>
              <span className="text-sm text-muted-foreground">Count: </span>
              {routeList?.length}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Page:</div>
              <Select
                defaultValue={pageSize}
                onChange={(e) => {
                  setPage(1)
                  setPageSize(e.target.value)
                }}
              >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </div>
          </div>
        </div>

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
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => handleDelete()}
      />
    </section>
  )
}

'use client'

import AddUserDialog from '@/components/dialog/AddUserDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Plus, Search, Trash2, User, X } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import Pagination from '@/components/pagination'
// import { UserData } from '@/lib/data/users'
import Fuse from 'fuse.js'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

interface User {
  ID: number
  COMPANY_CODE: string
  USER_ID: string
  CUSTOMER_CODE: string
  PW: string
  USER_NAME: string
  DEPT_CODE: string
  TEL_NO: string
  EMAIL: string
  TRUCK_NO: string
  TRUCK_TYPE: string
  NATION_CD: string
  USE_YN: string
  LAST_LOGIN_DATE: string
  USER_LANG: string
  ACCOUNT_NAME: string
  GRADE: string
  STATUS: string
  REMARKS: string
  TIME_ZONE: string
  ADD_DATE: Date
  ADD_USER_ID: string
  ADD_USER_NAME: string
  UPDATE_DATE: Date
  UPDATE_USER_ID: string
  UPDATE_USER_NAME: string
}

export default function UsersPage() {
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [userList, setUserList] = useState<User[]>([])
  const [detail, setDetail] = useState<User | undefined>(undefined)

  const { data: UserData, isPending } = useQuery({
    queryKey: ['getUserList'],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/user/getUserList',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            licenceKey: 'dfoTg05dkQflgpsVdklub',
          }),
        },
      )
      const data = await response.json()
      if (data?.error) {
        toast.error(data.error)
        return []
      }

      setUserList(data)
      return data ?? []
    },
  })

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
      setUserList(UserData ?? [])
    } else {
      if (!UserData) return
      const fuse = new Fuse(UserData, {
        includeScore: true,
        threshold: 0.3,
        keys: [
          'COMPANY_CODE',
          'USER_ID',
          'CUSTOMER_CODE',
          'USER_NAME',
          'TEL_NO',
        ],
      })
      setUserList(fuse.search(search).map((item) => item.item) as User[])
    }
  }

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
        <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      <Card className="mt-6 p-6">
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
                    setUserList(UserData ?? [])
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

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader>
            <TableRow>
              <TableHead>USER ID</TableHead>
              <TableHead>USER NAME</TableHead>
              <TableHead>LSP CODE</TableHead>
              <TableHead>TELL NO.</TableHead>
              <TableHead>GRADE</TableHead>
              <TableHead>TRUCK NO</TableHead>
              <TableHead>TRUCK TYPE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>NATION_CD</TableHead>
              <TableHead>REMARK</TableHead>
              <TableHead>REVISE</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList?.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
            {userList
              ?.slice(
                (page - 1) * parseInt(pageSize),
                page * parseInt(pageSize),
              )
              .map((user) => (
                <TableRow
                  key={user.USER_ID}
                  onDoubleClick={() => {
                    setDetail(user)
                    setIsOpen(true)
                  }}
                >
                  <TableCell>{user.USER_ID}</TableCell>
                  <TableCell>{user.COMPANY_CODE}</TableCell>
                  <TableCell>{user.USER_NAME}</TableCell>
                  <TableCell>{user.TEL_NO}</TableCell>
                  <TableCell>{user.GRADE}</TableCell>
                  <TableCell>{user.TRUCK_NO}</TableCell>
                  <TableCell>{user.TRUCK_TYPE}</TableCell>
                  <TableCell>{user.STATUS}</TableCell>
                  <TableCell>{user.NATION_CD}</TableCell>
                  <TableCell>{user.REMARKS}</TableCell>
                  <TableCell className="py-0">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => {
                        setDetail(user)
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
            userList?.length
              ? Math.ceil(userList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>

      <AddUserDialog detail={detail} isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
}

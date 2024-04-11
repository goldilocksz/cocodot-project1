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
import { Edit, Plus, Trash2, User } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import Pagination from '@/components/pagination'
import { UserData } from '@/lib/data/users'

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

export default function UsersPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [detail, setDetail] = useState<(typeof UserData)[number] | undefined>(
    undefined,
  )

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    const search = event.currentTarget.search.value
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
    } else {
      setSearch(search)
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
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <Select className="w-[100px]">
              <option value="name">Name</option>
              <option value="tell">Tell</option>
              <option value="truck">Truck</option>
            </Select>
            <Input
              placeholder="Search..."
              name="search"
              className="max-w-xs"
              autoComplete="off"
            ></Input>
            <Button type="submit">Search</Button>
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
              <TableHead>LSP CODE</TableHead>
              <TableHead>USER NAME</TableHead>
              <TableHead>TELL NO.</TableHead>
              <TableHead>GRADE</TableHead>
              <TableHead>TRUCK NO.</TableHead>
              <TableHead>TRUCK TYPE</TableHead>
              <TableHead>NATION_CD</TableHead>
              <TableHead>REMARK</TableHead>
              <TableHead>REVISE</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {UserData.filter((user) =>
              search ? user.user_name.includes(search) : user,
            )
              .slice((page - 1) * parseInt(pageSize), page * parseInt(pageSize))
              .map((user) => (
                <TableRow
                  key={user.id}
                  onDoubleClick={() => {
                    setDetail(user)
                    setIsOpen(true)
                  }}
                >
                  <TableCell>{user.lsp_code}</TableCell>
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell>{user.tell_no}</TableCell>
                  <TableCell>{user.grade}</TableCell>
                  <TableCell>{user.truck_no}</TableCell>
                  <TableCell>{user.truck_type}</TableCell>
                  <TableCell>{user.nation_cd}</TableCell>
                  <TableCell>ㅂ</TableCell>
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
          totalPages={Math.ceil(
            UserData.filter((user) =>
              search ? user.user_name.includes(search) : user,
            ).length / parseInt(pageSize),
          )}
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>

      <AddUserDialog detail={detail} isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
}

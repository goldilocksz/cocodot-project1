'use client'

import { Code } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Edit, Search, Trash2, X } from 'lucide-react'
import { Button } from '../ui/button'
import page from './login'
import { FormEvent, useState } from 'react'
import { Card } from '../ui/card'
import Pagination from '../pagination'
import { Select } from '../ui/select'
import Fuse from 'fuse.js'
import { Input } from '../ui/input'

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

export default function common({ data }: { data: Code[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [codeList, setCodeList] = useState<Code[]>(data)
  const [detail, setDetail] = useState<Code | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
      setCodeList(data ?? [])
    } else {
      if (!data) return
      const fuse = new Fuse(data, {
        includeScore: true,
        threshold: 0.3,
        keys: ['COMPANY_CODE', 'CUSTOMER_CODE', 'ADD_USER_ID', 'ADD_USER_NAME'],
      })
      setCodeList(fuse.search(search).map((item) => item.item) as Code[])
    }
  }

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Common Code</h1>
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
                    setCodeList(data ?? [])
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
              {codeList?.length}
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
              <TableHead>GROUP_CODE</TableHead>
              <TableHead>DT_CODE</TableHead>
              <TableHead>USE_YN</TableHead>
              <TableHead>LOC_VALUE</TableHead>
              <TableHead>ENG_VALUE</TableHead>
              <TableHead>ETC1</TableHead>
              <TableHead>ETC2</TableHead>
              <TableHead>ETC3</TableHead>
              <TableHead>ETC4</TableHead>
              <TableHead>ETC5</TableHead>
              <TableHead>ETC6</TableHead>
              <TableHead>ETC7</TableHead>
              <TableHead>SORT_SEQ_NO</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>REMARKS</TableHead>
              <TableHead>TIME_ZONE</TableHead>
              <TableHead>ADD_DATE</TableHead>
              <TableHead>ADD_USER_ID</TableHead>
              <TableHead>ADD_USER_NAME</TableHead>
              <TableHead>UPDATE_DATE</TableHead>
              <TableHead>UPDATE_USER_ID</TableHead>
              <TableHead>UPDATE_USER_NAME</TableHead>
              <TableHead>EDIT</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codeList?.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
            {codeList
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
                  <TableCell>{item.GROUP_CODE}</TableCell>
                  <TableCell>{item.DT_CODE}</TableCell>
                  <TableCell>{item.USE_YN}</TableCell>
                  <TableCell>{item.LOC_VALUE}</TableCell>
                  <TableCell>{item.ENG_VALUE}</TableCell>
                  <TableCell>{item.ETC1}</TableCell>
                  <TableCell>{item.ETC2}</TableCell>
                  <TableCell>{item.ETC3}</TableCell>
                  <TableCell>{item.ETC4}</TableCell>
                  <TableCell>{item.ETC5}</TableCell>
                  <TableCell>{item.ETC6}</TableCell>
                  <TableCell>{item.ETC7}</TableCell>
                  <TableCell>{item.SORT_SEQ_NO}</TableCell>
                  <TableCell>{item.STATUS}</TableCell>
                  <TableCell>{item.REMARKS}</TableCell>
                  <TableCell>{item.TIME_ZONE}</TableCell>
                  <TableCell>{item.ADD_DATE}</TableCell>
                  <TableCell>{item.ADD_USER_ID}</TableCell>
                  <TableCell>{item.ADD_USER_NAME}</TableCell>
                  <TableCell>{item.UPDATE_DATE}</TableCell>
                  <TableCell>{item.UPDATE_USER_ID}</TableCell>
                  <TableCell>{item.UPDATE_USER_NAME}</TableCell>
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
            codeList?.length
              ? Math.ceil(codeList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>
    </section>
  )
}

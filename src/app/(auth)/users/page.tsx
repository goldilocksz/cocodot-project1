'use client'

import AddUserDialog from '@/components/dialog/AddUserDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Pagination from '@/components/pagination'

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('30')
  const [isOpen, setIsOpen] = useState(false)

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
          <div className="flex items-center gap-2">
            <Select className="w-[100px]">
              <option value="name">Name</option>
              <option value="tell">Tell</option>
              <option value="truck">Truck</option>
            </Select>
            <Input placeholder="Search..." className="max-w-xs"></Input>
            <Button>Search</Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Page:</div>
            <Select
              defaultValue={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
          </div>
        </div>

        <Table className="mt-6 min-w-[1280px] table-fixed">
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
            {Array.from({ length: parseInt(pageSize) }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>GDLCN</TableCell>
                <TableCell>HANS</TableCell>
                <TableCell>1862223333</TableCell>
                <TableCell>3</TableCell>
                <TableCell>RD1234</TableCell>
                <TableCell>45FT</TableCell>
                <TableCell>CHINA</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="py-0">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full p-0"
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

        <Pagination page={page} setPage={setPage} />
      </Card>

      <AddUserDialog detail={undefined} isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  )
}

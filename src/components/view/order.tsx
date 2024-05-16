'use client'

import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Auth, Order } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import page from '@/app/(auth)/page'
import dayjs from 'dayjs'
import { Card } from '../ui/card'
import OrderControl from '../dialog/OrderControl'

export default function OrderView({
  auth,
  data,
}: {
  auth: Auth
  data: Order[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [detail, setDetail] = useState<Order | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
        <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Order
        </Button>
      </div>

      <Card className="relative mt-6 p-6">
        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <TableHead key={key}>
                    {key.toLocaleLowerCase().replaceAll('_', ' ')}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      <OrderControl
        auth={auth}
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}

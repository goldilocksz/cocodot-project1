'use client'

import { Auth, Code } from '@/types/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { FormEvent, useEffect, useState } from 'react'
import { Card } from '../ui/card'
import Pagination from '../pagination'
import Fuse from 'fuse.js'
import SearchLine from '../form/SearchLine'
import CommonControl from '../dialog/CommonControl'
import ConfirmDialog from '../dialog/ConfirmDialog'
import { useMutation } from '@tanstack/react-query'
import request from '@/lib/request'
import { toast } from 'sonner'

export default function CommonView({
  auth,
  data,
}: {
  auth: Auth
  data: Code[]
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [codeList, setCodeList] = useState<Code[]>(data)
  const [detail, setDetail] = useState<Code>()
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setDetail(undefined)
    }
  }, [isOpen])

  const { mutate: deleteCode, isPending: isDeleteCode } = useMutation({
    mutationFn: async ({
      GROUP_CODE,
      DT_CODE,
    }: {
      GROUP_CODE: string
      DT_CODE: string
    }) => {
      const response = await request({
        url: '/webCommon/CommonCodeDelete',
        body: {
          GROUP_CODE,
          DT_CODE,
        },
      })

      if (!response) {
        toast.error('Failed to delete user')
      } else {
        window.location.reload()
      }
    },
  })

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Common Code</h1>
        <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Code
        </Button>
      </div>

      <Card className="mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          initData={data}
          list={codeList}
          setList={setCodeList}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>group code</TableHead>
              <TableHead>dt code</TableHead>
              <TableHead>use yn</TableHead>
              <TableHead>loc value</TableHead>
              <TableHead>eng value</TableHead>
              <TableHead>etc1</TableHead>
              <TableHead>etc2</TableHead>
              <TableHead>etc3</TableHead>
              <TableHead>etc4</TableHead>
              <TableHead>etc5</TableHead>
              <TableHead>etc6</TableHead>
              <TableHead>etc7</TableHead>
              <TableHead>sort seq no</TableHead>
              <TableHead>remarks</TableHead>
              <TableHead>edit</TableHead>
              <TableHead>delete</TableHead>
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
                  <TableCell>{item.REMARKS}</TableCell>
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
      <CommonControl
        auth={auth}
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <ConfirmDialog
        title="Delete Code"
        desc={`Are you sure you want to delete code`}
        btnText="Delete"
        loading={isDeleteCode}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() =>
          deleteCode({
            GROUP_CODE: detail?.GROUP_CODE ?? '',
            DT_CODE: detail?.DT_CODE ?? '',
          })
        }
      />
    </section>
  )
}

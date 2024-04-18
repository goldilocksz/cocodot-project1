'use client'

import AddUserDialog from '@/components/dialog/AddUserDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Pagination from '@/components/pagination'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import { Auth, User } from '@/types/data'
import SearchLine from '../form/SearchLine'
import request from '@/lib/request'

export default function UsersPage({
  auth,
  users,
}: {
  auth: Auth
  users: User[]
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [userList, setUserList] = useState<User[]>(users)
  const [detail, setDetail] = useState<User | undefined>()
  const [isConfirm, setIsConfirm] = useState(false)
  const [isConfirmReset, setIsConfirmReset] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setDetail(undefined)
    }
  }, [isOpen])

  const { mutate: deleteUser, isPending: isDeleteUser } = useMutation({
    mutationFn: async ({
      USER_ID,
      COMPANY_CODE,
    }: {
      USER_ID: string
      COMPANY_CODE: string
    }) => {
      const response = await request({
        url: '/user/userDelete',
        body: {
          S_USER_ID: auth.USER_ID,
          S_COMPANY_CODE: auth.COMPANY_CODE,
          USER_ID,
          COMPANY_CODE,
        },
      })

      if (!response) {
        toast.error('Failed to delete user')
      } else {
        window.location.reload()
      }
    },
  })

  const { mutate: resetPassword, isPending: isResetPassword } = useMutation({
    mutationFn: async ({
      USER_ID,
      COMPANY_CODE,
    }: {
      USER_ID: string
      COMPANY_CODE: string
    }) => {
      const response = await request({
        url: '/user/PWRest',
        body: {
          S_USER_ID: auth.USER_ID,
          S_USER_NAME: auth.USER_NAME,
          S_COMPANY_CODE: auth.COMPANY_CODE,
          USER_ID,
          COMPANY_CODE,
        },
      })

      if (!response) {
        toast.error('Failed to delete user')
      } else {
        // window.location.reload()
      }
    },
  })

  const handleReset = () => {
    if (!detail) return
    resetPassword({
      USER_ID: detail.USER_ID,
      COMPANY_CODE: detail.COMPANY_CODE,
    })
  }

  const handleDelete = () => {
    if (!detail) return
    deleteUser({
      USER_ID: detail.USER_ID,
      COMPANY_CODE: detail.COMPANY_CODE,
    })
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

      <Card className="relative mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          initData={users}
          list={userList}
          setList={setUserList}
          searchKey={[
            'COMPANY_CODE',
            'USER_ID',
            'CUSTOMER_CODE',
            'USER_NAME',
            'TEL_NO',
          ]}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader>
            <TableRow>
              <TableHead>USER_ID</TableHead>
              <TableHead>USER_NAME</TableHead>
              <TableHead>COMPANY_CODE</TableHead>
              <TableHead>TELL_NO.</TableHead>
              <TableHead>GRADE</TableHead>
              <TableHead>TRUCK_NO</TableHead>
              <TableHead>TRUCK_TYPE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>NATION_CD</TableHead>
              <TableHead>REMARK</TableHead>
              <TableHead>EDIT</TableHead>
              <TableHead>RESET</TableHead>
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
                  <TableCell>{user.USER_NAME}</TableCell>
                  <TableCell>{user.COMPANY_CODE}</TableCell>
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
                      onClick={() => {
                        setDetail(user)
                        setIsConfirmReset(true)
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="py-0">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => {
                        setDetail(user)
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
            userList?.length
              ? Math.ceil(userList.length / parseInt(pageSize))
              : 1
          }
          currentPage={page}
          setCurrentPage={setPage}
        />
      </Card>

      <AddUserDialog
        auth={auth}
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <ConfirmDialog
        title="Reset Password"
        desc={`Are you sure you want to reset password for user ${detail?.USER_NAME}`}
        btnText="Reset"
        loading={isResetPassword}
        isOpen={isConfirmReset}
        setIsOpen={setIsConfirmReset}
        callback={() => handleReset()}
      />
      <ConfirmDialog
        title="Delete User"
        desc={`Are you sure you want to delete user ${detail?.USER_NAME}`}
        btnText="Delete"
        loading={isDeleteUser}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => handleDelete()}
      />
    </section>
  )
}

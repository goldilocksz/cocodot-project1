import AddUserDialog from '@/components/dialog/UserControl'
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
import { Edit, Plus, RefreshCcw, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Pagination from '@/components/pagination'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import { Auth, User } from '@/types/data'
import SearchLine from '@/components/form/SearchLine'
import request from '@/utils/request'
import Loading from '@/components/ui/loading'

export default function UsersView() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [searchData, setSearchData] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [detail, setDetail] = useState<User | undefined>()
  const [isConfirm, setIsConfirm] = useState(false)
  const [isConfirmReset, setIsConfirmReset] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setDetail(undefined)
    }
  }, [isOpen])

  const {
    data: userList,
    isPending,
    refetch,
    isRefetching,
  } = useQuery<User[]>({
    queryKey: ['getUserList'],
    queryFn: async () => {
      const { data } = await request.post('/user/getUserList', {})

      const users = data?.map((user: any, index: number) => ({
        ...user,
        id: index + 1,
      }))
      setSearchData(users)
      return users
    },
  })

  const { mutate: deleteUser, isPending: isDeleteUser } = useMutation({
    mutationFn: async ({
      USER_ID,
      COMPANY_CODE,
    }: {
      USER_ID: string
      COMPANY_CODE: string
    }) => {
      const response = await request.post('/user/userDelete', {
        USER_ID,
        COMPANY_CODE,
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
      const response = await request.post('/user/PWRest', {
        USER_ID,
        COMPANY_CODE,
      })

      if (!response) {
        toast.error('Failed to delete user')
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
    <section className="relative grow">
      <Loading isLoading={isPending || isRefetching} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <Button className="flex gap-1" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            User
          </Button>
        </div>
      </div>

      <Card className="relative mt-6 p-6">
        <SearchLine
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchData={searchData}
          queryKey={['getUserList']}
          searchKey={[
            'USER_ID',
            'COMPANY_CODE',
            'CUSTOMER_CODE',
            'USER_NAME',
            'TEL_NO',
          ]}
        />

        <Table className="mt-6 min-w-[1280px]">
          <TableHeader className="capitalize">
            <TableRow>
              <TableHead>user id</TableHead>
              <TableHead>customer code</TableHead>
              <TableHead>password</TableHead>
              <TableHead>user name</TableHead>
              <TableHead>dept code</TableHead>
              <TableHead>tell no</TableHead>
              <TableHead>email</TableHead>
              <TableHead>truck no</TableHead>
              <TableHead>truck type</TableHead>
              <TableHead>nation code</TableHead>
              <TableHead>use yN</TableHead>
              <TableHead>user lang</TableHead>
              <TableHead>account name</TableHead>
              <TableHead>grade</TableHead>
              <TableHead>rest</TableHead>
              <TableHead>delete</TableHead>
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
                  <TableCell>{user.CUSTOMER_CODE}</TableCell>
                  <TableCell>{user.PW}</TableCell>
                  <TableCell>{user.USER_NAME}</TableCell>
                  <TableCell>{user.DEPT_CODE}</TableCell>
                  <TableCell>{user.TEL_NO}</TableCell>
                  <TableCell>{user.EMAIL}</TableCell>
                  <TableCell>{user.TRUCK_NO}</TableCell>
                  <TableCell>{user.TRUCK_TYPE}</TableCell>
                  <TableCell>{user.NATION_CD}</TableCell>
                  <TableCell>{user.USE_YN}</TableCell>
                  <TableCell>{user.USER_LANG}</TableCell>
                  <TableCell>{user.ACCOUNT_NAME}</TableCell>
                  <TableCell>{user.GRADE}</TableCell>
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
        detail={detail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={refetch}
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

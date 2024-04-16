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
import { Edit, Plus, Trash2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import Pagination from '@/components/pagination'
import Fuse from 'fuse.js'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import { revalidatePath } from 'next/cache'
import { Auth, User } from '@/types/data'
import SearchLine from '../form/SearchLine'

interface SearchElement extends HTMLFormControlsCollection {
  search: HTMLInputElement
}

interface SearchFormProps extends HTMLFormElement {
  readonly elements: SearchElement
}

export default function UsersPage({
  auth,
  users,
}: {
  auth: Auth
  users: User[]
}) {
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [userList, setUserList] = useState<User[]>(users)
  const [detail, setDetail] = useState<User | undefined>()
  const [isConfirm, setIsConfirm] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setDetail(undefined)
    }
  }, [isOpen])

  // const {
  //   data: UserData,
  //   refetch,
  //   isLoading: isGetUserData,
  //   isRefetching: isRefetchingUserData,
  // } = useQuery({
  //   queryKey: ['getUserList'],
  //   queryFn: async () => {
  //     const response = await fetch('/api/user/getUserList', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         licenceKey: 'dfoTg05dkQflgpsVdklub',
  //       }),
  //     })
  //     const data = await response.json()

  //     if (data.length === 0 || data?.error) {
  //       toast.error(data.error)
  //       return []
  //     }

  //     const users = data.filter((item: User) => item.USE_YN === 'Y')

  //     setUserList(users)
  //     return users ?? []
  //   },
  //   staleTime: 0,
  // })

  const { mutate: deleteUser, isPending: isDeleteUser } = useMutation({
    mutationFn: async ({
      USER_ID,
      COMPANY_CODE,
    }: {
      USER_ID: string
      COMPANY_CODE: string
    }) => {
      const response = await fetch('/api/user/userDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USER_ID,
          COMPANY_CODE,
          licenceKey: 'dfoTg05dkQflgpsVdklub',
        }),
      })
      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success('User deleted successfully')
        revalidatePath('/users')
      }
    },
  })

  const handleDelete = () => {
    if (!detail) return
    deleteUser({
      USER_ID: detail.USER_ID,
      COMPANY_CODE: detail.COMPANY_CODE,
    })
    setIsConfirm(false)
  }

  const handleSearch = (event: FormEvent<SearchFormProps>) => {
    event.preventDefault()
    setPage(1)
    if (!search.trim()) {
      event.currentTarget.search.focus()
      setSearch('')
      setUserList(users ?? [])
    } else {
      if (!users) return
      const fuse = new Fuse(users, {
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
                    console.log(user)

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
        title="Delete User"
        desc={`Are you sure you want to delete user ${detail?.USER_NAME}`}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => handleDelete()}
      />
    </section>
  )
}

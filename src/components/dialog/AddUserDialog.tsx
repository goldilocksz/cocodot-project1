import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { useMutation } from '@tanstack/react-query'
import TruckType from '../form/TruckType'
import NationCode from '../form/NationCode'
import { Auth } from '@/types/data'
import { toast } from 'sonner'

type Props = {
  auth: Auth
  detail: any
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  USER_ID: z.string().min(1, {
    message: 'UserId is required',
  }),
  USER_NAME: z.string().min(1, {
    message: 'UserName is required',
  }),
  TEL_NO: z.string().min(1, {
    message: 'Tel No is required',
  }),
  PW: z.string().min(1, {
    message: 'Password is required',
  }),
  COMPANY_CODE: z.string().min(1, {
    message: 'Company Code is required',
  }),
  CUSTOMER_CODE: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  NATION_CD: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  TRUCK_TYPE: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  TRUCK_NO: z.string().min(1, {
    message: 'Trunck no is required',
  }),
  STATUS: z.string().min(1, {
    message: 'Status is required',
  }),
  DEPT_CODE: z.string().min(1, {
    message: 'Department Code is required',
  }),
  REMARKS: z
    .string()
    .min(1, {
      message: 'Remarks is required',
    })
    .max(100, {
      message: 'Remarks must be less than 100 characters',
    }),
})

export default function AddUserDialog({
  auth,
  detail,
  isOpen,
  setIsOpen,
}: Props) {
  const defaultValues = {
    USER_ID: '',
    USER_NAME: '',
    TEL_NO: '',
    PW: '',
    COMPANY_CODE: '',
    CUSTOMER_CODE: '',
    NATION_CD: '',
    TRUCK_TYPE: '',
    TRUCK_NO: '',
    STATUS: '',
    DEPT_CODE: '',
    REMARKS: '',
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { mutate: UpdateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/user/userSave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...value,
          S_USER_ID: auth.USER_ID,
          S_USER_NAME: auth.USER_NAME,
          S_COMPANY_CODE: auth.COMPANY_CODE,
          licenceKey: 'dfoTg05dkQflgpsVdklub',
        }),
      })
      const data = await response.json()
      if (data === 0) {
        toast.error('Failed to update user information')
        return
      }
      setIsOpen(false)
      window.location.reload()
    },
  })

  useEffect(() => {
    if (detail) {
      console.log(detail)

      form.reset(detail)
    } else {
      form.reset(defaultValues)
    }
  }, [isOpen, detail])

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (detail) {
      UpdateUser(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} User Information</DialogTitle>
          <DialogDescription>Shipping information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="userForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="USER_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USER_ID</FormLabel>
                  <FormControl>
                    <Input placeholder="USER_ID" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="USER_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USER_NAME</FormLabel>
                  <FormControl>
                    <Input placeholder="USER_NAME" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CUSTOMER_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUSTOMER_CODE</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TRUCK_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TRUCK_NO</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TRUCK_TYPE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TRUCK_TYPE</FormLabel>
                  <FormControl>
                    <TruckType {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NATION_CD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NATION_CD</FormLabel>
                  <FormControl>
                    <NationCode {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TEL_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TEL_NO</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="STATUS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>STATUS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="REMARKS"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>REMARKS</FormLabel>
                  <FormControl>
                    <Textarea placeholder="REMARK" {...field}></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="sm:justify-center">
          <Button type="submit" form="userForm">
            {isUpdateUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {detail ? 'Update' : 'Add'}
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

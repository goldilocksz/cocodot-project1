import { useState, useEffect } from 'react'
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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Select } from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import GoogleMap from '../map'
import { useMutation, useQuery } from '@tanstack/react-query'

type Props = {
  detail: any
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  USER_ID: z.string().min(1, {
    message: 'UserId is required',
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
  DEPT_CODE: z.string().min(1, {
    message: 'Department Code is required',
  }),
  TEL_NO: z.string().min(1, {
    message: 'Tel No is required',
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

export default function AddUserDialog({ detail, isOpen, setIsOpen }: Props) {
  const [isLoading, setIsLoading] = useState()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      USER_ID: '',
      PW: '',
      COMPANY_CODE: '',
      CUSTOMER_CODE: '',
      DEPT_CODE: '',
      TEL_NO: '',
      REMARKS: '',
    },
  })

  const { data: CommonCode, isPending } = useQuery({
    queryKey: ['getCommonCode'],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/webCommon/getLSPCode',
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
      console.log(data)

      return data
    },
    enabled: false,
  })

  const { mutate: UpdateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/user/userUpdate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...value,
            licenceKey: 'dfoTg05dkQflgpsVdklub',
          }),
        },
      )
      const data = await response.json()
      console.log(data)
    },
  })

  useEffect(() => {
    if (detail) {
      form.reset(detail)
    } else {
      form.reset({
        USER_ID: '',
        PW: '',
        COMPANY_CODE: '',
        CUSTOMER_CODE: '',
        DEPT_CODE: '',
        TEL_NO: '',
        REMARKS: '',
      })
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
                    <Input placeholder="USER_ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PW"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PASSWORD</FormLabel>
                  <FormControl>
                    <Input placeholder="LSP_CODE" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="COMPANY_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>COMPANY_CODE</FormLabel>
                  <FormControl>
                    <Input placeholder="COMPANY_CODE" {...field} />
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
              name="DEPT_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TRUCK_TYPE</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="45FT">45FT</option>
                      <option value="45FTA">45FT AIRSUS</option>
                      <option value="40RF">40RF</option>
                      <option value="10T">10T</option>
                      <option value="8T">8T</option>
                      <option value="5T">5T</option>
                      <option value="3.5T">3.5T</option>
                      <option value="2.5T">2.5T</option>
                      <option value="1.5T">1.5T</option>
                    </Select>
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
                  <FormLabel>REMARK</FormLabel>
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
            <div className="col-span-2 mt-6 flex items-center justify-center gap-4">
              <Button type="submit">
                {isUpdateUser && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {detail ? 'Update' : 'Add'}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

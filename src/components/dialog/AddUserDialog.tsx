import { useLayoutEffect, useState } from 'react'
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
import { Select } from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'

type Props = {
  detail: any
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  lsp_code: z.string().min(1, {
    message: 'LSP Code is required',
  }),
  driver_name: z.string().min(1, {
    message: 'Driver Name is required',
  }),
  tell_no: z.string().min(1, {
    message: 'Tel No is required',
  }),
  nation_cd: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  driver_lang: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  time_zone: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  truck_no: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  truck_type: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  remark: z.string().min(1, {
    message: 'Nation Code is required',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
})

export default function AddUserDialog({ detail, isOpen, setIsOpen }: Props) {
  const [isLoading, setIsLoading] = useState()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lsp_code: '',
      tell_no: '',
      remark: '',
      password: '',
    },
  })

  useLayoutEffect(() => {
    if (detail) {
      console.log(detail)

      form.reset(detail)
    }
  }, [detail])

  const onSubmit = async (value: z.infer<typeof formSchema>) => {}

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} User Information</DialogTitle>
          <DialogDescription>
            Shipping information{form.getValues('lsp_code')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="lsp_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LSP_CODE</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="LSP_CODE"
                      type="text"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tell_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TELL_NO</FormLabel>
                  <FormControl>
                    <Input placeholder="Tell no" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type="password"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="truck_type"
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
              name="truck_type"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>REMARK</FormLabel>
                  <FormControl>
                    <Textarea placeholder="REMARK"></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex items-center justify-center">
              <Button type="submit" className="mt-6">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

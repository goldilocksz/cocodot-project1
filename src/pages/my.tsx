import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReactNode, useEffect } from 'react'
import { Control, FieldValues, Path, useForm } from 'react-hook-form'
import { omit } from 'radash'
import { useMutation } from '@tanstack/react-query'
import request from '@/utils/request'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function my() {
  const user = localStorage.getItem('user')
  const form = useForm({
    defaultValues: {
      USER_ID: '',
      PW: '',
      USER_NAME: '',
      TEL_NO: '',
      EMAIL: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        ...omit(JSON.parse(user), ['PW']),
      })
    }
  }, [user])

  const { mutate: UpdateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (value: any) => {
      const response = await request.post('/user/userSave', {
        ...value,
      })
      if (!response) {
        toast.error('Failed to update user information')
      } else {
        toast.success('User information updated successfully')
        localStorage.setItem('user', JSON.stringify(value))
      }
    },
  })

  const onSubmit = () => {
    UpdateUser(form.getValues())
  }
  return (
    <div>
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">My page</h1>
      </div>
      <Card className="relative mt-6 p-6">
        <Form {...form}>
          <form
            id="routeForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="USER_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">User Id</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-gray-200" />
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
                  <FormLabel className="capitalize">
                    PW
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="capitalize">
                    User Name
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="capitalize">Tel No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="EMAIL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 mt-4 flex items-center justify-center">
              <Button type="submit" disabled={isUpdateUser}>
                {isUpdateUser ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

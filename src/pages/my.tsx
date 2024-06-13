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

interface FormFieldItemProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  isRequired?: boolean
  children: ReactNode
  form: { control: Control<T> }
}

const FormFieldItem = <T extends FieldValues>({
  name,
  label,
  isRequired,
  children,
  form,
}: FormFieldItemProps<T>) => {
  return (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={(_) => (
        <FormItem>
          <FormLabel className="capitalize">
            {label
              ? label
              : name.includes('_')
                ? name.replace(/_/g, ' ').toLowerCase()
                : name}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>{children}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

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
      }
    },
  })

  const onSubmit = () => {
    console.log('asd')
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
            <FormFieldItem form={form} name="USER_ID">
              <Input
                {...form.register('USER_ID')}
                readOnly
                className="bg-gray-200"
              />
            </FormFieldItem>
            <FormFieldItem form={form} name="PW">
              <Input {...form.register('PW')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="USER_NAME">
              <Input {...form.register('USER_NAME')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="TEL_NO">
              <Input {...form.register('TEL_NO')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="EMAIL">
              <Input {...form.register('EMAIL')} />
            </FormFieldItem>
            <div className="col-span-2 mt-4 flex items-center justify-center">
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

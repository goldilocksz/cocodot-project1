import { ReactNode, useEffect } from 'react'
import { Control, FieldValues, Path, useForm } from 'react-hook-form'
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
import { useMutation } from '@tanstack/react-query'
import NationCode from '../form/NationCode'
import { User } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import { Switch } from '../ui/switch'
import Customer from '../form/Customer'
import DeptCodeSelect from '../form/DeptCode'
import CommonTruckType from '../form/CommonTruckType'
import UserLang from '../form/UserLang'

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

type Props = {
  detail: User | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  refetch: () => void
}

const formSchema = z.object({
  USER_ID: z
    .string()
    .min(1, {
      message: 'UserId is required',
    })
    .max(20, {
      message: 'UserId must be less than 20 characters',
    }),
  CUSTOMER_CODE: z
    .string()
    .min(1, {
      message: 'Customer Code is required',
    })
    .max(10, {
      message: 'Customer Code must be less than 10 characters',
    }),
  PW: z.string().optional(),
  USER_NAME: z
    .string()
    .min(1, {
      message: 'UserName is required',
    })
    .max(20, {
      message: 'UserName must be less than 20 characters',
    }),
  DEPT_CODE: z
    .string()
    .min(1, {
      message: 'Dept Code is required',
    })
    .max(10, {
      message: 'Dept Code must be less than 10 characters',
    }),
  TEL_NO: z
    .string()
    .min(1, {
      message: 'Tel No is required',
    })
    .max(20, {
      message: 'Tel No must be less than 20 characters',
    }),
  EMAIL: z.string().optional(),
  TRUCK_NO: z
    .string()
    .max(10, {
      message: 'Truck No must be less than 10 characters',
    })
    .optional(),
  TRUCK_TYPE: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  NATION_CD: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  USE_YN: z.string().min(1, {
    message: 'Use YN is required',
  }),
  USER_LANG: z.string().min(1, {
    message: 'User Lang is required',
  }),
  ACCOUNT_NAME: z
    .string()
    .max(50, {
      message: 'Account Name must be less than 50 characters',
    })
    .optional(),
})

const defaultValues = {
  USER_ID: '',
  CUSTOMER_CODE: '',
  PW: '',
  USER_NAME: '',
  DEPT_CODE: '',
  TEL_NO: '',
  EMAIL: '',
  TRUCK_NO: '',
  TRUCK_TYPE: '',
  NATION_CD: '',
  USE_YN: 'Y',
  USER_LANG: '',
  ACCOUNT_NAME: '',
}

export default function UserControl({
  detail,
  isOpen,
  setIsOpen,
  refetch,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { mutate: UpdateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request.post('/user/userSave', {
        ...value,
      })
      if (!response) {
        toast.error('Failed to update user information')
      } else {
        setIsOpen(false)
        refetch()
      }
    },
  })

  useEffect(() => {
    if (detail) {
      form.reset(detail)
    } else {
      form.reset(defaultValues)
    }
  }, [isOpen, detail])

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value)

    UpdateUser(value)
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
            <FormFieldItem form={form} name="USER_ID" isRequired>
              <Input {...form.register('USER_ID')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="PW">
              <Input {...form.register('PW')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="CUSTOMER_CODE" isRequired>
              <Customer {...form.register('CUSTOMER_CODE')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="DEPT_CODE" isRequired>
              <DeptCodeSelect
                CUSTOMER_CODE={form.watch('CUSTOMER_CODE')}
                {...form.register('DEPT_CODE')}
              />
            </FormFieldItem>
            <FormFieldItem form={form} name="USER_NAME" isRequired>
              <Input {...form.register('USER_NAME')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="ACCOUNT_NAME">
              <Input {...form.register('ACCOUNT_NAME')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="TEL_NO" isRequired>
              <Input {...form.register('TEL_NO')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="EMAIL">
              <Input {...form.register('EMAIL')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="NATION_CD" isRequired>
              <NationCode {...form.register('NATION_CD')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="TRUCK_NO" isRequired>
              <Input {...form.register('TRUCK_NO')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="TRUCK_TYPE">
              <CommonTruckType {...form.register('TRUCK_TYPE')} />
            </FormFieldItem>
            <FormFieldItem form={form} name="USER_LANG" isRequired>
              <UserLang {...form.register('USER_LANG')} />
            </FormFieldItem>
            <FormFieldItem form={form} label="Use Y/N" name="USE_YN">
              <Switch
                checked={form.watch('USE_YN') === 'Y'}
                onCheckedChange={(check) =>
                  form.setValue('USE_YN', check ? 'Y' : 'N')
                }
                className="!mt-4 block"
              />
            </FormFieldItem>
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

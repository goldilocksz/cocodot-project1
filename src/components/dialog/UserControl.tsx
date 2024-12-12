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
import Customer from '../form/Customer'
import DeptCodeSelect from '../form/DeptCode'
import CommonTruckType from '../form/CommonTruckType'
import UserLang from '../form/UserLang'
import { Switch } from '../ui/switch'

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
  TRUCK_NO: z.string().optional(),
  TRUCK_TYPE: z.string().optional(),
  NATION_CD: z.string().min(1, {
    message: 'Customer Code is required',
  }),
  USE_YN: z.string().min(1, {
    message: 'Use YN is required',
  }),
  USER_LANG: z.string().min(1, {
    message: 'User Lang is required',
  }),
  GRADE: z.string().optional(),
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
  GRADE: '',
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
      const response: any = await request.post('/user/userSave', {
        ...value,
      })
      if (response < 0) {
        toast.error('The ID is already in use')
      } else {
        setIsOpen(false)
        refetch()
      }
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
            <FormField
              control={form.control}
              name="USER_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    User ID
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
              name="PW"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">PW</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="capitalize">
                    Customer Code
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Customer {...field} />
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
                  <FormLabel className="capitalize">
                    Dept Code
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <DeptCodeSelect
                      {...field}
                      CUSTOMER_CODE={form.watch('CUSTOMER_CODE')}
                    />
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
              name="ACCOUNT_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Account Name</FormLabel>
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
                  <FormLabel className="capitalize">
                    Tel No
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
            <FormField
              control={form.control}
              name="NATION_CD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Nation Cd
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <NationCode {...field} />
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
                  <FormLabel className="capitalize">Truck No</FormLabel>
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
                  <FormLabel className="capitalize">Truck Type</FormLabel>
                  <FormControl>
                    <CommonTruckType {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="USER_LANG"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    User Lang
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <UserLang {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="GRADE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Grade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="GRADE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Activate/Inactivate
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={field.value === 'Y'}
                        onCheckedChange={(check) =>
                          field.onChange(field.value ? 'Y' : 'N')
                        }
                      />
                    </div>
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

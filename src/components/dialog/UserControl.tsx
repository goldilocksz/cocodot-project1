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
import { NumericFormat } from 'react-number-format'
import { useMutation } from '@tanstack/react-query'
import TruckType from '../form/TruckType'
import NationCode from '../form/NationCode'
import { Auth, User } from '@/types/data'
import { toast } from 'sonner'
import request from '@/lib/request'
import { Select } from '../ui/select'

type Props = {
  auth: Auth
  detail: User | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
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
  EMAIL: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .max(50, {
      message: 'Email must be less than 50 characters',
    })
    .email({
      message: 'Invalid email',
    }),
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
  GRADE: z.string().min(1, {
    message: 'Grade is required',
  }),
})
type FormKeys = keyof z.infer<typeof formSchema>

// STATUS: z.string().min(1, {
//   message: 'Status is required',
// }),
// REMARKS: z
//   .string()
//   .min(1, {
//     message: 'Remarks is required',
//   })
//   .max(100, {
//     message: 'Remarks must be less than 100 characters',
//   })
//   .or(z.literal('')),
export default function UserControl({
  auth,
  detail,
  isOpen,
  setIsOpen,
}: Props) {
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
    USER_LANG: 'EN',
    ACCOUNT_NAME: '',
    GRADE: '',
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { mutate: UpdateUser, isPending: isUpdateUser } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request({
        url: '/user/userSave',
        body: {
          ...value,
          S_USER_ID: auth.USER_ID,
          S_USER_NAME: auth.USER_NAME,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      })
      if (!response) {
        toast.error('Failed to update user information')
      } else {
        setIsOpen(false)
        window.location.reload()
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
    UpdateUser(value)
  }
  const formSchemaMap = Object.keys(formSchema.shape) as FormKeys[]

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} User Information</DialogTitle>
          <DialogDescription>Shipping information</DialogDescription>
          {/* <div>
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
          </div> */}
        </DialogHeader>
        <Form {...form}>
          <form
            id="userForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-2 gap-4"
          >
            {formSchemaMap.map((key: FormKeys) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field: { ref, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      {key}
                      {/* @ts-ignore */}
                      {formSchema.shape[key]?.min && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {key === 'TRUCK_TYPE' ? (
                        <TruckType {...field} />
                      ) : key === 'NATION_CD' ? (
                        <NationCode {...field} />
                      ) : key === 'USE_YN' ? (
                        <Select {...field}>
                          <option value="y">Y</option>
                          <option value="n">N</option>
                        </Select>
                      ) : key === 'USER_LANG' ? (
                        <Select {...field}>
                          <option value="en">EN</option>
                          <option value="ko">KO</option>
                        </Select>
                      ) : key === 'GRADE' ? (
                        <NumericFormat
                          customInput={Input}
                          getInputRef={ref}
                          {...field}
                        />
                      ) : (
                        <Input {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {/* <FormField
              control={form.control}
              name="USER_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USER_ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              name="PW"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PW</FormLabel>
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
                  <FormLabel>USER_NAME</FormLabel>
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
                  <FormLabel>DEPT_CODE</FormLabel>
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
              name="EMAIL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EMAIL</FormLabel>
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
              name="USE_YN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USE_YN</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="y">Y</option>
                      <option value="n">N</option>
                    </Select>
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
                  <FormLabel>USER_LANG</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="en">EN</option>
                      <option value="ko">KO</option>
                    </Select>
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
                  <FormLabel>ACCOUNT_NAME</FormLabel>
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
                  <FormLabel>GRADE</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
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
            /> */}
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

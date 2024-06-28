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
import { Loader2, Minus, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Customer as TCustomer } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import Customer from '../form/Customer'

type Props = {
  detail: TCustomer | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setIsConfirm: (isConfirm: boolean) => void
  isDeleteCustomer: boolean
  refetch: () => void
}

const formSchema = z.object({
  CUSTOMER_CODE: z.string(),
  CUSTOMER_NAME: z.string().optional(),
  CUSTOMER_NAME_ENG: z.string().optional(),
  CUSTOMER_TYPE: z.string().optional(),
  CUSTOMER_LEVEL: z.string().optional(),
  TEL_NO: z.string().optional(),
  FAX_NO: z.string().optional(),
  EMAIL: z.string().optional(),
  ADDR: z.string().optional(),
  IRS_NO: z.string().optional(),
  DIRECTOR: z.string().optional(),
  PIC_NAME: z.string().optional(),
  PIC_TEL: z.string().optional(),
  PIC_EMAIL: z.string().optional(),
  STATUS: z.string().optional(),
  REMARKS: z.string().optional(),
  DATA: z.array(
    z.object({
      CUSTOMER_CODE: z.string().optional(),
      DEPT_CODE: z.string().optional(),
      DEPT_NAME: z.string().optional(),
      DEPT_NAME_ENG: z.string().optional(),
      PIC_NAME: z.string().optional(),
      PIC_TEL: z.string().optional(),
      PIC_EMAIL: z.string().optional(),
      REMARKS: z.string().optional(),
    }),
  ),
})

const defaultValues = {
  CUSTOMER_CODE: 'GDL',
  CUSTOMER_NAME: 'GDL',
  CUSTOMER_NAME_ENG: 'GDL',
  CUSTOMER_TYPE: 'GDL',
  CUSTOMER_LEVEL: 'GDL',
  TEL_NO: 'GDL',
  FAX_NO: 'GDL',
  EMAIL: 'GDL',
  ADDR: 'GDL',
  IRS_NO: 'GDL',
  DIRECTOR: 'GDL',
  PIC_NAME: 'GDL',
  PIC_TEL: 'GDL',
  PIC_EMAIL: 'GDL',
  STATUS: 'GDL',
  REMARKS: 'GDL',
  DATA: [
    {
      CUSTOMER_CODE: '',
      DEPT_CODE: '',
      DEPT_NAME: '',
      DEPT_NAME_ENG: '',
      PIC_NAME: '',
      PIC_TEL: '',
      PIC_EMAIL: '',
      REMARKS: '',
    },
  ],
}

type TFormSchema = z.infer<typeof formSchema>

export default function CustomerControl({
  detail,
  isOpen,
  setIsOpen,
  setIsConfirm,
  isDeleteCustomer,
  refetch,
}: Props) {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { isLoading: isGetData } = useQuery({
    queryKey: ['getOrderBLInfo', isOpen],
    queryFn: async () => {
      const response = await request.post('/customer/getCustomerDept', {
        CUSTOMER_CODE: detail?.CUSTOMER_CODE,
      })

      if (response.data.length === 0) {
        form.setValue('DATA', defaultValues.DATA)
      } else {
        form.setValue('DATA', response.data)
      }
      return response.data
    },
    enabled: isOpen,
  })

  const { mutate: UpdateCustomer, isPending: isUpdateCustomer } = useMutation({
    mutationFn: async (value: TFormSchema) => {
      const response = await request.post('/customer/CustomerSave', {
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
      console.log(detail)

      form.reset(detail)
    } else {
      form.reset(defaultValues)
    }
  }, [isOpen, detail])

  const AddNewBldata = () => {
    form.setValue('DATA', [...form.getValues('DATA'), defaultValues.DATA[0]])
  }

  const RemoveBldata = (index: number) => {
    form.setValue(
      'DATA',
      form.getValues('DATA').filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (value: TFormSchema) => {
    UpdateCustomer(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Customer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="userForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-4 gap-4"
          >
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CUSTOMER_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CUSTOMER_NAME_ENG"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Customer Name Eng
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
              name="CUSTOMER_TYPE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Customer Type</FormLabel>
                  <FormControl>
                    <Customer {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CUSTOMER_LEVEL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Customer Level</FormLabel>
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
              name="FAX_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Fax No</FormLabel>
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
              name="ADDR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="IRS_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">IRS No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="DIRECTOR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Director</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PIC_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Pic Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PIC_TEL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Pic Tel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PIC_EMAIL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">Pic Email</FormLabel>
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
                  <FormLabel className="capitalize">Status</FormLabel>
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
                <FormItem>
                  <FormLabel className="capitalize">Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="relative col-span-4 mt-6 border-t pt-6">
              {isGetData && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <div className="space-y-2">
                {!isGetData &&
                  form.watch('DATA')?.map((item, index) => (
                    <div
                      key={`DATA-${index}`}
                      className="relative col-span-4 flex gap-2"
                    >
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.CUSTOMER_CODE`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.DEPT_CODE`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dept Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.DEPT_NAME`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dept Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.DEPT_NAME_ENG`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dept Name Eng</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.PIC_NAME`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pic Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.PIC_TEL`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pic Tel</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.PIC_EMAIL`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pic Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`DATA.${index}.REMARKS`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index === 0 ? (
                        <Button
                          variant="outline"
                          onClick={() => AddNewBldata()}
                          className="mt-8 self-start px-3"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => RemoveBldata(index)}
                          className="mt-8 self-start px-3"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="sm:justify-center">
          <Button type="submit" form="userForm">
            {isUpdateCustomer && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {detail ? 'Update' : 'Add'}
          </Button>
          {detail && (
            <Button
              form="routeForm"
              variant="destructive"
              onClick={() => setIsConfirm(true)}
            >
              {isDeleteCustomer && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

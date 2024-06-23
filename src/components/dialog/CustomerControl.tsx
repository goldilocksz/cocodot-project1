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
import { NumericFormat } from 'react-number-format'
import { useMutation, useQuery } from '@tanstack/react-query'
import TruckType from '../form/TruckType'
import NationCode from '../form/NationCode'
import { Customer } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import { Select } from '../ui/select'
import { Switch } from '../ui/switch'

type Props = {
  detail: Customer | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({})
type FormKeys = keyof z.infer<typeof formSchema>

const defaultValues = {
  UPDATE_USER_ID: '',
  CUSTOMER_NAME_ENG: '',
  TEL_NO: '',
  UPDATE_DATE: '',
  ADD_USER_ID: '',
  CUSTOMER_TYPE: '',
  ADD_USER_NAME: '',
  REMARKS: '',
  STATUS: '',
  FAX_NO: '',
  TIME_ZONE: '',
  CUSTOMER_NAME: '',
  ADD_DATE: '',
  CUSTOMER_CODE: '',
  UPDATE_USER_NAME: '',
}

export default function CustomerControl({ detail, isOpen, setIsOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { data: dept } = useQuery({
    queryKey: ['getDept', detail?.CUSTOMER_CODE],
    queryFn: async () => {
      const { data } = await request.post('/customer/getCustomerDept', {
        CUSTOMER_CODE: detail?.CUSTOMER_CODE,
      })
      return data
    },
    enabled: !!detail?.CUSTOMER_CODE,
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
          <DialogTitle>{detail ? 'Edit' : 'Add'} Customer</DialogTitle>
        </DialogHeader>
        {/* <Form {...form}>
          <form
            id="userForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-2 gap-4"
          >
          </form>
        </Form> */}
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

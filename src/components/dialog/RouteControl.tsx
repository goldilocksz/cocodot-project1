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
import { Auth, Route } from '@/types/data'
import { toast } from 'sonner'
import request from '@/lib/request'
import { Select } from '../ui/select'
import NationCode from '../form/NationCode'

type Props = {
  auth: Auth
  detail: Route | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  CUSTOMER_CODE: z.string().min(1, {
    message: 'Customer code is required',
  }),
  ROUTE_CODE: z.string().min(1, {
    message: 'Route code is required',
  }),
  SEQ: z.string().optional(),
  NATION_CD: z.string().min(1, {
    message: 'Nation code is required',
  }),
  ROUTE_NAME: z.string().min(1, {
    message: 'Route name is required',
  }),
  SEQ_NAME: z.string().min(1, {
    message: 'Sequence name is required',
  }),
})
type FormKeys = keyof z.infer<typeof formSchema>

const RouteDefault = {
  CUSTOMER_CODE: '',
  ROUTE_CODE: '',
  SEQ: '',
  NATION_CD: '',
  ROUTE_NAME: '',
  SEQ_NAME: '',
}

export default function RouteControl({
  auth,
  detail,
  isOpen,
  setIsOpen,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RouteDefault,
  })

  const { mutate: UpdateRoute, isPending: isUpdateRoute } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request({
        url: '/webCommon/RouteMstSave',
        body: {
          ...value,
          S_USER_ID: auth.USER_ID,
          S_USER_NAME: auth.USER_NAME,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      })
      if (!response) {
        toast.error('Failed to update route code information')
      } else {
        setIsOpen(false)
        // window.location.reload()
      }
    },
  })

  useEffect(() => {
    if (detail) {
      form.reset(detail)
    } else {
      form.reset(RouteDefault)
    }
  }, [isOpen])

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value)

    UpdateRoute(value)
  }
  const formSchemaMap = Object.keys(formSchema.shape) as FormKeys[]

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Route Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="routeForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-2 gap-4"
          >
            {formSchemaMap.map((key: FormKeys) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {key}
                      {/* @ts-ignore */}
                      {formSchema.shape[key]?.min && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {key === 'NATION_CD' ? (
                        <NationCode {...field} />
                      ) : (
                        <Input {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <DialogFooter className="sm:justify-center">
          <Button type="submit" form="routeForm">
            {isUpdateRoute && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

import { useEffect, useState } from 'react'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { Route } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import NationCode from '../form/NationCode'
import GoogleMap from '../map'
import { omit } from 'radash'

type Props = {
  detail: Route | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  refetch: () => void
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
  LATITUDE: z.string(),
  LONGITUDE: z.string(),
})
type FormKeys = keyof z.infer<typeof formSchema>

const RouteDefault = {
  CUSTOMER_CODE: '',
  ROUTE_CODE: '',
  SEQ: '',
  NATION_CD: '',
  ROUTE_NAME: '',
  SEQ_NAME: '',
  LATITUDE: '',
  LONGITUDE: '',
}

export default function RouteControl({
  detail,
  isOpen,
  setIsOpen,
  refetch,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: RouteDefault,
  })

  const { mutate: UpdateRoute, isPending: isUpdateRoute } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request.post('/webCommon/RouteMstSave', value)
      if (!response.data) {
        toast.error('Failed to update route code information')
      } else {
        refetch()
        setIsOpen(false)
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
                    <FormLabel className="capitalize">
                      {key.replace(/_/g, ' ').toLowerCase()}
                      {/* @ts-ignore */}
                      {formSchema.shape[key]?.min &&
                        key !== 'LATITUDE' &&
                        key !== 'LONGITUDE' && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                      {key === 'NATION_CD' ? (
                        <NationCode {...field} />
                      ) : (
                        <Input
                          {...field}
                          readOnly={key === 'LATITUDE' || key === 'LONGITUDE'}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>

        {detail && (
          <div className="relative h-[300px]">
            <GoogleMap
              lat={Number(detail.LATITUDE)}
              lng={Number(detail.LONGITUDE)}
              setPosition={(value) => {
                form.setValue('LATITUDE', String(value.lat))
                form.setValue('LONGITUDE', String(value.lng))
              }}
            />
          </div>
        )}

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

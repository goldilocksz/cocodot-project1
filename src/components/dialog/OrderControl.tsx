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
import { Loader2, Minus, Plus } from 'lucide-react'
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
import { Auth, Order } from '@/types/data'
import { toast } from 'sonner'
import request from '@/lib/request'
import { Select } from '../ui/select'
import NationCode from '../form/NationCode'
import Cnee from '../form/Cnee'
import { Switch } from '../ui/switch'
import Incoterms from '../form/Incoterms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Pol from '../form/Pol'
import TruckType from '../form/TruckType'
import { Datepicker } from '../ui/datepicker'

type Props = {
  auth: Auth
  detail: Order | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// {
//   COMPANY_CODE: string
//   TR_NO: string
//   CUSTOMER_CODE: string
//   CLIENT_CODE: string
//   LSP_CD: string
//   JOB_DATE: string
//   FROM_ROUTE_CODE: string
//   FROM_TRUCK_NO: string
//   FROM_LATITUDE: string
//   FROM_LONGITUDE: string
//   TO_ROUTE_CODE: string
//   TO_TRUCK_NO: string
//   TO_LATITUDE: string
//   TO_LONGITUDE: string
//   ETD: string
//   POL: string
//   CC_DONE_TIME: Date
//   LEAD_TIME: string
//   REGION_CODE: string
//   REGION_NAME: string
//   URGENT: string
//   IMP_EXP: string
//   STATUS: string
//   REMARKS: string
//   TIME_ZONE: string
//   ADD_DATE: Date
//   ADD_USER_ID: string
//   ADD_USER_NAME: string
//   UPDATE_DATE: Date
//   UPDATE_USER_ID: string
//   UPDATE_USER_NAME: string
//   DT_COUNT: number
//   BL_COUNT: number
//   id: number
// }

const formSchema = z.object({
  CLIENT_CODE: z.string().min(1, {
    message: 'Customer code is required',
  }),
  LSP_CODE: z.string().min(1, {
    message: 'LSP code is required',
  }),
  CC_DONE_TIME: z.date(),
  REGION_CODE: z.string().min(1, {
    message: 'Region code is required',
  }),
  URGENT: z.boolean(),
  POL: z.string().min(1, {
    message: 'POL is required',
  }),
  BLDATA: z.array(
    z.object({
      BL_NO: z.string(),
      CC_DONE_TIME: z.date(),
      CNEE: z.string(),
      VENDOR_NAME: z.string(),
      INCOTERMS: z.string(),
      INVOICE_NO: z.string(),
      ITEM_CODE: z.string(),
      QTY_OF_PLT: z.number(),
    }),
  ),
  NATION_CODE: z.string(),
})

type FormKeys = keyof z.infer<typeof formSchema>

const OrderDefault = {
  CLIENT_CODE: '',
  LSP_CODE: '',
  ETD: '',
  FROM_ROUTE_CODE: '',
  TO_ROUTE_CODE: '',
  TR_NO: '',
  CC_DONE_TIME: new Date(),
  REGION_CODE: '',
  POL: '',
  FROM_TRUCK_NO: '',
  NATION_CODE: '',
  URGENT: false,
  BLDATA: [
    {
      BL_NO: '',
      CC_DONE_TIME: new Date(),
      CNEE: '',
      VENDOR_NAME: '',
      INCOTERMS: '',
      INVOICE_NO: '',
      ITEM_CODE: '',
      QTY_OF_PLT: 0,
    },
  ],
}

export default function OrderControl({
  auth,
  detail,
  isOpen,
  setIsOpen,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: OrderDefault,
  })

  const { data: BlInfo, isLoading: isGetBlInfo } = useQuery({
    queryKey: ['BlInfo', detail?.TR_NO],
    queryFn: async () =>
      await request({
        url: '/order/getOrderBLInfo',
        body: {
          TR_NO: detail?.TR_NO,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      }),
  })

  const { data: RouteInfo, isLoading: isGetRouteInfo } = useQuery({
    queryKey: ['RouteInfo', detail?.TR_NO],
    queryFn: async () =>
      await request({
        url: '/order/getOrderDT',
        body: {
          TR_NO: detail?.TR_NO,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      }),
  })

  useEffect(() => {
    if (BlInfo?.length) {
      form.setValue('BLDATA', BlInfo)
    } else {
      form.setValue('BLDATA', [
        {
          BL_NO: '',
          CC_DONE_TIME: new Date(),
          CNEE: '',
          VENDOR_NAME: '',
          INCOTERMS: '',
          INVOICE_NO: '',
          ITEM_CODE: '',
          QTY_OF_PLT: 0,
        },
      ])
    }
  }, [BlInfo])

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
      form.reset({ ...detail, URGENT: detail.URGENT === 'Y' })
    } else {
      form.reset(OrderDefault)
    }
  }, [isOpen])

  const AddNewBldata = () => {
    form.setValue('BLDATA', [
      ...form.getValues('BLDATA'),
      {
        BL_NO: '',
        CC_DONE_TIME: new Date(),
        CNEE: '',
        VENDOR_NAME: '',
        INCOTERMS: '',
        INVOICE_NO: '',
        ITEM_CODE: '',
        QTY_OF_PLT: 0,
      },
    ])
  }

  const RemoveBldata = (index: number) => {
    form.setValue(
      'BLDATA',
      form.getValues('BLDATA').filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    UpdateRoute(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Route Information</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="routeForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative grid grid-cols-4 gap-4"
          >
            <FormField
              control={form.control}
              name="CLIENT_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'CLIENT_CODE'.replace(/_/g, ' ').toLowerCase()}
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
              name="LSP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'LSP_CODE'.replace(/_/g, ' ').toLowerCase()}
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
              name="URGENT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'Urgent'.replace(/_/g, ' ').toLowerCase()}
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1"></div>
            <FormField
              control={form.control}
              name="CC_DONE_TIME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    CC_DONE_TIME
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Datepicker
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LSP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'LSP_CODE'.replace(/_/g, ' ').toLowerCase()}
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <TruckType />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LSP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Tr No
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
              name="CC_DONE_TIME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Cc done time
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Datepicker
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LSP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'LSP_CODE'.replace(/_/g, ' ').toLowerCase()}
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
              name="LSP_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {'LSP_CODE'.replace(/_/g, ' ').toLowerCase()}
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
              name="NATION_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Nation Code
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <NationCode />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="POL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Pol
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Pol />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-4">
              <div className="font-semibold">Cargo information</div>
              <Tabs defaultValue="bl" className="mt-2">
                <TabsList>
                  <TabsTrigger value="bl">Bl Info</TabsTrigger>
                  <TabsTrigger value="route">Route Info</TabsTrigger>
                </TabsList>
                <TabsContent value="bl" className="relative pb-6">
                  {isGetBlInfo && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {form.watch('BLDATA')?.map((item, index) => (
                    <div
                      key={index}
                      className="relative col-span-4 grid grid-cols-7 gap-4 pr-12"
                    >
                      <FormField
                        control={form.control}
                        name={`BLDATA.${index}.BL_NO` as FormKeys}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">Bl No</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value as string}
                                name={field.name}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">Cnee</FormLabel>
                            <FormControl>
                              <Cnee className="flex-1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              Vendor name
                            </FormLabel>
                            <FormControl>
                              <Input />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              Incoterms
                            </FormLabel>
                            <FormControl>
                              <Incoterms></Incoterms>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              Invoice No
                            </FormLabel>
                            <FormControl>
                              <Input />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              Item code
                            </FormLabel>
                            <FormControl>
                              <Input />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="CC_DONE_TIME"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">
                              Q'of PLT
                            </FormLabel>
                            <FormControl>
                              <Input />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index !== form.watch('BLDATA')?.length - 1 ? (
                        <Button
                          variant="outline"
                          className="absolute bottom-0 right-0 px-3"
                          onClick={AddNewBldata}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="absolute bottom-0 right-0 px-3"
                          onClick={() => RemoveBldata(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="route">
                  Change your password here.
                </TabsContent>
              </Tabs>
            </div>
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

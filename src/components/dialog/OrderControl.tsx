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
import { Auth, Order, TrReport } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
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
  detail: Order | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
/*{
  "TR_NO": null,
  "JOB_DATE": "20240506",
  "FROM_ROUTE_CODE": "LS",
  "FROM_TRUCK_NO": "GDL",
  "TO_ROUTE_CODE": "PX",
  "TO_TRUCK_NO": "GDL",
  "ETD": "20240507",
  "LEAD_TIME": "7Day 15hour",
  "REGION_CODE": "NCN",
  "REGION_NAME": "North CN",
  "IMP_EXP": "IMP",
  "ATA_BORDER": "2024-05-14 09:31:17.000",
  "ATA_CNEE_FACTORY": "2024-05-14 10:31:17.000",
}*/

const formSchema = z.object({
  CLIENT_CODE: z.string().min(1, {
    message: 'Customer code is required',
  }),
  LSP_CD: z.string().min(1, {
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
  NATION_CODE: z.string(),
  BLDATA: z.array(
    z.object({
      TR_NO: z.string(),
      BL_NO: z.string(),
      CC_DONE_TIME: z.date(),
      CNEE_CODE: z.string(),
      CNEE_NAME: z.string(),
      VENDOR_NAME: z.string(),
      INCOTERMS: z.string(),
      INVOICE_NO: z.string(),
      ITEM_CODE: z.string(),
      REF_INVOICE_NO: z.string(),
      QTY: z.number(),
    }),
  ),
})

const OrderDefault = {
  CLIENT_CODE: '',
  LSP_CD: '',
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
      TR_NO: '',
      BL_NO: '',
      CC_DONE_TIME: new Date(),
      CNEE_CODE: '',
      CNEE_NAME: '',
      VENDOR_NAME: '',
      INCOTERMS: '',
      INVOICE_NO: '',
      ITEM_CODE: '',
      REF_INVOICE_NO: '',
      QTY: 0,
    },
  ],
}

export default function OrderControl({ detail, isOpen, setIsOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: OrderDefault,
  })

  const { data: BlInfo, isLoading: isGetBlInfo } = useQuery<any[]>({
    queryKey: ['getBlInfo', detail?.TR_NO],
    queryFn: async () =>
      await request.post('/order/getOrderBLInfo', {
        TR_NO: detail?.TR_NO,
      }),
  })

  const { data: RouteInfo, isLoading: isGetRouteInfo } = useQuery<TrReport[]>({
    queryKey: ['RouteInfo', detail?.TR_NO],
    queryFn: async () =>
      await request.post('/order/getOrderDT', {
        TR_NO: detail?.TR_NO,
      }),
  })

  useEffect(() => {
    if (BlInfo?.length) {
      form.setValue('BLDATA', BlInfo)
    } else {
      form.setValue('BLDATA', [OrderDefault.BLDATA[0]])
    }
  }, [BlInfo])

  const { mutate: UpdateRoute, isPending: isUpdateRoute } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request.post('/webCommon/RouteMstSave', value)
      if (!response) {
        toast.error('Failed to update route code information')
      } else {
        setIsOpen(false)
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
      OrderDefault.BLDATA[0],
    ])
  }

  const RemoveBldata = (index: number) => {
    form.setValue(
      'BLDATA',
      form.getValues('BLDATA').filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(
      value.BLDATA.map((item) => ({
        ...item,
        CC_DONE_TIME: item.CC_DONE_TIME.toISOString(),
      })),
    )

    // UpdateRoute(value)
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
                    Client Code
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
              name="LSP_CD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Lsp Code
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
                        onCheckedChange={(check) => field.onChange(check)}
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
            {/* <FormField
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
            /> */}
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
            {/* <FormField
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
            /> */}
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
              {isGetBlInfo && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {form.watch('BLDATA')?.map((item, index) => (
                <div
                  key={index}
                  className="relative col-span-4 grid grid-cols-9 gap-2 pr-12"
                >
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.BL_NO`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Bl No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.TR_NO`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">TR No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.CC_DONE_TIME`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          CC Done Time
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
                    name={`BLDATA.${index}.CNEE_CODE`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Cnee</FormLabel>
                        <FormControl>
                          <Cnee className="flex-1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.VENDOR_NAME`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          Vendor name
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
                    name={`BLDATA.${index}.INCOTERMS`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Incoterms</FormLabel>
                        <FormControl>
                          <Incoterms {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.INVOICE_NO`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Invoice No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.ITEM_CODE`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Item code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`BLDATA.${index}.QTY`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">Q'of PLT</FormLabel>
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

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
import { NumericFormat } from 'react-number-format'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Order } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import { Select } from '../ui/select'
import Cnee from '../form/Cnee'
import { Switch } from '../ui/switch'
import Incoterms from '../form/Incoterms'
import Pol from '../form/Pol'
import { Datepicker } from '../ui/datepicker'
import RegionCode from '../form/RegionCode'
import RouteMst from '../form/RouteMst'
import ClientCode from '../form/ClientCode'
import LspCode from '../form/LspCode'
import { DatepickerTime } from '../ui/datepicker-time'
import { Label } from '../ui/label'
import dayjs from 'dayjs'
import { dateFormat } from '@/utils/utils'
import FromTruckType from '../form/FromTruckType'
import ToTruckType from '../form/ToTruckType'

type Props = {
  detail: Order | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setIsConfirm: (isConfirm: boolean) => void
  isDeleteOrder: boolean
  refetch: () => void
}

const formSchema = z
  .object({
    CLIENT_CODE: z.string().min(1, {
      message: 'Customer code is required',
    }),
    LSP_CD: z.string().min(1, {
      message: 'LSP code is required',
    }),
    ETD: z.string(),
    TR_NO: z.string(),
    JOB_DATE: z.string().min(1, {
      message: 'Job date is required',
    }),
    FROM_ROUTE_CODE: z.string().min(1, {
      message: 'From route code is required',
    }),
    FROM_TRUCK_NO: z.string(),
    FROM_TRUCK_TYPE: z.string().optional(),
    TO_ROUTE_CODE: z.string().min(1, {
      message: 'To route code is required',
    }),
    TO_TRUCK_NO: z.string().optional(),
    TO_TRUCK_TYPE: z.string().optional(),
    URGENT: z.string().optional(),
    CC_DONE_TIME: z.string().optional(),
    REGION_CODE: z.string().min(1, {
      message: 'Region code is required',
    }),
    REGION_NAME: z.string(),
    POL: z.string().min(1, {
      message: 'POL is required',
    }),
    IMP_EXP: z.string().optional(),
    ETA_BORDER: z.string().optional(),
    ETA_CNEE_FACTORY: z.string().optional(),
    FROM_NATION_CD: z.string().optional(),
    TO_NATION_CD: z.string().optional(),
    BLDATA: z.array(
      z.object({
        BL_NO: z.string().min(1, {
          message: 'BL No is required',
        }),
        CNEE_CODE: z.string().min(1, {
          message: 'Cnee code is required',
        }),
        CNEE_NAME: z.string().min(1, {
          message: 'Cnee name is required',
        }),
        VENDOR_NAME: z.string().min(1, {
          message: 'Vendor name is required',
        }),
        INCOTERMS: z.string().min(1, {
          message: 'Incoterms is required',
        }),
        REF_INVOICE_NO: z.string().optional(),
        ITEM_CODE: z.string().optional(),
        QTY: z.number().optional(),
      }),
    ),
  })
  .refine((value) => value.FROM_ROUTE_CODE !== value.TO_ROUTE_CODE, {
    path: ['TO_ROUTE_CODE'],
    message: 'From route code must be different from to route code',
  })

const OrderDefault = {
  CLIENT_CODE: '',
  LSP_CD: '',
  ETD: '',
  FROM_ROUTE_CODE: '',
  FROM_TRUCK_NO: '',
  TO_ROUTE_CODE: '',
  TO_TRUCK_NO: '',
  TR_NO: '',
  JOB_DATE: dayjs().format('YYYYMMDD'),
  CC_DONE_TIME: '',
  REGION_CODE: '',
  REGION_NAME: '',
  POL: '',
  IMP_EXP: 'IMP',
  ETA_BORDER: '',
  ETA_CNEE_FACTORY: '',
  URGENT: 'N',
  FROM_NATION_CD: '',
  TO_NATION_CD: '',
  BLDATA: [
    {
      BL_NO: '',
      CNEE_CODE: '',
      CNEE_NAME: '',
      VENDOR_NAME: '',
      INCOTERMS: '',
      REF_INVOICE_NO: '',
      ITEM_CODE: '',
      QTY: 1,
    },
  ],
}

export default function OrderControl({
  detail,
  isOpen,
  setIsOpen,
  setIsConfirm,
  isDeleteOrder,
  refetch,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: OrderDefault,
  })

  const { isPending: isGetBlInfo, refetch: refetchBlInfo } = useQuery({
    queryKey: ['getOrderBLInfo', isOpen],
    queryFn: async () => {
      const response = await request.post('/order/getOrderBLInfo', {
        TR_NO: detail?.TR_NO,
      })

      if (response.data.length === 0) {
        form.setValue('BLDATA', OrderDefault.BLDATA)
      } else {
        form.setValue('BLDATA', response.data)
      }
      return response.data
    },
    enabled: isOpen,
    gcTime: 0,
  })

  const { mutate: DeleteBlInfo } = useMutation({
    mutationFn: async ({ TR_NO, BL_NO }: { TR_NO: string; BL_NO: string }) => {
      await request.post('/order/OrderBLInfoDelete', {
        TR_NO,
        BL_NO,
      })
      refetchBlInfo()
    },
  })

  const { mutate: UpdateOrder, isPending: isUpdateOrder } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request.post('/order/OrderSave', value)
      if (!response) {
        toast.error('Failed to update route code information')
      } else {
        setIsOpen(false)
        refetch()
      }
    },
  })

  useEffect(() => {
    if (detail) {
      form.reset({
        ...detail,
        ...(detail.CC_DONE_TIME
          ? { CC_DONE_TIME: dateFormat(detail.CC_DONE_TIME) }
          : {}),
        ...(detail.ETA_BORDER
          ? { ETA_BORDER: dateFormat(detail.ETA_BORDER) }
          : {}),
        ...(detail.ETA_CNEE_FACTORY
          ? { ETA_CNEE_FACTORY: dateFormat(detail.ETA_CNEE_FACTORY) }
          : {}),
      })
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

  const RemoveBldata = (item: any) => {
    DeleteBlInfo({
      TR_NO: item.TR_NO,
      BL_NO: item.BL_NO,
    })
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    UpdateOrder({
      ...value,
      ...(value.CC_DONE_TIME
        ? { CC_DONE_TIME: dateFormat(value.CC_DONE_TIME) }
        : {}),
      ...(value.ETA_BORDER ? { ETA_BORDER: dateFormat(value.ETA_BORDER) } : {}),
      ...(value.ETA_CNEE_FACTORY
        ? { ETA_CNEE_FACTORY: dateFormat(value.ETA_CNEE_FACTORY) }
        : {}),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{detail ? 'Edit' : 'Add'} Order Information</DialogTitle>
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
                    {detail ? (
                      <Input {...field} className="bg-gray-100" />
                    ) : (
                      <ClientCode {...field} />
                    )}
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
                    LSP
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    {detail ? (
                      <Input {...field} className="bg-gray-100" />
                    ) : (
                      <LspCode {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TR_NO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">TR No</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-gray-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="JOB_DATE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Date
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
              name="FROM_ROUTE_CODE"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="capitalize">
                    From
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RouteMst
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        form.setValue(
                          'FROM_NATION_CD',
                          e.target.options[e.target.selectedIndex].dataset
                            .nation || '',
                        )
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TO_ROUTE_CODE"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="capitalize">
                    To
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RouteMst
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        form.setValue(
                          'TO_NATION_CD',
                          e.target.options[e.target.selectedIndex].dataset
                            .nation || '',
                        )
                      }}
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
                  <FormLabel className="capitalize">Cc done time</FormLabel>
                  <FormControl>
                    <DatepickerTime
                      date={field.value || ''}
                      setDate={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ETD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Pick up Date(ETD)
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

            <div className="flex items-center gap-1">
              <FormField
                control={form.control}
                name="FROM_TRUCK_NO"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="capitalize">
                      From Truck No
                      <span className="ml-1 text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      {detail ? (
                        <Input {...field} defaultValue={detail.FROM_TRUCK_NO} />
                      ) : (
                        <FromTruckType
                          nationcode={form.watch('FROM_NATION_CD')}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            form.setValue(
                              'FROM_TRUCK_TYPE',
                              e.target.options[e.target.selectedIndex].dataset
                                .type || '',
                            )
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-[90px]">
                <Label>Truck Type</Label>
                <div className="mt-2 h-10 rounded border px-3 py-2 text-sm">
                  {form.watch('FROM_TRUCK_TYPE')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FormField
                control={form.control}
                name="TO_TRUCK_NO"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="capitalize">To Truck No</FormLabel>
                    <FormControl>
                      {detail ? (
                        <Input {...field} defaultValue={detail.TO_TRUCK_NO} />
                      ) : (
                        <ToTruckType
                          nationcode={form.watch('TO_NATION_CD')}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            form.setValue(
                              'TO_TRUCK_TYPE',
                              e.target.options[e.target.selectedIndex].dataset
                                .type || '',
                            )
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-[90px]">
                <Label>Truck Type</Label>
                <div className="mt-2 h-10 rounded border px-3 py-2 text-sm">
                  {form.watch('TO_TRUCK_TYPE')}
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="REGION_CODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    Region
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RegionCode
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        form.setValue(
                          'REGION_NAME',
                          e.target.options[e.target.selectedIndex].text,
                        )
                      }}
                    />
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
                    POL
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Pol {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="IMP_EXP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    IMP EXP
                    <span className="ml-1 text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select className="justify-self-end" {...field}>
                      <option value="IMP">IMP</option>
                      <option value="EXP">EXP</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ETA_BORDER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">ETA Border</FormLabel>
                  <FormControl>
                    <DatepickerTime
                      date={field.value || ''}
                      setDate={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ETA_CNEE_FACTORY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">ETA Cnee Factory</FormLabel>
                  <FormControl>
                    <DatepickerTime
                      date={field.value || ''}
                      setDate={(date) => field.onChange(date)}
                    />
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
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={field.value === 'Y'}
                        onCheckedChange={(check) =>
                          field.onChange(check ? 'Y' : 'N')
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative col-span-4 mt-6 border-t pt-6">
              {isGetBlInfo && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <div className="space-y-2">
                {!isGetBlInfo &&
                  form.watch('BLDATA')?.map((item, index) => (
                    <div
                      key={`BLDATA-${index}`}
                      className="relative col-span-4 flex gap-2"
                    >
                      <FormField
                        control={form.control}
                        name={`BLDATA.${index}.BL_NO`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              BL No
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
                        name={`BLDATA.${index}.CNEE_CODE`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              CNEE
                              <span className="ml-1 text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Cnee
                                className="w-[120px] shrink-0"
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value)
                                  form.setValue(
                                    `BLDATA.${index}.CNEE_NAME`,
                                    e.target.options[e.target.selectedIndex]
                                      .dataset.name || '',
                                  )
                                }}
                              />
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
                            <FormLabel>
                              Vendor Name
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
                        name={`BLDATA.${index}.INCOTERMS`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Incoterms
                              <span className="ml-1 text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Incoterms
                                className="w-[120px] shrink-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`BLDATA.${index}.REF_INVOICE_NO`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ref Invoice No</FormLabel>
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
                            <FormLabel>Item Code</FormLabel>
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
                            <FormLabel>Qty(PLT)</FormLabel>
                            <FormControl>
                              <NumericFormat
                                className="w-[80px]"
                                customInput={Input}
                                maxLength={2}
                                isAllowed={(values) =>
                                  !values.formattedValue.includes('-')
                                }
                                value={field.value}
                                onValueChange={(values) =>
                                  field.onChange(values.floatValue)
                                }
                              />
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
                          onClick={() => RemoveBldata(item)}
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
          <Button type="submit" form="routeForm">
            {isUpdateOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {detail ? 'Update' : 'Add'}
          </Button>
          {detail && (
            <Button
              form="routeForm"
              variant="destructive"
              onClick={() => setIsConfirm(true)}
            >
              {isDeleteOrder && (
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

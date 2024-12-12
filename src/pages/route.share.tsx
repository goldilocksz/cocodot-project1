import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { string, z } from 'zod'
import { Button } from '@/components/ui/button'
import { Ban, Play, Sheet, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Loader2, Save, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Order, TrakingInfo } from '@/types/data'
import { toast } from 'sonner'
import request from '@/utils/request'
import { omit } from 'radash'
import ConfirmDialog from '../components/dialog/ConfirmDialog'
import GoogleRouteInfo from '../components/map/routeInfoMap'
import { decodeBase64, encodeBase64 } from '@/utils/base64'
import { useParams } from 'react-router-dom'
import publicRequest from '@/utils/public.request'

const formSchema = z.object({
    JOB_DATE: z.string().optional(),
    TR_NO: z.string().optional(),
    FROM_ROUTE_CODE: z.string().optional(),
    TO_ROUTE_CODE: z.string().optional(),
})
type FormKeys = keyof z.infer<typeof formSchema>

const RouteDefault = {
    JOB_DATE: '',
    TR_NO: '',
    FROM_ROUTE_CODE: '',
    TO_ROUTE_CODE: '',
}

export default function RouteShare() {
    const { id } = useParams<{ id: string }>()
    const [TRNO, setTRNO] = useState<string>()
    const [addDate, setAddDate] = useState<string>()
    const [updateDate, setUpdateDate] = useState<string>()
    const [isConfirm, setIsConfirm] = useState(false)
    const [isSaveConfirm, setIsSaveConfirm] = useState(false) // Save 확인 대화상자 상태
    const [seq, setSeq] = useState<string>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: RouteDefault,
    })

    useEffect(() => {
        if (id) {
            const decodeId = decodeBase64(id)
            setAddDate(decodeId.split(' ')[1])
            setUpdateDate(decodeId.split(' ')[2])
            setTRNO(decodeId.split(' ')[0])
        }
    }, [id])

    const {
        data: trakingInfo,
        isPending: isTrakingInfo,
        refetch,
    } = useQuery<TrakingInfo[]>({
        queryKey: ['getTrackingInfo', TRNO],
        queryFn: async () => {
            const { data } = await publicRequest.post('/public-data/getTrackingInfo', {
                TR_NO: TRNO,
            })
            return Array.isArray(data.data) ? data.data : []
        },
        enabled: !!TRNO,
    })

    const {
        data: order
    } = useQuery({
        queryKey: ['getOrderHD', TRNO],
        queryFn: async () => {
            const { data } = await publicRequest.post(
                '/public-data/getOrderHD',
                {
                    TR_NO: TRNO,
                }
            )
            return data.data
        },
        enabled: !!TRNO,
    })

    useEffect(() => {
        if (order) {
            form.reset({
                JOB_DATE: order[0].JOB_DATE,
                TR_NO: order[0].TR_NO,
                FROM_ROUTE_CODE: order[0].FROM_ROUTE_CODE,
                TO_ROUTE_CODE: order[0].TO_ROUTE_CODE,
            })
        }
    }, [order])


    const handleSave = async (SEQ: string) => {
        setSeq(SEQ)
        setIsSaveConfirm(true)
    }

    return (
        <div className=''>
            <div className="flex flex-col gap-2 max-w-4xl">
                <div className='text-lg font-semibold leading-none tracking-tight'>
                    Route Information
                </div>


                <Form {...form}>
                    <form id="routeForm" className="relative grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="JOB_DATE"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Date</FormLabel>
                                    <FormControl>
                                        <Input {...field} readOnly />
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
                                    <FormLabel>TR No</FormLabel>
                                    <FormControl>
                                        <Input {...field} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="TO_ROUTE_CODE"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={`${form.watch('FROM_ROUTE_CODE')}-${form.watch('TO_ROUTE_CODE')}`}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <div className="relative h-[150px] mb-4">
                    {trakingInfo && trakingInfo.length > 0 && (
                        <GoogleRouteInfo key={trakingInfo.length} data={trakingInfo} />
                    )}
                </div>

                <div className="h-[150px] overflow-y-auto px-1">
                    {trakingInfo?.map((item) => (
                        <div
                            key={item.SEQ}
                            className="relative flex items-center justify-between gap-4 border-l p-4"
                        >
                            <div>
                                <div className="absolute -left-3 top-[18px] bg-white p-2">
                                    <div className="h-2 w-2 overflow-hidden rounded-full border border-black"></div>
                                </div>
                                <div>{item.SEQ_NAME}</div>
                                <div className="text-muted-foreground">{item.CHECK_DATE}</div>
                            </div>
                            <div>
                                {item.BTN_STATUS === 'D' ? (
                                    <Button
                                        variant="outline"
                                        className="h-auto rounded-full border-0 px-2 text-destructive"
                                        onClick={() => {
                                            setSeq(item.SEQ)
                                            setIsConfirm(true)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    item.BTN_STATUS === 'S' && (
                                        <Button
                                            variant="outline"
                                            className="h-auto rounded-full border-0 px-2"
                                            onClick={() => handleSave(item.SEQ)}
                                            type="button" // submit에서 button으로 변경
                                        >
                                            {/* {isSaveRoute ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )} */}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

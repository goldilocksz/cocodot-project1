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
import { Auth, Code } from '@/types/data'
import { toast } from 'sonner'
import request from '@/lib/request'
import { Select } from '../ui/select'

type Props = {
  auth: Auth
  detail: Code | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  GROUP_CODE: z.string(),
  DT_CODE: z.string(),
  USE_YN: z.string(),
  LOC_VALUE: z.string(),
  ENG_VALUE: z.string(),
  ETC1: z.string(),
  ETC2: z.string(),
  ETC3: z.string(),
  ETC4: z.string(),
  ETC5: z.string(),
  ETC6: z.string(),
  ETC7: z.string(),
  SORT_SEQ_NO: z.number(),
  STATUS: z.string(),
  REMARKS: z.string(),
  TIME_ZONE: z.string(),
  ADD_DATE: z.string(),
  ADD_USER_ID: z.string(),
  ADD_USER_NAME: z.string(),
  UPDATE_DATE: z.string(),
  UPDATE_USER_ID: z.string(),
  UPDATE_USER_NAME: z.string(),
})
type FormKeys = keyof z.infer<typeof formSchema>

export default function CommonControl({
  auth,
  detail,
  isOpen,
  setIsOpen,
}: Props) {
  const defaultValues = {
    GROUP_CODE: '',
    DT_CODE: '',
    USE_YN: '',
    LOC_VALUE: '',
    ENG_VALUE: '',
    ETC1: '',
    ETC2: '',
    ETC3: '',
    ETC4: '',
    ETC5: '',
    ETC6: '',
    ETC7: '',
    SORT_SEQ_NO: 0,
    STATUS: '',
    REMARKS: '',
    TIME_ZONE: '',
    ADD_DATE: '',
    ADD_USER_ID: '',
    ADD_USER_NAME: '',
    UPDATE_DATE: '',
    UPDATE_USER_ID: '',
    UPDATE_USER_NAME: '',
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { mutate: UpdateCommon, isPending: isUpdateCommon } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      const response = await request({
        url: '/webCommon/CommonCodeSave',
        body: {
          ...value,
          S_USER_ID: auth.USER_ID,
          S_USER_NAME: auth.USER_NAME,
          S_COMPANY_CODE: auth.COMPANY_CODE,
        },
      })
      if (!response) {
        toast.error('Failed to update common code information')
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
    console.log(value)

    UpdateCommon(value)
  }
  const formSchemaMap = Object.keys(formSchema.shape) as FormKeys[]

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {detail ? 'Edit' : 'Add'} Common Information
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="commonForm"
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <DialogFooter className="sm:justify-center">
          <Button type="submit" form="commonForm">
            {isUpdateCommon && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
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

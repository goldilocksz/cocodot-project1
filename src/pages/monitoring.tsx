import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/utils'
import { Loader2, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import { User, Monitoring } from '@/types/data'
import request from '@/utils/request'
import Loading from '@/components/ui/loading'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import { Textarea } from '@/components/ui/textarea'

const AddDiaglog = ({ refetch }: { refetch: () => void }) => {
  const [no, setNo] = useState('')
  const [open, setOpen] = useState(false)
  const [remark, setRemark] = useState('')

  const { mutate: saveMonitoring, isPending } = useMutation({
    mutationFn: async () => {
      await request.post('/monitoring/MonitoringBLSave', {
        REMARKS: remark,
        REF_NO: no,
      })
      setOpen(false)
      refetch()
    },
  })

  useEffect(() => {
    if (!open) {
      setNo('')
      setRemark('')
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveMonitoring()
  }
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="flex gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            placeholder="BL no. or TR no."
            value={no}
            onChange={(e) => setNo(e.target.value)}
            disabled={isPending}
          />
          <Textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="h-[120px]"
            placeholder="Enter Remarks"
            disabled={isPending}
          />
          <Button
            type="submit"
            disabled={isPending || no.trim() === '' || remark.trim() === ''}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function MonitoringView() {
  const [userList, setUserList] = useState<User[]>([])
  const [isConfirm, setIsConfirm] = useState(false)
  const [refNo, setRefNo] = useState('')

  const {
    data: Monitoring,
    refetch: RefetchMonitoring,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Monitoring[]>({
    queryKey: ['getMonitoring'],
    queryFn: async () => {
      const { data } = await request.post('/monitoring/getMonitoring', {})

      setUserList(data)
      return data ?? []
    },
  })

  const { mutate: deleteMonitoring, isPending: isDeleteMonitoring } =
    useMutation({
      mutationFn: async (REF_NO: string) => {
        const response = await request.post('/monitoring/MonitoringBLDelete', {
          REF_NO,
        })
        RefetchMonitoring()
      },
    })

  return (
    <section className="relative grow">
      <Loading isLoading={isLoading || isRefetching || isDeleteMonitoring} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Monitoring</h1>

        <div className="flex gap-2">
          <Button className="flex gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Data Refresh
          </Button>
          <AddDiaglog refetch={RefetchMonitoring} />
        </div>
      </div>
      <div className="relative mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Monitoring?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div>{item.REF_NO}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.LAST_UPDATE_DATE}
                  </div>
                </div>
                <div className="relative flex h-3 w-3 self-start">
                  <span
                    className={cn(
                      'absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75',
                      item.CHECK_YN === 'N' && 'bg-red-400',
                    )}
                  ></span>
                  <span
                    className={cn(
                      'relative inline-flex h-3 w-3 rounded-full bg-green-500',
                      item.CHECK_YN === 'N' && 'bg-red-400',
                    )}
                  ></span>
                </div>
              </div>
              <CardContent className="mt-3 flex items-center justify-between p-0">
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    <div className="w-[100px] shrink-0 text-muted-foreground">
                      LSP:
                    </div>
                    <div className="ml-1">{item.LSP_CD}</div>
                  </div>
                  <div className="flex">
                    <div className="w-[100px] shrink-0 text-muted-foreground">
                      Remarks:
                    </div>
                    <div className="ml-1">{item.REMARKS}</div>
                  </div>
                  <div className="flex">
                    <div className="w-[100px] shrink-0 text-muted-foreground">
                      Now Status:
                    </div>
                    <div className="ml-1 flex-1">{item.NOW_STATUS}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="-mr-3 h-10 w-10 self-end rounded-full p-0"
                  onClick={() => {
                    setRefNo(item.REF_NO)
                    setIsConfirm(true)
                  }}
                  disabled={isDeleteMonitoring}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <ConfirmDialog
        title="Delete Monitoring"
        desc={`Are you sure you want to delete Monitoring`}
        btnText="Delete"
        loading={isDeleteMonitoring}
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        callback={() => {
          setIsConfirm(false)
          deleteMonitoring(refNo)
        }}
      />
    </section>
  )
}

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/utils'
import { Plus, Trash2 } from 'lucide-react'
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
import { useState } from 'react'
import { User, Monitoring } from '@/types/data'
import request from '@/utils/request'
import Loading from '@/components/ui/loading'

export default function MonitoringView() {
  const [userList, setUserList] = useState<User[]>([])

  const {
    data: Monitoring,
    refetch: isRefetchMonitoring,
    isLoading,
    isRefetching,
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
      mutationFn: async ({ REF_NO }: { REF_NO: string }) => {
        const response = await request.post('/monitoring/deleteMonitoring', {
          REF_NO,
        })

        if (response.data) {
          return response.data
        }
      },
    })

  return (
    <section className="relative grow">
      <Loading isLoading={isLoading || isRefetching || isDeleteMonitoring} />
      <div className="flex h-10 items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Monitoring</h1>

        <Dialog>
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
            <div className="flex flex-1 gap-2">
              <Input placeholder="BL no. or TR no." />
              <Button>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <div>
                  <div className="flex items-center">
                    <span className="">LSP:</span>
                    <span className="ml-1">{item.LSP_CD}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="">Remarks:</span>
                    <span className="ml-1">{item.REMARKS}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="">Now Status:</span>
                    <span className="ml-1">{item.NOW_STATUS}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="-mr-3 h-10 w-10 self-end rounded-full p-0"
                  onClick={() => deleteMonitoring({ REF_NO: item.REF_NO })}
                  disabled={isDeleteMonitoring}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

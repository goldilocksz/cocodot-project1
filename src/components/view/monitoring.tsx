'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { User } from '@/types/data'
import { toast } from 'sonner'

export default function index() {
  const [userList, setUserList] = useState<User[]>([])
  const { data: LoginData } = useQuery({
    queryKey: ['getLoginInfo'],
    queryFn: async () => {
      const response = await fetch('/api/webCommon/getRouteMst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenceKey: 'dfoTg05dkQflgpsVdklub',
        }),
      })
      const data = await response.json()

      if (data.length === 0 || data?.error) {
        toast.error(data.error)
        return []
      }

      setUserList(data)
      return data ?? []
    },
  })

  return (
    <section>
      <div className="flex-middle h-10 justify-between">
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
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <pre>{JSON.stringify(LoginData, null, 2)}</pre>
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {index > 10 ? (
              <Card className="p-6 transition hover:border-green-400">
                <CardContent className="flex h-full items-center justify-center p-0">
                  <Plus className="mx-auto h-10 w-10" />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6 transition hover:border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <div>BL no. or TR no.</div>
                    <div className="text-sm text-muted-foreground">
                      2024-03-29 12:30:48
                    </div>
                  </div>
                  <div className="relative flex h-3 w-3 self-start">
                    <span
                      className={cn(
                        'absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75',
                        index % 2 ? 'bg-red-400' : 'animate-ping',
                      )}
                    ></span>
                    <span
                      className={cn(
                        'relative inline-flex h-3 w-3 rounded-full bg-green-500',
                        index % 2 && 'bg-red-400',
                      )}
                    ></span>
                  </div>
                </div>
                <CardContent className="mt-3 flex items-center justify-between p-0">
                  <div>
                    <div className="flex items-center">LSP: GDL</div>
                    <div className="flex items-center">Inv no: a122232452</div>
                    <div className="flex items-center">Status: ATA Border</div>
                  </div>
                  <Button
                    variant="ghost"
                    className="-mr-3 h-10 w-10 self-end rounded-full p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

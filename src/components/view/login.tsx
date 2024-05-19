'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { toast } from 'sonner'
import { LoginAction } from '@/actions/LoginAction'
import { useFormState } from 'react-dom'

export const formSchema = z.object({
  USER_ID: z.string().min(1, {
    message: 'UserId is required',
  }),
  USER_PW: z.string().min(1, {
    message: 'Password is required',
  }),
})

export default function LoginView() {
  const [state, formAction] = useFormState(LoginAction, {
    message: '',
  })
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      USER_ID: '',
      USER_PW: '',
    },
  })

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
      setIsPending(false)
    }
  }, [state])

  return (
    <Card className="mx-auto w-96 max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center py-6">
          <img src="/images/logo.png" alt="" className="w-[236px]" />
        </div>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit(() => {
                setIsPending(true)
                formAction(new FormData(formRef.current!))
              })(e)
            }}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="USER_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UserId</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="USER_PW"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

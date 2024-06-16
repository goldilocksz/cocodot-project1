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
import { useMutation } from '@tanstack/react-query'
import request from '@/utils/request'
import { useNavigate } from 'react-router-dom'

export const formSchema = z.object({
  USER_ID: z.string().min(1, {
    message: 'UserId is required',
  }),
  USER_PW: z.string().min(1, {
    message: 'Password is required',
  }),
})

export default function LoginView() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      USER_ID: '',
      USER_PW: '',
    },
  })

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      try {
        const { data } = await request.post('/auth/getToken', value)
        localStorage.setItem('token', String(data))
        const { data: user } = await request.post(
          '/webCommon/getLoginInfo',
          {},
          {
            headers: {
              Authorization: `Bearer ${data}`,
            },
          },
        )
        localStorage.setItem('user', JSON.stringify(user[0]))
        navigate('/')
      } catch (error) {
        toast.error('Invalid UserId or Password')
      }
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 py-10">
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
              onSubmit={form.handleSubmit(onSubmit)}
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
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

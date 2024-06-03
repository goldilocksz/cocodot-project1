import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const ClientCode = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Cnee, isPending } = useQuery({
      queryKey: ['getClientCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getClient', {})
        return data
      },
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Cnee?.map((item: { CLIENT_CODE: string; CLIENT_NAME: string }) => (
          <option key={item.CLIENT_CODE} value={item.CLIENT_NAME}>
            {item.CLIENT_NAME}
          </option>
        ))}
      </Select>
    )
  },
)

export default ClientCode

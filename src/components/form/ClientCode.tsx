import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const ClientCodeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: ClientCode, isPending } = useQuery({
      queryKey: ['getClientCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getClient', {})
        return data
      },
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {ClientCode?.map(
          (item: { CLIENT_CODE: string; CLIENT_NAME: string }) => (
            <option key={item.CLIENT_CODE} value={item.CLIENT_CODE}>
              {item.CLIENT_NAME}
            </option>
          ),
        )}
      </Select>
    )
  },
)

export default ClientCodeSelect

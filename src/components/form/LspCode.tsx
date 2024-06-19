import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const LspCode = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Cnee, isPending } = useQuery({
      queryKey: ['getLspCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getLSPCode', {})
        return data
      },
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Cnee?.map((item: { LSP_CODE: string; LSP_NAME: string }) => (
          <option key={item.LSP_CODE} value={item.LSP_NAME}>
            {item.LSP_NAME}
          </option>
        ))}
      </Select>
    )
  },
)

export default LspCode

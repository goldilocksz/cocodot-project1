import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const IncotermsForm = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Incoterms, isPending } = useQuery({
      queryKey: ['getIncoterms'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getCommonCode', {
          GROUP_CODE: 'INCOTERMS',
        })
        return data
      },
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Incoterms?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default IncotermsForm

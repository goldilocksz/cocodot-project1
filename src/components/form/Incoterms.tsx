import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/lib/request'

const IncotermsForm = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Incoterms, isPending } = useQuery({
      queryKey: ['getIncoterms'],
      queryFn: async () =>
        await request({
          url: '/webCommon/getCommonCode',
          body: {
            GROUP_CODE: 'INCOTERMS',
          },
        }),
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

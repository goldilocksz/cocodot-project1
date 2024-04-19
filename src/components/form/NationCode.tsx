import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/lib/request'

const NationCodeForm = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: NationCode, isPending } = useQuery({
      queryKey: ['getNationCode'],
      queryFn: async () =>
        await request({
          url: '/webCommon/getCommonCode',
          body: {
            GROUP_CODE: 'NATION_CD',
          },
        }),
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {NationCode?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default NationCodeForm

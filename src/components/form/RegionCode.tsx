import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const RegionCode = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: NationCode, isPending } = useQuery({
      queryKey: ['geRegionCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getCommonCode', {
          GROUP_CODE: 'REGION',
        })
        return data
      },
    })

    return (
      <Select ref={ref} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {NationCode?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
          <option key={item.DT_CODE} value={item.DT_CODE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default RegionCode

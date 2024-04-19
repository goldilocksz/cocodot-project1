import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/lib/request'

const TruckType = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: TruckTypeCode, isPending } = useQuery({
      queryKey: ['getTruckTypeCode'],
      queryFn: async () =>
        await request({
          url: '/webCommon/getCommonCode',
          body: {
            GROUP_CODE: 'TRUCK_TYPE',
          },
        }),
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select {...props}>
        {isPending ? (
          <option>Loading...</option>
        ) : (
          <option value="">Select</option>
        )}
        {TruckTypeCode?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default TruckType

import { useQuery } from '@tanstack/react-query'
import { Select } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const CommonTruckType = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  const { data: TruckTypeCode, isLoading } = useQuery({
    queryKey: ['getTruckTypeCode'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getCommonCode', {
        GROUP_CODE: 'TRUCK_TYPE',
      })
      return data
    },
    staleTime: 1000 * 60 * 60,
  })

  return (
    <Select ref={ref} {...props}>
      {isLoading ? (
        <option>Loading...</option>
      ) : (
        <option value="">Select</option>
      )}
      {TruckTypeCode?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
        <option key={item.DT_CODE} value={item.LOC_VALUE}>
          {item.DT_CODE}
        </option>
      ))}
    </Select>
  )
})

export default CommonTruckType

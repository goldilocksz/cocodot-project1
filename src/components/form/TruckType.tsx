import { useQuery } from '@tanstack/react-query'
import { Select } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  nationCode: string | undefined
}

const TruckType = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    const { data: TruckTypeCode, isLoading } = useQuery({
      queryKey: ['getTruckTypeCode', props.nationCode],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getTrcuk', {
          NATION_CD: props.nationCode,
        })
        return data
      },
      staleTime: 1000 * 60 * 60,
      enabled: !!props.nationCode,
    })

    return (
      <Select ref={ref} {...props}>
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          <option value="">Select</option>
        )}
        {TruckTypeCode?.map(
          (item: { TRUCK_NO: string; TRUCK_TYPE: string }) => (
            <option
              key={item.TRUCK_NO}
              value={item.TRUCK_NO}
              data-type={item.TRUCK_TYPE}
            >
              {item.TRUCK_NO}
            </option>
          ),
        )}
      </Select>
    )
  },
)

export default TruckType

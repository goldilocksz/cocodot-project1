import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const CneeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Cnee, isPending } = useQuery({
      queryKey: ['getCnee'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getCnee', {})
        return data
      },
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? (
          <option value="">Loading...</option>
        ) : (
          <option value="">Select</option>
        )}
        {Cnee?.map((item: { CNEE_CODE: string; CNEE_NAME: string }) => (
          <option
            key={item.CNEE_CODE}
            value={item.CNEE_CODE}
            data-name={item.CNEE_NAME}
          >
            {item.CNEE_NAME}
          </option>
        ))}
      </Select>
    )
  },
)

export default CneeSelect

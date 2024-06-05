import { useQuery } from '@tanstack/react-query'
import { Select } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  CUSTOMER_CODE: string | undefined
}

const DeptCodeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, CUSTOMER_CODE, ...props }, ref) => {
    const { data: DeptCode, isLoading } = useQuery({
      queryKey: ['getDeptCode', CUSTOMER_CODE],
      queryFn: async () => {
        const { data } = await request.post('/customer/getCustomerDept', {
          CUSTOMER_CODE,
        })
        return data
      },
      staleTime: 1000 * 60 * 60,
      enabled: !!CUSTOMER_CODE,
    })

    return (
      <Select ref={ref} {...props}>
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          <option value="">Select</option>
        )}
        {DeptCode?.map((item: { DEPT_CODE: string; DEPT_NAME: string }) => (
          <option
            key={item.DEPT_CODE}
            value={item.DEPT_CODE}
            data-type={item.DEPT_NAME}
          >
            {item.DEPT_CODE}
          </option>
        ))}
      </Select>
    )
  },
)

export default DeptCodeSelect

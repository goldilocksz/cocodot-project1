import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const Customer = forwardRef<HTMLSelectElement, SelectProps>(
  ({ type, ...props }, ref) => {
    const { data: Cnee, isPending } = useQuery({
      queryKey: ['getCustomerCode'],
      queryFn: async () => {
        const { data } = await request.post('/customer/getCustomer', {})
        return data
      },
    })

    return (
      <Select ref={ref} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Cnee?.map((item: { CUSTOMER_CODE: string; CUSTOMER_NAME: string }) => (
          <option
            key={item.CUSTOMER_CODE}
            value={item.CUSTOMER_CODE}
            data-name={item.CUSTOMER_NAME}
          >
            {item.CUSTOMER_NAME}
          </option>
        ))}
      </Select>
    )
  },
)

export default Customer

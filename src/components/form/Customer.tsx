import { Select, SelectProps } from '../ui/select'
import { forwardRef, useEffect, useState } from 'react'
import request from '@/utils/request'

const Customer = forwardRef<HTMLSelectElement, SelectProps>(
  ({ type, ...props }, ref) => {
    const [customerData, setCustomerData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/customer/getCustomer', {});
          setCustomerData(data);
        } catch (error) {
          console.error('Error fetching Customer data:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    return (
      <Select ref={ref} {...props}>
        {isLoading ? <option>Loading...</option> : <option value="">Select</option>}
        {customerData.map((item: { CUSTOMER_CODE: string; CUSTOMER_NAME: string }) => (
          <option
            key={item.CUSTOMER_CODE}
            value={item.CUSTOMER_CODE}
            data-name={item.CUSTOMER_NAME}
          >
            {item.CUSTOMER_NAME}
          </option>
        ))}
      </Select>
    );
  },
);

export default Customer;

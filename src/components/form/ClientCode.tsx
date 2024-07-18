import { Select, SelectProps } from '../ui/select'
import { forwardRef, useEffect, useState } from 'react'
import request from '@/utils/request'

const ClientCodeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    const [clientCode, setClientCode] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getClient', {});
          setClientCode(data);
        } catch (error) {
          console.error('Error fetching client codes:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    return (
      <Select ref={ref} className={className} {...props}>
        {isLoading ? <option value="">Loading...</option> : <option value="">Select</option>}
        {clientCode.map((item: { CLIENT_CODE: string; CLIENT_NAME: string }) => (
          <option key={item.CLIENT_CODE} value={item.CLIENT_CODE}>
            {item.CLIENT_NAME}
          </option>
        ))}
      </Select>
    );
  }
);

export default ClientCodeSelect;
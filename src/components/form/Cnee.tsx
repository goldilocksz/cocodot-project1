import { Select, SelectProps } from '../ui/select'
import { forwardRef, useEffect, useState } from 'react'
import request from '@/utils/request'

const CneeSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    const [cnee, setCnee] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getCnee', {});
          setCnee(data);
        } catch (error) {
          console.error('Error fetching Cnee codes:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    return (
      <Select ref={ref} className={className} {...props}>
        {isLoading ? <option>Loading...</option> : <option>Select</option>}
        {cnee.map((item: { CNEE_CODE: string; CNEE_NAME: string }) => (
          <option key={item.CNEE_CODE} value={item.CNEE_CODE} data-name={item.CNEE_NAME}>
            {item.CNEE_NAME}
          </option>
        ))}
      </Select>
    );
  }
);

export default CneeSelect;

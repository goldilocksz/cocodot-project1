import { Select } from '../ui/select'
import { forwardRef, useEffect, useState } from 'react'
import request from '@/utils/request'

const CommonTruckType = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  const [truckTypeCode, setTruckTypeCode] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await request.post('/webCommon/getCommonCode', {
          GROUP_CODE: 'TRUCK_TYPE',
        });
        setTruckTypeCode(data);
      } catch (error) {
        console.error('Error fetching Truck Type codes:', error);
        // Handle error state here if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Select ref={ref} {...props}>
      {isLoading ? <option>Loading...</option> : <option>Select</option>}
      {truckTypeCode.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
        <option key={item.DT_CODE} value={item.LOC_VALUE}>
          {item.DT_CODE}
        </option>
      ))}
    </Select>
  );
});

export default CommonTruckType;

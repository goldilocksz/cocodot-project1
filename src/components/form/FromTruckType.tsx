import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface TruckType {
  TRUCK_NO: string;
  TRUCK_TYPE: string;
}

interface FromTruckTypeProps extends SelectProps {
  nationcode: string | undefined;
}

const FromTruckType = forwardRef<HTMLSelectElement, FromTruckTypeProps>(
  ({ nationcode, ...props }, ref) => {
    const [truckTypeCode, setTruckTypeCode] = useState<TruckType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getTrcuk', {
            FROM_NATION_CD: nationcode,
          });
          setTruckTypeCode(data);
        } catch (error) {
          console.error('Error fetching Truck types:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      if (nationcode) {
        fetchData();
      } else {
        setTruckTypeCode([]);
        setIsLoading(false);
      }
    }, [nationcode]);

    return (
      <Select ref={ref} {...props}>
        {isLoading ? <option>Loading...</option> : <option>Select</option>}
        {truckTypeCode.map((item) => (
          <option
            key={item.TRUCK_NO}
            value={item.TRUCK_NO}
            data-type={item.TRUCK_TYPE}
          >
            {item.TRUCK_NO}
          </option>
        ))}
      </Select>
    );
  },
);

export default FromTruckType;

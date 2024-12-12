import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface PolFormProps extends SelectProps {
  className?: string;
}

const PolForm = forwardRef<HTMLSelectElement, PolFormProps>(
  ({ className, ...props }, ref) => {
    const [Pol, setPol] = useState<{ DT_CODE: string; LOC_VALUE: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchPolData = async () => {
        try {
          const { data } = await request.post('/webCommon/getCommonCode', {
            GROUP_CODE: 'POL',
          });
          setPol(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching POL codes:', error);
          setIsLoading(false);
        }
      };

      fetchPolData();
    }, []);

    return (
      <Select ref={ref} {...props} className={className}>
        {isLoading ? <option>Loading...</option> : <option value="">Select</option>}
        {Pol.map((item) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    );
  }
);

export default PolForm;

import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface RegionCodeProps extends SelectProps {
  className?: string;
}

const RegionCode = forwardRef<HTMLSelectElement, RegionCodeProps>(
  ({ className, ...props }, ref) => {
    const [regionCodes, setRegionCodes] = useState<{ DT_CODE: string; LOC_VALUE: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchRegionCodes = async () => {
        try {
          const { data } = await request.post('/webCommon/getCommonCode', {
            GROUP_CODE: 'REGION',
          });
          setRegionCodes(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching region codes:', error);
          setIsLoading(false);
        }
      };

      fetchRegionCodes();
    }, []);

    return (
      <Select ref={ref} {...props} className={className}>
        {isLoading ? <option>Loading...</option> : <option value="">Select</option>}
        {regionCodes.map((item) => (
          <option key={item.DT_CODE} value={item.DT_CODE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    );
  }
);

export default RegionCode;

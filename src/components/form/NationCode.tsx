import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface NationCode {
  DT_CODE: string;
  LOC_VALUE: string;
}

interface NationCodeFormProps extends SelectProps {}

const NationCodeForm = forwardRef<HTMLSelectElement, NationCodeFormProps>(
  ({ className, ...props }, ref) => {
    const [nationCodes, setNationCodes] = useState<NationCode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getCommonCode', {
            GROUP_CODE: 'NATION_CD',
          });
          setNationCodes(data);
        } catch (error) {
          console.error('Error fetching nation codes:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    return (
      <Select ref={ref} className={className} {...props}>
        {isLoading ? <option>Loading...</option> : <option value="">Select</option>}
        {nationCodes.map((item) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    );
  },
);

export default NationCodeForm;

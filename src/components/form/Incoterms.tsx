import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface Incoterm {
  DT_CODE: string;
  LOC_VALUE: string;
}

interface IncotermsFormProps extends SelectProps {}

const IncotermsForm = forwardRef<HTMLSelectElement, IncotermsFormProps>(
  ({ className, ...props }, ref) => {
    const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getCommonCode', {
            GROUP_CODE: 'INCOTERMS',
          });
          setIncoterms(data);
        } catch (error) {
          console.error('Error fetching Incoterms:', error);
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
        {incoterms.map((item) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    );
  },
);

export default IncotermsForm;

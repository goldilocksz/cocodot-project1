import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface DeptCode {
  DEPT_CODE: string;
  DEPT_NAME: string;
}

interface DeptCodeSelectProps extends SelectProps {
  CUSTOMER_CODE: string | undefined;
}

const DeptCodeSelect = forwardRef<HTMLSelectElement, DeptCodeSelectProps>(
  ({ CUSTOMER_CODE, ...props }, ref) => {
    const [deptCode, setDeptCode] = useState<DeptCode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/customer/getCustomerDept', {
            CUSTOMER_CODE,
          });
          setDeptCode(data);
        } catch (error) {
          console.error('Error fetching Department codes:', error);
          // Handle error state here if needed
        } finally {
          setIsLoading(false);
        }
      };

      if (CUSTOMER_CODE) {
        fetchData();
      } else {
        setDeptCode([]);
        setIsLoading(false);
      }
    }, [CUSTOMER_CODE]);

    return (
      <Select ref={ref} {...props}>
        {isLoading ? <option>Loading...</option> : <option value="">Select</option>}
        {deptCode.map((item) => (
          <option
            key={item.DEPT_CODE}
            value={item.DEPT_CODE}
            data-type={item.DEPT_NAME}
          >
            {item.DEPT_CODE}
          </option>
        ))}
      </Select>
    );
  },
);

export default DeptCodeSelect;

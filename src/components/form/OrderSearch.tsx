import { useQuery } from '@tanstack/react-query';
import { Select, SelectProps } from '../ui/select';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import request from '@/utils/request';

interface OrderProps extends SelectProps {
  className?: string;
}

const Order: ForwardRefRenderFunction<HTMLSelectElement, OrderProps> = 
  ({ className, ...props }, ref) => {
    const { data: Orders, isPending } = useQuery({
      queryKey: ['getOrder'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getOrder', {});
        return data;
      },
    });

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option value="">Select</option>}
        {Orders?.map((item: { LSP_CODE: string; LSP_NAME: string }) => (
          <option key={item.LSP_CODE} value={item.LSP_NAME}>
            {item.LSP_NAME}
          </option>
        ))}
      </Select>
    );
  };

export default forwardRef(Order);

import { useQuery } from '@tanstack/react-query';
import { Select, SelectProps } from '../ui/select';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import request from '@/utils/request';

interface LspCodeProps extends SelectProps {
  className?: string;
}

const LspCode: ForwardRefRenderFunction<HTMLSelectElement, LspCodeProps> = 
  ({ className, ...props }, ref) => {
    const { data: LspCodes, isPending } = useQuery({
      queryKey: ['getLspCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getLSPCode', {});
        return data;
      },
    });

    return (
      <Select ref={ref} className={className} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {LspCodes?.map((item: { LSP_CODE: string; LSP_NAME: string }) => (
          <option key={item.LSP_CODE} value={item.LSP_NAME}>
            {item.LSP_NAME}
          </option>
        ))}
      </Select>
    );
  };

export default forwardRef(LspCode);

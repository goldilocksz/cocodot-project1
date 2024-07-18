import { Select, SelectProps } from '../ui/select';
import { forwardRef, useEffect, useState } from 'react';
import request from '@/utils/request';

interface Lsp {
  LSP_CODE: string;
  LSP_NAME: string;
}

interface LspCodeProps extends SelectProps {}

const LspCode = forwardRef<HTMLSelectElement, LspCodeProps>(
  ({ className, ...props }, ref) => {
    const [lsps, setLsps] = useState<Lsp[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { data } = await request.post('/webCommon/getLSPCode', {});
          setLsps(data);
        } catch (error) {
          console.error('Error fetching LSP codes:', error);
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
        {lsps.map((item) => (
          <option key={item.LSP_CODE} value={item.LSP_NAME}>
            {item.LSP_NAME}
          </option>
        ))}
      </Select>
    );
  },
);

export default LspCode;

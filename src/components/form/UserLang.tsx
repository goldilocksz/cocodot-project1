import { useEffect, useState } from 'react';
import { Select } from '../ui/select';
import request from '@/utils/request';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const UserLang = ({ className, ...props }: Props) => {
  const [userLang, setUserLang] = useState<{ DT_CODE: string; LOC_VALUE: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserLang = async () => {
      try {
        const { data } = await request.post('/webCommon/getCommonCode', {
          GROUP_CODE: 'USER_LANG',
        });
        setUserLang(data);
      } catch (error) {
        console.error('Error fetching user languages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLang();
  }, []);

  return (
    <Select className={className} {...props}>
      <option>Select</option>
      {isLoading ? (
        <option>Loading...</option>
      ) : (
        userLang.map((item) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.DT_CODE}
          </option>
        ))
      )}
    </Select>
  );
};

export default UserLang;

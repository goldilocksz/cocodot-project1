import { Select, SelectProps } from '../ui/select';
import { forwardRef } from 'react';
import request from '@/utils/request';

const RouteMst = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    // 동기적으로 데이터를 가져오는 함수
    const fetchRouteCd = async () => {
      try {
        const response = await request.post('/webCommon/getRouteMst', {});
        return response.data; // 데이터 반환
      } catch (error) {
        console.error('Error fetching route codes:', error);
        throw error; // 에러 처리
      }
    };

    // 데이터 가져오기
    fetchRouteCd().then(routeCdData => {
      // routeCdData를 state에 저장하거나 직접 사용할 수 있음
      // 예: setRouteCdData(routeCdData);
    }).catch(error => {
      console.error('Error fetching route codes:', error);
    });

    return (
      <Select ref={ref} {...props}>
        <option>Loading...</option>
      </Select>
    );
  },
);

export default RouteMst;

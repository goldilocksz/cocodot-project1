import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const RouteMst = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: RouteCd, isPending } = useQuery({
      queryKey: ['geRouteMstCode'],
      queryFn: async () => {
        const { data } = await request.post('/webCommon/getRouteMst', {})
        return data
      },
    })

    return (
      <Select ref={ref} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {RouteCd?.map(
          (item: {
            ROUTE_CODE: string
            NATION_CD: string
            ROUTE_NAME: string
          }) => (
            <option
              key={item.ROUTE_CODE}
              value={item.ROUTE_CODE}
              data-nation={item.NATION_CD}
            >
              {item.ROUTE_NAME}
            </option>
          ),
        )}
      </Select>
    )
  },
)

export default RouteMst

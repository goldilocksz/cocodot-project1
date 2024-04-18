import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from '../ui/select'
import { forwardRef } from 'react'

const PolForm = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    const { data: Pol, isPending } = useQuery({
      queryKey: ['getPol'],
      queryFn: async () => {
        const response = await fetch('/api/webCommon/getCommonCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            GROUP_CODE: 'POL',
            licenceKey: 'dfoTg05dkQflgpsVdklub',
          }),
        })
        const data = (await response.json()) as {
          DT_CODE: string
          LOC_VALUE: string
        }[]

        return data ?? []
      },
      staleTime: 1000 * 60 * 60,
    })

    return (
      <Select ref={ref} {...props}>
        {isPending ? <option>Loading...</option> : <option>Select</option>}
        {Pol?.map((item) => (
          <option key={item.DT_CODE} value={item.LOC_VALUE}>
            {item.LOC_VALUE}
          </option>
        ))}
      </Select>
    )
  },
)

export default PolForm

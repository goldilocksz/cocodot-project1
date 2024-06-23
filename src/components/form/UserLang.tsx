import { useQuery } from '@tanstack/react-query'
import { Select } from '../ui/select'
import { forwardRef } from 'react'
import request from '@/utils/request'

const UserLang = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  const { data: UserLang, isLoading } = useQuery({
    queryKey: ['getUserLang'],
    queryFn: async () => {
      const { data } = await request.post('/webCommon/getCommonCode', {
        GROUP_CODE: 'USER_LANG',
      })
      return data
    },
  })

  return (
    <Select ref={ref} {...props}>
      <option>Select</option>
      {UserLang?.map((item: { DT_CODE: string; LOC_VALUE: string }) => (
        <option key={item.DT_CODE} value={item.LOC_VALUE}>
          {item.DT_CODE}
        </option>
      ))}
    </Select>
  )
})

export default UserLang

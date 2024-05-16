import Order from '@/components/view/order'
import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'
import { Order as OrderType } from '@/types/data'

export default async function page() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data: OrderType[] = await request({
    url: '/order/getOrderList',
    body: {
      S_GRADE: user.GRADE,
      S_CUSTOMER_TYPE: user.CUSTOMER_TYPE,
      S_CUSTOMER_CODE: user.CUSTOMER_CODE,
      S_COMPANY_CODE: user.COMPANY_CODE,
    },
    server: true,
  })

  const allKeys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj))))

  const orders = data.map((obj, index) => {
    let newObj: any = {}
    allKeys.forEach((key) => {
      newObj[key] = obj[key as keyof OrderType] ?? ''
    })
    newObj['id'] = index + 1
    return newObj
  })

  return <Order auth={user} data={orders} />
}

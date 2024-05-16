import request from '@/lib/request'
import { Auth, TrReport } from '@/types/data'
import { cookies } from 'next/headers'
import BlReport from '@/components/view/blreport'
import dayjs from 'dayjs'

export default async function BlReportPage() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data: TrReport[] = await request({
    url: '/report/getBLReport',
    body: {
      JOB_FRM: dayjs().subtract(1, 'month').format('YYYYMMDD'),
      JOB_TO: dayjs().format('YYYYMMDD'),
      S_COMPANY_CODE: user.COMPANY_CODE,
    },
    server: true,
  })

  const allKeys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj))))

  const report = data.map((obj, index) => {
    let newObj: any = {}
    newObj['id'] = index + 1
    allKeys.forEach((key) => {
      newObj[key] = obj[key as keyof TrReport] ?? ''
    })
    return newObj
  })

  return (
    <section>
      <BlReport auth={user} data={report}></BlReport>
    </section>
  )
}

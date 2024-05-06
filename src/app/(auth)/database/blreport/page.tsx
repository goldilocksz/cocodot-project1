import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'
import BlReport from '@/components/view/blreport'
import dayjs from 'dayjs'

export default async function BlReportPage() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/report/getBLReport',
    body: {
      JOB_FRM: dayjs().subtract(1, 'month').format('YYYYMMDD'),
      JOB_TO: dayjs().format('YYYYMMDD'),
      S_COMPANY_CODE: user.COMPANY_CODE,
    },
    server: true,
  })

  const report = data.map((item: any, index: number) => ({
    ...item,
    id: index + 1,
  }))

  return (
    <section>
      <BlReport data={report}></BlReport>
    </section>
  )
}

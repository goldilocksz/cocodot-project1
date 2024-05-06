import request from '@/lib/request'
import { Auth } from '@/types/data'
import { cookies } from 'next/headers'
import TrReport from '@/components/view/trreport'
import dayjs from 'dayjs'

export default async function TrReportPage() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data = await request({
    url: '/report/getTRReport',
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
      <TrReport auth={user} data={report}></TrReport>
    </section>
  )
}

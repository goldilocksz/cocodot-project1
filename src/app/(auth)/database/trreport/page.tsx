import request from '@/utils/request'
import { Auth, TrReport } from '@/types/data'
import { cookies } from 'next/headers'
import TrReportView from '@/components/pages/trreport'
import dayjs from 'dayjs'

export default async function TrReportPage() {
  const cookieStore = cookies()
  const user = JSON.parse(cookieStore.get('user')?.value!) as Auth

  const data: TrReport[] = await request({
    url: '/report/getTRReport',
    body: {
      JOB_FRM: dayjs().subtract(1, 'month').format('YYYYMMDD'),
      JOB_TO: dayjs().format('YYYYMMDD'),
      S_COMPANY_CODE: user.COMPANY_CODE,
    },
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
      <TrReportView auth={user} data={report}></TrReportView>
    </section>
  )
}

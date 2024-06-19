import Chart from 'react-apexcharts'

type Data = {
  name: string
  data: number[]
  date: string
}
interface Props {
  data: Data[]
}

export default function ChartUI({ data }: Props) {
  return (
    <Chart
      options={{
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          animations: {
            speed: 1000,
          },
        },
        dataLabels: {
          enabled: true,
        },
        colors: ['#2563eb', '#52525b', '#020617'],
        stroke: {
          width: 1,
          lineCap: 'round',
          curve: 'smooth',
        },
        markers: {
          size: 0,
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            style: {
              colors: ['#2563eb', '#52525b', '#020617'],
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 400,
            },
          },
          categories: data[0].date,
        },
        yaxis: {
          tickAmount: 3,
          labels: {
            style: {
              colors: '#616161',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 400,
            },
          },
        },
        grid: {
          show: true,
          borderColor: '#dddddd',
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        fill: {
          opacity: 0.8,
        },
        tooltip: {
          theme: 'dark',
        },
      }}
      series={data}
      type="bar"
      width="100%"
      height={350}
    ></Chart>
  )
}

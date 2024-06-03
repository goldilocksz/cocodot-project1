import Chart from 'react-apexcharts'

export default function ChartUI({ data }: any) {
  return (
    <Chart
      options={{
        chart: {
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
          enabled: false,
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
          categories: data.labels,
        },
        yaxis: {
          labels: {
            style: {
              colors: '#616161',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 400,
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
      series={data.datasets}
      type="bar"
      width="100%"
      height={350}
    ></Chart>
  )
}

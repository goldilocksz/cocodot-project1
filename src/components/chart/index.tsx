import Chart from 'react-apexcharts'

export default function ChartUI({ data }: any) {
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
          categories: data.labels,
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
        legend: {
          show: true,
          showForSingleSeries: true,
          customLegendItems: ['ATD FACTORY', 'ETD FACTORY'],
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
          intersect: false,
        },
      }}
      series={data.datasets}
      type="bar"
      width="100%"
      height={350}
    ></Chart>
  )
}

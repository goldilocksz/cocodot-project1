import Chart from 'react-apexcharts'

export default function ChartUI() {
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
          enabled: false,
        },
        colors: ['#2563eb', '#52525b', '#020617'],
        stroke: {
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
          categories: [
            '21-MAR',
            '22-MAR',
            '23-MAR',
            '24-MAR',
            '25-MAR',
            '26-MAR',
          ],
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
      series={[
        {
          name: 'ATA FACTORY',
          data: [30, 40, 56, 26, 49, 60],
        },
        {
          name: 'ETD FACTORY',
          data: [32, 50, 11, 60, 22, 70],
        },
      ]}
      type="bar"
      width="100%"
      height={350}
    ></Chart>
  )
}

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)
/**
 * Pie chart component
 */
interface PieChartProps {
  /**
   * Label
   */
  labels_props?: string[] | any
  /**
   * Series
   */
  series_props?: number[] | any
}
const PieChart = ({ labels_props, series_props }: PieChartProps) => {
  /**
   * Dữ liệu biểu đồ
   */
  const DATA = {
    labels: labels_props,
    datasets: [
      {
        // label: '# of Votes',
        /**
         * Dữ liệu
         */
        data: series_props,
        /**
         * Màu nền
         */
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        /**
         *  Màu khi hover
         */
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        // borderWidth: 1,
      },
    ],
  }
  /**
   * Cài đặt lựa chọn cho biểu đồ
   */
  const OPTIONS = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          /** Giảm kích thước ô màu trong legend nếu cần */
          boxWidth: 10,
          radius: 10,
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        /**
         *  Hiển thị giá trị trên biểu đồ
         * @param value  giá trị
         * @param context  ngữ cảnh
         * @returns  giá trị
         */
        formatter: (value: number, context: any) => {
          /**
           * Tính tổng giá trị
           */
          const TOTAL = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0,
          )
          /**
           * Tính phần trăm
           */
          const PERCENTAGE = ((value / TOTAL) * 100).toFixed(2) + '%'
          /**
           * Trả về giá trị
           */
          return PERCENTAGE
        },
        color: '#000',
        // font: {
        //   weight: 'bold',
        // },
      },
    },
  }

  return (
    <div className="w-full flex justify-center items-center">
      <Pie
        data={DATA}
        options={OPTIONS}
        className="md:h-56 md:w-56"
      />
    </div>
  )
}

export default PieChart

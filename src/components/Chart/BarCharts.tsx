import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
)
/**
 * Bar chart component
 */
interface ColumnChartProps {
  /**
   * Dữ liệu tag
   */
  category_props?: string[]
  /**
   * Dữ liệu series
   */
  series_props?: number[]
  /**
   * Tên series
   */
  series_name?: string
}
const BarChart = ({
  category_props,
  series_props,
  series_name,
}: ColumnChartProps) => {
  /**
   * Dữ liệu biểu đồ
   */
  const DATA = {
    /**
     * Tên các nhãn
     */
    labels: category_props || ['Red', 'Blue', 'Yellow'],
    /**
     * Dữ liệu biểu đồ
     */
    datasets: [
      {
        label: series_name || 'Cảm xúc',
        data: series_props || [12, 19, 3],
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#36A2EB'],
        borderWidth: 1,
        color: ['white'],
      },
    ],
  }
  /**
   * Cài đặt lựa chọn cho biểu đồ
   */
  const OPTIONS = {
    /**
     * Cài đặt cho biểu đồ
     */
    responsive: true,
    /**
     * Cài đặt cho biểu đồ
     */
    maintainAspectRatio: false,
    /**
     * Cài đặt cho biểu đồ
     */
    plugins: {
      /**
       * Cài đặt cho biểu đồ
       */
      legend: {
        /**
         * Hiển thị
         */
        display: false,
      },
      /**
       * Cài đặt cho biểu đồ
       */
      tooltip: {
        /**
         * Hiển thị
         */
        enabled: true,
      },
      /**
       * Cài đặt cho biểu đồ
       */
      datalabels: {
        /**
         * Hiển thị
         */
        color: '#000',
        // anchor: 'end', // Vị trí của nhãn (gắn vào đỉnh cột)
        // align: 'end', // Canh nhãn theo đỉnh cột
        // font: {
        //   weight: 'bold',
        // },
      },
    },
    /**
     * Cài đặt cho biểu đồ scale
     */
    scales: {
      /**
       * Cài đặt cho biểu đồ (trục y)
       */
      y: {
        /**
         * Cài đặt cho biểu đồ (bắt đầu từ 0)
         */
        beginAtZero: true,
      },
      /**
       * Cài đặt cho biểu đồ (trục x)
       */
      x: {
        /**
         * Cài đặt cho biểu đồ (nhãn)
         */
        grid: {
          /** Ẩn lưới dọc */
          display: false,
        },
        /**
         * Cài đặt cho biểu đồ (nhãn)
         */
        ticks: {
          /**Hiển thị các nhãn */
          display: true,
        },
      },
    },
  }

  return (
    <Bar
      data={DATA}
      options={OPTIONS}
    />
  )
}

export default BarChart

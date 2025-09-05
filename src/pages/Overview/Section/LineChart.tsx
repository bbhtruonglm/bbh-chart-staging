import ReactApexChart from 'react-apexcharts'

/**
 * Line chart component
 */
interface LineChartProps {
  /**
   * Series data
   */
  series_data: any
  /**
   * Categories data
   */
  categories: string[]
}
const LineChart = ({ series_data, categories }: LineChartProps) => {
  /**
   * Cài đặt lựa chọn cho biểu đồ
   */
  const OPTIONS = {
    /**
     * Cài đặt thanh công cụ
     */
    chart: {
      /**
       * Hiển thị thanh công cụ
       */
      toolbar: {
        /**
         * Hiển thị
         */
        show: false,
      },
    },
    /**
     * Cài đặt trục x
     */
    xaxis: {
      /** Dates as x-axis labels */
      categories: categories,
    },
    /**
     * Cài đặt trục y
     */
    stroke: {
      // curve: 'smooth',
      /**
       * Độ rộng
       */
      width: 2,
    },
    /**
     * Cài đặt tooltip
     */
    tooltip: {
      /**
       * Cài đặt định dạng
       */
      x: {
        /**
         * Định dạng
         */
        format: 'yyyy-MM-dd',
      },
    },
  }
  /**
   * Dữ liệu series
   */
  const SERIES = series_data

  return (
    <div>
      <ReactApexChart
        options={OPTIONS}
        series={SERIES}
        type="line"
        height={250}
      />
    </div>
  )
}

export default LineChart

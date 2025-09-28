import Chart from 'react-apexcharts'
interface ChartProps {
  /**
   * Dữ liệu series của biểu đồ
   */
  series_chart: any
  /**
   * Dữ liệu categories của biểu đồ
   */
  categories_chart: any

  /** type */
  type?: string
}

type CHAT_TYPE =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'boxPlot'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | 'rangeArea'
  | 'treemap'

/**
 * Biểu đồ tùy chỉnh
 * @param series_chart
 * @param categories_chart
 * @returns
 */
type CurveType =
  | 'smooth'
  | 'straight'
  | 'stepline'
  | 'linestep'
  | 'monotoneCubic'

function ChartCustom({
  series_chart,
  categories_chart,
  type = 'line',
}: ChartProps) {
  /** Màu sắc cố định cho 18 phần đầu tiên */
  const FIXED_COLORS = [
    '#1D4ED8',
    '#CA8A04',
    '#FF5733',
    '#00E396',
    '#008FFB',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#C70039',
    '#546E7A',
    '#26A69A',
    '#FF5733',
    '#117A65',
    '#D10CE8',
    '#581845',
    '#1E8449',
    '#900C3F',
    '#1F618D',
  ]
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
    series: [
      {
        /**
         * Dữ liệu
         */
        data: series_chart,
      },
    ],
    /**
     * Cài đặt màu sắc
     */
    colors: FIXED_COLORS,
    /**
     * Cài đặt trục x
     */
    xaxis: {
      /**
       * Dates as x-axis labels
       */
      categories: categories_chart,
      /**
       * Cài đặt nhãn
       */
      labels: {
        /**
         *  Định dạng nhãn
         * @param value  giá trị
         * @returns
         */
        formatter: function (value: string) {
          /** Giới hạn chiều dài của label, có thể tùy chỉnh */
          return value?.length > 10 ? value.substring(0, 11) + '...' : value
        },
        /**
         * Xoay nhãn trục X
         */
        rotate: 0,
      },
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
    /**
     * Cài đặt đường
     */
    stroke: {
      /**
       * Độ rộng
       */
      width: 2,
      /**
       * Loại đường
       */
      curve: 'smooth' as CurveType,
    },
    /** Không hiện chú thích */
    legend: {
      /**
       *  Hiển thị
       */
      show: true,
    },
    /** Responsive màn Mobile */
    responsive: [
      {
        /**
         * Điểm breakpoint
         */
        breakpoint: 768,
        /**
         * Cài đặt
         */
        options: {
          /**
           * Cài đặt trục x
           */
          xaxis: {
            /**
             * Cài đặt nhãn
             */
            labels: {
              /** Xoay nhãn trục X 45 độ trên mobile */
              rotate: -45,
              /**
               * Cài đặt style
               */
              style: {
                /** Giảm kích thước chữ nếu cần */
                fontSize: '10px',
              },
            },
          },
          /**
           * Cài đặt biểu đồ
           */
          chart: {
            /** Chiều cao biểu đồ cho mobile */
            height: 400,
            /**
             * Cài đặt thanh công cụ
             */
            toolbar: {
              /**
               *  Hiển thị thanh công cụ
               */
              show: false,
            },
          },
          /**
           * Cài đặt legend
           */
          legend: {
            /**
             * Hiển thị
             */
            show: true,
            /** Đặt legend xuống phía dưới trên mobile */
            // position: 'bottom',
            /** Giảm kích thước font */
            fontSize: '10px',
          },
          /**
           * Cài đặt đường
           */
          stroke: {
            /** Giảm độ dày đường nét trên mobile */
            width: 1,
          },
        },
      },
    ],
  }

  return (
    <Chart
      options={OPTIONS}
      series={series_chart}
      type={type as CHAT_TYPE}
      height="250px"
    />
  )
}

export default ChartCustom

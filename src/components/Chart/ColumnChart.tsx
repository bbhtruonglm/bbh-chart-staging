import Chart from 'react-apexcharts'

/**
 * Column chart component
 */
interface ColumnChartProps {
  /**
   * Dữ liệu categories của biểu đồ
   */
  category_props?: string[]
  /**
   * Dữ liệu series của biểu đồ
   */
  series_props?: number[]
  /**
   * Chiều cao của biểu đồ
   */
  height?: number
  /**
   * Tên series
   */
  series_name?: string
}
const ColumnChart = ({
  category_props,
  series_props,
  height = 250,
  series_name,
}: ColumnChartProps) => {
  /**
   * Cài đặt lựa chọn cho biểu đồ
   */
  const OPTIONS = {
    /**
     * Cài đặt cho biểu đồ
     */
    xaxis: {
      categories: category_props || [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
      ],
      /**
       * Cài đặt cho nhãn
       */
      labels: {
        // style: {
        //   whiteSpace: 'nowrap', // Ngăn nhãn bị ngắt dòng
        //   overflow: 'hidden',
        //   textOverflow: 'ellipsis',
        // },
        /**
         *  Định dạng nhãn
         * @param value giá trị
         * @returns
         */
        formatter: function (value: string) {
          /** Giới hạn chiều dài của label, có thể tùy chỉnh */
          return value.length > 10 ? value.substring(0, 11) + '...' : value
        },
        /** No rotation, titles will be straight */
        rotate: 0,
      },
    },
    /**
     * Cài đặt cho biểu đồ
     */
    plotOptions: {
      /**
       * Cài đặt cho cột
       */
      bar: {
        /**
         * Cài đặt chiều ngang
         */
        horizontal: false,
        /** Giảm chiều rộng cột để cột đơn chiếm nhiều không gian hơn */
        columnWidth: series_props?.length < 4 ? '10%' : '50%',
      },
    },
    /**
     * Cài đặt cho biểu đồ
     */
    dataLabels: {
      /** Hiển thị số trên cột */
      enabled: true,
      style: {
        /** Màu sắc của số, ở đây là màu đen */
        colors: ['#000'],
        /** Kích thước font (tuỳ chọn) */
        fontSize: '12px',
        /** Độ dày của font (tuỳ chọn) */
        fontWeight: 'medium',
      },
    },
    /** Responsive màn Mobile */
    responsive: [
      {
        /**
         * Cài đặt cho Mobile
         */
        breakpoint: 768,
        /**
         * Cài đặt Options cho Mobile
         */
        options: {
          xaxis: {
            labels: {
              /** Xoay nhãn trục X 45 độ trên mobile */
              rotate: -45,
              style: {
                /** Giảm kích thước chữ nếu cần */
                fontSize: '10px',
              },
            },
          },

          chart: {
            /** Chiều cao biểu đồ cho mobile */
            height: 300,
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: true,
            /** Đặt legend xuống phía dưới trên mobile */
            // position: 'bottom',
            /** Giảm kích thước font */
            fontSize: '10px',
          },

          stroke: {
            /** Giảm độ dày đường nét trên mobile */
            width: 1,
          },
        },
      },
    ],
  }
  /**
   * Dữ liệu series
   */
  const SERIES = [
    {
      name: series_name || 'title',
      data: series_props || [30, 40, 45, 50, 49, 60, 70],
    },
  ]

  return (
    <div>
      <Chart
        options={OPTIONS}
        series={SERIES}
        type="bar"
        height={height ?? 250}
      />
    </div>
  )
}

export default ColumnChart

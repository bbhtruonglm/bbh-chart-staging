import { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'
import { t } from 'i18next'
/**
 * Pie chart component
 */
interface PieChartProps {
  /** Label */
  labels?: string[]
  /** Series */
  series?: number[]
  /** List bg */
  bg_color?: string[]
}
const PieChart = ({ labels, series, bg_color }: PieChartProps) => {
  /** Màu sắc cố định cho 18 phần đầu tiên */
  const FIXED_COLORS = [
    '#1D4ED8',
    '#FF5733',
    '#00E396',
    '#CA8A04',
    '#008FFB',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#546E7A',
    '#26A69A',
    '#D10CE8',
    '#FF5733',
    '#1E8449',
    '#900C3F',
    '#581845',
    '#117A65',
    '#C70039',
    '#1F618D',
  ]
  /** Truncate văn bản
   * @param text  string
   * @param max_length number
   * @returns string
   */
  const truncateText = (text: string, max_length: number) => {
    /**
     * Nếu độ dài văn bản lớn hơn max_length thì cắt chuỗi và thêm dấu chấm
     */
    return text.length > max_length
      ? `${text.substring(0, max_length)}...`
      : text
  }

  /** labels đã truncate */
  /** Giới hạn độ dài chuỗi là 10 ký tự */
  const TRUNCATED_LABELS = labels?.map((label) => truncateText(label, 20))

  /** Định nghĩa lại options */
  const OPTIONS: ApexOptions = {
    chart: {
      type: 'pie',
      offsetX: 0,
    },
    labels: TRUNCATED_LABELS || [],
    legend: {
      /** Hiển thị hoặc ẩn phần chú thích */
      show: true,
      /** Vị trí của phần chú thích ('top', 'right', 'bottom', 'left') */
      position: 'right',
      /** Căn chỉnh ngang của phần chú thích ('left', 'center', 'right') */
      horizontalAlign: 'center',
      /** Căn chỉnh dọc của phần chú thích ('top', 'middle', 'bottom') */
      // verticalAlign: 'middle',
      /** Chế độ nổi (floating) của phần chú thích */
      floating: false,
      /** Dịch chuyển phần chú thích theo trục X */
      offsetX: 0,
      /** Dịch chuyển phần chú thích theo trục Y */
      offsetY: 0,
      labels: {
        /** Màu sắc của văn bản trong phần chú thích */
        colors: ['#000'],
        /** Sử dụng màu của series cho phần chú thích */
        // useSeriesColor: true,
      },
      itemMargin: {
        /** Khoảng cách ngang giữa các mục trong phần chú thích */
        horizontal: 2,
        /** Khoảng cách dọc giữa các mục trong phần chú thích */
        vertical: 2,
      },
    },
    colors: bg_color || FIXED_COLORS,
    noData: {
      /** Moved this outside of the `options` property */
      text: t('no_data'),
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            position: 'right',
            horizontalAlign: 'right',
            floating: false,
          },
          plotOptions: {
            pie: {
              /** Thay đổi kích thước của pie chart trên màn hình nhỏ */
              size: '80%',
            },
          },
        },
      },
    ],
  }

  return (
    <Chart
      options={OPTIONS}
      series={series || []}
      type="pie"
      width={380}
      height={220}
    />
  )
}

export default PieChart

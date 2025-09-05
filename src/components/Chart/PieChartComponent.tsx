import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { Dashboard } from '../../assets/icons/Dashboard'
import { LineTag } from './LineTag'
import PieChart from './PieChart2'
import { useState } from 'react'

interface ChartProps {
  /**
   * Dữ liệu tag
   */
  data_tag?: {
    /**
     * Tiêu đề
     */
    title: string
    /**
     * Loại
     */
    type: string
    /**
     * Số lượng
     */
    count: number
  }[]
  /**
   * Dữ liệu biểu đồ
   */
  data_chart?: {
    /**
     * Tên series
     */
    series: {
      /**
       * Tên
       */
      name: string
      /**
       * Dữ liệu
       */
      data: number[]
    }
    /**
     * Dữ liệu trục x
     */
    xaxis: {
      /**
       * Categories
       */
      categories: number[]
    }
  }[]
}

function PieChartComponent({ data_tag, data_chart }: ChartProps) {
  /**
   * Dữ liệu
   */
  const [data, setData] = useState(data_tag)
  /**
   *  Render label
   * @returns  label
   */
  const renderLabel = () => {
    /**
     * Lọc dữ liệu
     */
    const FILTER = data_tag?.filter(item => item.type !== 'chat')
    /**
     * Trả về label
     */
    return FILTER.map(item => item.title)
  }
  /**
   *  Render value
   * @returns  value
   */
  const renderValue = () => {
    /**
     * Lọc dữ liệu
     */
    const FILTER = data_tag?.filter(item => item.type !== 'chat')
    /**
     *  Trả về value
     */
    return FILTER.map(item => Number(item.count))
  }

  return (
    <div>
      <div className="flex bg-white w-full  rounded-lg p-3 gap-x-3">
        <div className="">
          <ChartBarSquareIcon className="size-5" />
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h4 className="text-sm font-semibold ">Tổng quan</h4>

          <div className="flex ">
            <div
              className={`${data?.length === 2 ? 'flex flex-col ' : 'grid grid-cols-2 '} gap-5 pr-2`}
            >
              {data &&
                data.map((item, idx) => (
                  <LineTag
                    key={idx}
                    type={item.type}
                    title={item.title}
                    count={item.count}
                  />
                ))}
            </div>
            <div className="">
              <PieChart
                labels_props={renderLabel()}
                series_props={renderValue()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieChartComponent

import Chart from './Chart'
import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { LineTag } from './LineTag'
import { useState } from 'react'
/**
 *  Dữ liệu cho biểu đồ
 */
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
function ChartComponent({ data_tag, data_chart }: ChartProps) {
  /**
   * Dữ liệu
   */
  const [data, setData] = useState(data_tag)

  return (
    <div>
      <div className="flex bg-white w-full rounded-lg p-3 gap-x-3">
        <div className="">
          <ChartBarSquareIcon className="size-5" />
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <h4 className="text-sm font-semibold ">Tổng quan</h4>
          <div className="flex flex-col ">
            <div className="grid grid-cols-4 justify-between w-full gap-x-5 pr-2">
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
          </div>
          <div className="">
            <Chart
              series_chart={[]}
              categories_chart={[]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartComponent

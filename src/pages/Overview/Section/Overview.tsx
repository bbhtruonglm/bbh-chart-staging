import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import ChartCustom from '@/components/Chart/Chart'
import { LineTag } from '@/components/Chart/LineTag'
import { useTranslation } from 'react-i18next'

/** Định nghĩa dữ liệu cho bieu do */
interface ChartProps {
  /**
   * Dữ liệu tag
   */
  data_tag?: {
    /**
     * Tiêu đề
     */
    title: string | any
    /**
     * Loại
     */
    type: string | any
    /**
     * Số lượng
     */
    count: number | any
  }[]
  /**
   * Dữ liệu series
   */
  series_data: any
  /**
   * Dữ liệu categories
   */
  categories_data: any
}

/** Nhận dữ liệu  để hiển thị thông tin LineTag và Chart*/
function Overview({ data_tag, series_data, categories_data }: ChartProps) {
  /** Import i18n */
  const { t } = useTranslation()

  return (
    <div>
      <div className="flex bg-white w-full rounded-lg p-3 gap-x-3">
        {/* Hiển thị icon PC */}
        <div className="hidden md:block">
          <ChartBarSquareIcon className="size-5" />
        </div>
        <div className="flex w-full flex-col gap-y-2 ">
          <div className="flex gap-x-2.5 items-center">
            {/* Hiện thị icon Mobile */}
            <div className="block md:hidden">
              <ChartBarSquareIcon className="size-5" />
            </div>
            <h4 className="text-sm font-semibold ">{t('overview')}</h4>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-5 md:gap-x-3 w-full xl:w-full xl:grid-cols-4 justify-between xl:gap-y-0 xl:gap-x-5">
              {data_tag &&
                data_tag.map((item, idx) => (
                  <LineTag
                    key={idx}
                    type={item.type}
                    title={item.title}
                    count={item.count}
                  />
                ))}
            </div>
            <div className="w-full">
              {categories_data?.length ? (
                <ChartCustom
                  series_chart={series_data}
                  categories_chart={categories_data}
                />
              ) : (
                <div className="flex p-6 justify-center items-center">
                  <p>{t('no_data')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview

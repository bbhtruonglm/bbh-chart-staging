import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { Dashboard } from '@/assets/icons/Dashboard'
import { LineTag } from '@/components/Chart/LineTag'
import PieChart from '@/components/Chart/PieChart'
import { useTranslation } from 'react-i18next'

/**
 * Interface ChartProps
 */
interface ChartProps {
  /** Data tag */
  data_tag?: {
    /**
     * Title
     */
    title: string
    /**
     * Type
     */
    type: string
    /**
     * Count
     */
    count: number | string
  }[]
  /** List series */
  series: number[]
  /** List labels */
  labels: string[]
}
function Overview({ data_tag, series, labels }: ChartProps) {
  /** Import i18n */
  const { t } = useTranslation()
  return (
    <div>
      <div className="flex bg-white w-full rounded-lg p-3 gap-x-3">
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

          <div className="flex flex-col custom-xlg:flex-row gap-3 ">
            <div
              className={`grid grid-cols-2 md:flex md:flex-col gap-5 pr-2 w-full lg:w-1/2`}
            >
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
            <div className="w-full flex justify-center md:justify-start">
              {series?.length ? (
                <PieChart
                  labels={labels}
                  series={series}
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-sm">{t('no_data')}</p>
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

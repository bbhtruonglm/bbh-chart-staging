import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { LineTag } from '@/components/Chart/LineTag'
import PieChart from '@/components/Chart/PieChart'
import { useOverviewData } from './useOverviewData'
import { useTranslation } from 'react-i18next'

interface EmotionData {
  /**
   * Nhãn cảm xúc
   */
  emotion: string
  /**
   * Số lượng
   */
  value: number
  /**
   * Loại cảm xúc
   */
  type: string
}
function Overview({ handleDetail, setBody }) {
  /** I18n */
  const { t } = useTranslation()
  /** Lấy dữ liệu từ hook */
  const { data_tag, chart_data, FILTER_TIME } = useOverviewData()

  /**
   * Dữ liệu biểu đồ
   */
  const LABELS = chart_data.map(item => item.emotion)
  /**
   * Dữ liệu biểu đồ
   */
  const SERIES = chart_data.map(item => item.value)

  return (
    <div className="flex w-full h-full rounded-lg p-3 gap-x-3 bg-white">
      <div className="hidden md:block">
        <ChartBarSquareIcon className="size-5" />
      </div>
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex gap-x-2.5 items-center">
          {/* Hiện thị icon Mobile */}
          <div className="block md:hidden">
            <ChartBarSquareIcon className="size-5" />
          </div>
          <h4 className="text-sm font-semibold ">{t('overview')}</h4>
        </div>

        <div className="flex flex-col justify-between gap-y-2 lg:flex-row">
          <div
            className={`grid grid-cols-2 xl:grid xl:grid-cols-2 lg:flex lg:flex-col w-full lg:w-1/2 gap-4 `}
          >
            {data_tag &&
              data_tag.map((item, idx) => (
                <LineTag
                  key={idx}
                  type={item.type}
                  title={item.title}
                  count={item.count}
                  detail={item.type === 'chat' ? false : true}
                  handleDetail={() => {
                    handleDetail('LINE_TAG')
                    let temp_filter =
                      item.type === 'smile'
                        ? 'client_positive'
                        : item.type === 'frown'
                          ? 'client_negative'
                          : 'client_neutral'
                    setBody({
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      event: [temp_filter],
                    })
                  }}
                />
              ))}
          </div>
          <div className="w-full lg:w-1/2 justify-center flex md:justify-start">
            <PieChart
              labels={LABELS}
              series={SERIES}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview

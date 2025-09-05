import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { LineTag } from '@/components/Chart/LineTag'
import { useStaffScreen } from '../useStaffScreen'
import { useTranslation } from 'react-i18next'

function Overview({ handleDetail, setBody }) {
  /** I18n */
  const { t } = useTranslation()
  /** Lấy dữ liệu từ hook */
  const { data_tag, FILTER_TIME } = useStaffScreen()

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
          <div className={`grid grid-cols md:grid-cols-2 w-full gap-4 `}>
            {data_tag &&
              data_tag.map((item, idx) => (
                <LineTag
                  key={idx}
                  type={item.type}
                  title={item.title}
                  count={item.count}
                  detail={item.type === 'chat' ? false : true}
                  handleDetail={() => {
                    handleDetail('STAFF_LINE_TAG')

                    setBody({
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      event: [item.type],
                    })
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview

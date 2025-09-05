import ColumnChart from '@/components/Chart/ColumnChart'
import SelectOption from '../SelectOption'
import { TableBase } from '@/components/Table/TableFiles/TableBase'
import { TableCellsIcon } from '@heroicons/react/24/solid'
import { useEmotionalAnalysisStaff } from './useEmotionalAnalysisStaff'
import { useTranslation } from 'react-i18next'

export const EmotionalAnalysisStaff = ({ handleDetail, setBody }) => {
  /** i18n */
  const { t } = useTranslation()
  /** Lấy dữ liệu từ useEmotionalAnalysis */
  const {
    detail_selected,
    detail_selected_base,
    TABLE_DETAIL_DATA,
    COLUMN_DETAIL_EMOTION,
    SERIES_DATA_DETAIL,
    LABELS_DETAIL_RENDER_NAME,
    OPTIONS,
    renderEmotion,
    renderKeyEmotion,
    setDetailSelected,
    setDetailSelectedBase,
    PAGE_ID,
    FILTER_TIME,
    PERIOD,
  } = useEmotionalAnalysisStaff({
    handleDetail,
    setBody,
  })
  return (
    <div className="flex w-full rounded-lg p-3 gap-x-3 h-full bg-white">
      <div className="flex-shrink-0 hidden md:block">
        <TableCellsIcon className="size-5" />
      </div>
      <div className="flex w-full flex-grow min-w-0 flex-col h-full gap-y-2">
        <div className="flex gap-x-2.5 items-center">
          {/* Hiện thị icon Mobile */}
          <div className="block md:hidden">
            <TableCellsIcon className="size-5" />
          </div>

          <h4 className="text-sm font-semibold">
            {t('customer_emotion_about_staff')}
          </h4>
        </div>
        <div className="flex w-full flex-col lg:flex-row flex-grow min-w-0 min-h-0">
          <div className={`flex flex-col w-full lg:w-2/3 mt-2 md:mt-0`}>
            <div className="flex-shrink-0 w-72">
              <SelectOption
                options={OPTIONS.map(item => renderEmotion(item))}
                default_value={detail_selected_base}
                onChange={e => {
                  setDetailSelected(renderKeyEmotion(e))
                  setDetailSelectedBase(e)
                }}
                key_choice={t('customer_emotion')}
                placeholder={t('select_customer_emotion')}
              />
            </div>
            {!TABLE_DETAIL_DATA.length ? (
              <div className="flex w-full justify-center items-center h-28">
                {t('no_data')}
              </div>
            ) : (
              <ColumnChart
                series_props={SERIES_DATA_DETAIL}
                category_props={LABELS_DETAIL_RENDER_NAME}
              />
            )}
          </div>
          <div className="flex w-full lg:w-1/3">
            <div className={`flex-col min-w-0 h-48 lg:h-full flex-grow`}>
              {!TABLE_DETAIL_DATA.length ? (
                <div className="flex w-full justify-center items-center">
                  {/* Không có dữ liệu */}
                </div>
              ) : (
                <TableBase
                  data={TABLE_DETAIL_DATA}
                  columns={COLUMN_DETAIL_EMOTION}
                  show_icon={true}
                  onIconClick={() => {
                    handleDetail(detail_selected_base)
                    setBody({
                      PAGE_ID,
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      period: PERIOD,
                      row: 'staff_id',
                      col: 'event',
                      event: [`${detail_selected}`],
                    })
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

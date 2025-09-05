import {
  ArrowTopRightOnSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid'
import { formatWithCommas, renderEmotion } from '@/utils'
import { selectFilterTime, selectPageId } from '@/stores/appSlice'

import ChartCustom from '@/components/Chart/Chart'
import ColumnChart from '@/components/Chart/ColumnChart'
import { TableBase } from '@/components/Table/TableFiles/TableBase'
import { useEmotionalAnalysis } from './useEmotionalAnalysis'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export const EmotionalAnalysis = ({ handleDetail, setBody }) => {
  /** Sử dụng hook dịch ngôn ngữ */
  const { t } = useTranslation()
  /** Lọc thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lấy dữ liệu từ hook */
  const {
    TABLE_DATA,
    CATEGORIES_BAR,
    VALUES_BAR,
    SERIES,
    LABELS,
    setStrokeColor,
    stroke_color,
  } = useEmotionalAnalysis()

  /** Define columns using COLUMN_HELPER */
  const COLUMN_HELPER = {
    accessor: (accessorKey, config) => ({
      accessorKey,
      ...config,
    }),
  }

  /** Tạo columns cho bảng */
  const COLUMNS = [
    COLUMN_HELPER.accessor('name', {
      header: () => t('emotion_name'),
      cell: info => (
        <button
          className="flex justify-between w-full items-center cursor-pointer hover:text-blue-700"
          onMouseEnter={() => setStrokeColor(info.getValue())}
          onMouseLeave={() => setStrokeColor('')}
          onClick={() => {
            handleDetail(info.getValue())
            setStrokeColor('')
            setBody({
              PAGE_ID,
              start_date: FILTER_TIME.start_time,
              end_date: FILTER_TIME.end_time,
              event: [`${info.getValue()}`],
            })
          }}
        >
          {renderEmotion(info.getValue())}
          <div>
            <ArrowTopRightOnSquareIcon className="size-4 font-medium" />
          </div>
        </button>
      ),
      size: 150,
    }),
    COLUMN_HELPER.accessor('total_value', {
      header: () => t('total_value'),
      cell: info => formatWithCommas(info.getValue()),
      size: 80,
    }),
    COLUMN_HELPER.accessor('percentage', {
      header: () => t('percentage'),
      cell: info => info.getValue(),

      size: 70,
    }),
  ]

  return (
    <div className="flex h-full w-full rounded-lg p-3 gap-x-3 bg-white">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <TableCellsIcon className="size-5" />
      </div>
      <div className="flex w-full flex-col h-full gap-y-2 lg:flex-grow lg:min-w-0">
        <div className="flex gap-x-3">
          <div className="lg:hidden flex">
            <TableCellsIcon className="size-5" />
          </div>
          <h4 className="text-sm font-semibold">{t('emotion_analysis')}</h4>
        </div>
        <div className="flex flex-col lg:flex-row justify-between w-full ">
          <div className={`flex flex-col lg:w-3/5`}>
            <div className={`flex-col min-h-0 min-w-0 flex-grow`}>
              <ChartCustom
                series_chart={SERIES}
                categories_chart={LABELS}
              />
            </div>
            <div className={`flex-col min-h-0 min-w-0 flex-grow`}>
              <ColumnChart
                category_props={CATEGORIES_BAR}
                series_props={VALUES_BAR}
              />
            </div>
          </div>
          <div className="flex lg:w-1/3 ">
            <div className={`flex-col min-w-0 flex-grow`}>
              <TableBase
                data={TABLE_DATA}
                columns={COLUMNS}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

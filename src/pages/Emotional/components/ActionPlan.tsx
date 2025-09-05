import {
  ArrowTopRightOnSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import ColumnChart from '../../../components/Chart/ColumnChart'
import PieChart from '../../../components/Chart/PieChart'
import Share from '@/assets/icons/Share'
import { TableBase } from '../../../components/Table/TableFiles/TableBase'
import { TableIcon } from '../../../assets/icons/TableIcon'
import { fetchFunction } from '@/api/fetchApi'
import { keys } from 'lodash'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { renderSuggest } from '@/utils'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

function ActionPlan({ handleDetail, setBody }) {
  /**
   * Import i18n
   */
  const { t } = useTranslation()
  /** id của tổ chức */
  const ORG_ID = useSelector(selectOrgId)

  /** danh sách id các trang */
  const PAGE_ID = useSelector(selectPageId)

  /** thời gian lọc */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Sử dụng AppDispatch để đảm bảo đúng kiểu dispatch */
  const dispatch: AppDispatch = useDispatch()

  /**  Hàm để trigger thông báo với debounce
   * @param value thông báo
   */
  const handleNotify = (value: string) => {
    /**
     * Gọi hàm thông báo với debounce
     */
    dispatch(notifyWithDebounce(value, 'error'))
  }

  /** Reload state */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)

  /** Khởi tạo data piechart */
  const [pie_chart_data, setPieChartData] = useState({})
  /**
   * Khởi tạo data barchart
   */
  const [bar_chart_data, setBarChartData] = useState({})

  /** Icon color */
  const [stroke_color, setStrokeColor] = useState('')
  /**
   * Lấy dữ liệu từ api
   */
  useEffect(() => {
    /**
     * Nếu không có tổ chức hoặc trang thì không gọi api
     */
    if (!ORG_ID || !PAGE_ID?.length) {
      /**
       * Set data về rỗng
       */
      setBarChartData({})
      /**
       * Set data về rỗng
       */
      setPieChartData({})
      /**
       * Return
       */
      return
    }

    /**
     * Gọi hàm fetchData
     */
    fetchData()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /** khi mà id tổ chức và thời gian lọc thay đổi thì call api
   * Nếu có trigger thì gọi ở đây tránh ảnh hưởng đến useEffect trên
   */
  useEffect(() => {
    if (TRIGGER_RELOAD) {
      /**
       * Nếu không có tổ chức hoặc trang thì không gọi api
       */
      if (!ORG_ID || !PAGE_ID?.length) {
        /**
         * Set data về rỗng
         */
        setBarChartData({})
        /**
         * Set data về rỗng
         */
        setPieChartData({})
        /**
         * Return
         */
        return
      }

      /**
       * Gọi hàm fetchData
       */
      fetchData()
    }
  }, [ORG_ID, PAGE_ID, FILTER_TIME, TRIGGER_RELOAD])
  /** Call api */
  const fetchData = async () => {
    /**
     * Gọi dữ liệu đề xuất hành động
     */
    const DATA = await fetchDataSuggest()
    /**
     * Gọi dữ liệu phân loại hành động
     */
    const DATA_SUGGEST = await fetchDataSuggestType()
    /**
     *  Set dữ liệu vào state
     */
    setBarChartData(DATA)
    /**
     *  Set dữ liệu vào state
     */
    setPieChartData(DATA_SUGGEST)
  }
  /** Gọi dữ liệu Phân loại hành động */
  const fetchDataSuggestType = async () => {
    /**
     * Body của request
     */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      type: ['custom_action_required'],
    }

    /** Gọi sang component try catch chung */
    const RESULT = await fetchFunction(
      dispatch,
      'countEvent',
      BODY,
      'app/analytic/count_event',
      handleNotify,
    )
    /**
     * Trả về dữ liệu
     */
    return RESULT
  }

  /** Gọi dữ liệu đề xuất hành động */
  const fetchDataSuggest = async () => {
    /**
     * Body của request
     */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      type: ['custom_suggestion'],
    }

    /** Gọi sang component try catch chung */
    const RESULT = await fetchFunction(
      dispatch,
      'countEvent',
      BODY,
      'app/analytic/count_event',
      handleNotify,
    )
    /**
     * Trả về dữ liệu
     */
    return RESULT
  }

  /** Tính tổng số lượng phân loại hành động */
  const TOTAL_COUNT = keys(pie_chart_data)?.reduce(
    (sum, key) => sum + pie_chart_data[key].total_value,
    0,
  )

  /** Chuyển đổi dữ liệu thành mảng để sử dụng trong bảng Phân loại hành động */
  const TABLE_DATA_TYPE = keys(pie_chart_data).map(key => ({
    action: pie_chart_data[key].event.includes('true')
      ? t('need_action')
      : t('don_t_need_action'),
    count: pie_chart_data[key].total_value,
    percentage:
      ((pie_chart_data[key].total_value / TOTAL_COUNT) * 100).toFixed(1) + '%',
  }))

  /** Define columns using COLUMN_HELPER */
  const COLUMN_HELPER = {
    accessor: (accessorKey, config) => ({
      accessorKey,
      ...config,
    }),
  }
  /** Định nghĩa cột */
  const COLUMNS_TYPE = [
    COLUMN_HELPER.accessor('action', {
      header: t('action_type'),
      cell: info => (
        <button
          className="cursor-pointer w-full"
          onClick={() => {
            let temp_filter =
              info.getValue() === t('need_action')
                ? 'action_required_true'
                : 'action_required_false'
            handleDetail('type_action')
            setStrokeColor('')
            setBody({
              start_date: FILTER_TIME.start_time,
              end_date: FILTER_TIME.end_time,
              type: ['custom_action_required'],
              event: [temp_filter],
            })
          }}
          onMouseEnter={e => {
            setStrokeColor(info.row.id)
          }}
          /** thoát hover */
          onMouseLeave={() => {
            setStrokeColor('')
          }}
        >
          <div className="flex flex-row items-center justify-between">
            <p
              className={` truncate ${info.row.id === stroke_color ? 'text-blue-700' : 'text-black'}`}
            >
              {info.getValue()}
            </p>
            <div>
              <ArrowTopRightOnSquareIcon className="size-4 font-medium" />
            </div>
          </div>
        </button>
      ),
      size: 150,
    }),
    COLUMN_HELPER.accessor('count', {
      header: () => t('total_value'),
      cell: info => info.getValue(),
      size: 80,
    }),
    COLUMN_HELPER.accessor('percentage', {
      header: () => t('percentage'),
      cell: info => info.getValue(),
      size: 70,
    }),
  ]
  /** Tính tổng số lượng */
  const TOTAL_COUNT_BAR = keys(bar_chart_data)?.reduce(
    (sum, key) => sum + bar_chart_data[key].total_value,
    0,
  )

  /** Chuyển đổi dữ liệu thành mảng để sử dụng trong bảng */
  const TABLE_DATA_SUGGEST_BAR = keys(bar_chart_data)?.map(key => ({
    /** Hiển thị tên tiếng việt theo key */
    action: renderSuggest(bar_chart_data[key].event),
    count: bar_chart_data[key].total_value,
    percentage:
      ((bar_chart_data[key].total_value / TOTAL_COUNT_BAR) * 100).toFixed(1) +
      '%',
  }))

  /** Định nghĩa cột */
  const COLUMNS_SUGGEST_BAR = [
    COLUMN_HELPER.accessor('action', {
      header: t('action'),
      cell: info => info.getValue(),
      size: 150,
    }),
    COLUMN_HELPER.accessor('count', {
      header: () => t('total_value'),
      cell: info => info.getValue(),
      size: 80,
    }),
    COLUMN_HELPER.accessor('percentage', {
      header: () => t('percentage'),
      cell: info => info.getValue(),
      size: 70,
    }),
  ]

  /** Tạo data cho pie chart */
  const LABELS = keys(pie_chart_data)?.map(key => {
    /**
     * Hiển thị tên tiếng việt theo key
     */
    const LABEL = pie_chart_data[key].event.includes('true')
      ? t('need_action')
      : t('don_t_need_action')
    /**
     * Trả về label
     */
    return LABEL
  })
  /** Tạo series cho pie chart */
  const SERIES = keys(pie_chart_data)?.map(
    key => pie_chart_data[key].total_value,
  )

  /** Labels hiển thị tên cột */
  const LABELS_BAR = keys(bar_chart_data)?.map(key =>
    /** render tên tiếng việt theo key */
    renderSuggest(bar_chart_data[key].event),
  )
  /**
   * Series hiển thị giá trị cột
   */
  const SERIES_BAR = keys(bar_chart_data)?.map(
    key => bar_chart_data[key].total_value,
  )

  return (
    <div className="flex w-full rounded-lg p-3 gap-x-3 h-full bg-white">
      <div className="flex-shrink-0 hidden md:block">
        <TableCellsIcon className="size-5" />
      </div>
      <div className="flex w-full flex-grow min-w-0 flex-col h-full gap-y-4">
        <div className="flex gap-x-2.5 items-center">
          {/* Hiện thị icon Mobile */}
          <div className="block md:hidden">
            <TableCellsIcon className="size-5" />
          </div>

          <h4 className="text-sm font-semibold">{t('action_plan')}</h4>
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-y-3">
          <div className={`flex lg:w-2/3 justify-center md:justify-start`}>
            <PieChart
              labels={LABELS}
              series={SERIES}
              bg_color={['#1D4ED8', '#FF5733']}
            />
          </div>
          <div className="flex w-full lg:w-1/3 ">
            <div className={`flex-col min-h-0 min-w-0 flex-grow`}>
              {!TABLE_DATA_TYPE?.length ? (
                <div></div>
              ) : (
                <TableBase
                  data={TABLE_DATA_TYPE}
                  columns={COLUMNS_TYPE}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full flex-grow min-h-0">
          <div className={`flex flex-col w-full lg:w-2/3`}>
            <ColumnChart
              series_props={SERIES_BAR}
              category_props={LABELS_BAR}
            />
          </div>
          <div className="flex flex-shrink-0 w-full lg:w-1/3 flex-grow h-56 lg:h-full">
            <div className={`flex-col min-h-0 min-w-0 flex-grow`}>
              {!TABLE_DATA_SUGGEST_BAR?.length ? (
                <div></div>
              ) : (
                <TableBase
                  data={TABLE_DATA_SUGGEST_BAR}
                  columns={COLUMNS_SUGGEST_BAR}
                  show_icon={true}
                  onIconClick={() => {
                    handleDetail('all_action')
                    setBody({
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      type: ['custom_suggestion'],
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
export default ActionPlan

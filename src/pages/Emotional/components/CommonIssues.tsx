import { fetchFunction, toTable } from '@/api/fetchApi'
import { keys, map, values } from 'lodash'
import { renderAction, renderKeyAction } from '@/utils'
import {
  selectFilterTime,
  selectOrgId,
  selectPageId,
  selectStaffList,
} from '@/stores/appSlice'
import { startLoading, stopLoading } from '@/stores/loadingSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { AppDispatch } from '@/stores'
import ColumnChart from '@/components/Chart/ColumnChart'
import SelectOption from './SelectOption'
import { TableBase } from '@/components/Table/TableFiles/TableBase'
import { TableCellsIcon } from '@heroicons/react/24/solid'
import { TableIcon } from '@/assets/icons/TableIcon'
import { getPeriod } from '@/services/api_helper'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

/** Định nghĩa kiểu dữ liệu */
interface EventData {
  /**
   * Tên sự kiện
   */
  event_count: string
  /**
   * Tổng giá trị
   */
  total_value: number
}
/** Định nghĩa kiểu dữ liệu cho detail rawdata */
interface DataStructure {
  /**
   * Tên nhân viên
   * @param key key của nhân viên
   * @param event_name tên sự kiện
   */
  [key: string]: {
    [eventName: string]: EventData
  }
}
/**
 * Component CommonIssues
 */
interface EventData2 {
  /**
   * Tên vấn đề
   */
  event: string
  /**
   * Số lượng vấn đề
   */
  event_count: number
  /**
   * Tổng giá trị
   */
  total_value: number
}
export const CommonIssues = ({ handleDetail, setBody }) => {
  /** Import i18n */
  const { t } = useTranslation()
  /** id của tổ chức */
  const ORG_ID = useSelector(selectOrgId)

  /** danh sách id các trang */
  const PAGE_ID = useSelector(selectPageId)

  /** thời gian lọc */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** tính toán period */
  const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
  /**
   * period
   */
  const PERIOD = getPeriod(DISTANCE_TIME)

  /** danh sách dữ liệu nhân viên */
  const STAFF_LIST = useSelector(selectStaffList)

  /** Reload state */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)

  /** Sử dụng AppDispatch để đảm bảo đúng kiểu dispatch */
  const dispatch: AppDispatch = useDispatch()

  /** Hàm để trigger thông báo với debounce
   * @param value giá trị thông báo
   */
  const handleNotify = (value: string) => {
    /**
     * Gọi hàm thông báo với debounce
     */
    dispatch(notifyWithDebounce(value, 'error'))
  }
  /** lấy tên của nhân viên
   * @param id id của nhân viên
   */
  function getName(id: string): string {
    /**
     * Nếu có trong danh sách nhân viên thì trả về tên nhân viên
     */
    if (STAFF_LIST[id]) return STAFF_LIST[id]?.name || id
    /**
     * Nếu không có thì trả về id
     */
    return id
  }

  /** Khởi tạo data piechart */
  const [common_issue_data, setCommonIssueData] = useState<EventData2 | null>(
    null,
  )
  /**
   * State lưu trữ dữ liệu chi tiết vấn đề
   */
  const [detail_data_issues, setDetailDataIssues] = useState<DataStructure>({})
  /**
   * State lưu trữ vấn đề được chọn
   */
  const [detail_selected, setDetailSelected] = useState<string>('')
  /**
   * Effect lấy dữ liệu khi thay đổi tổ chức, trang, thời gian lọc
   */
  useEffect(() => {
    /**
     * Nếu không có tổ chức hoặc trang hoặc thời gian lọc thì return
     */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /**
       * Set dữ liệu vấn đề chung về null
       */
      setCommonIssueData(null)
      /**
       * Set dữ liệu chi tiết về rỗng
       */
      setDetailDataIssues({})
      /**
       * Set vấn đề được chọn về rỗng
       */
      return
    }

    /**
     * Gọi hàm lấy dữ liệu
     */
    fetchData()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /** khi mà id tổ chức và thời gian lọc thay đổi thì call api
   * Nếu có trigger thì gọi ở đây tránh ảnh hưởng đến useEffect trên
   */
  useEffect(() => {
    if (TRIGGER_RELOAD) {
      /**
       * Nếu không có tổ chức hoặc trang hoặc thời gian lọc thì return
       */
      if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
        /**
         * Set dữ liệu vấn đề chung về null
         */
        setCommonIssueData(null)
        /**
         * Set dữ liệu chi tiết về rỗng
         */
        setDetailDataIssues({})
        /**
         * Set vấn đề được chọn về rỗng
         */
        return
      }

      /**
       * Gọi hàm lấy dữ liệu
       */
      fetchData()
    }
  }, [ORG_ID, PAGE_ID, FILTER_TIME, TRIGGER_RELOAD])
  /** Call api*/
  const fetchData = async () => {
    /** Danh sách các vấn đề */
    const DATA_COMMON_ISSUES = await fetchDataCommonIssues()
    /**
     * Set dữ liệu vấn đề chung
     */
    setCommonIssueData(DATA_COMMON_ISSUES)
  }
  /**
   * Gọi dữ liệu Các vấn đề phổ biến
   */
  useEffect(() => {
    /**
     * Nếu không có tổ chức hoặc trang hoặc thời gian lọc thì return
     */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /**
       * Set dữ liệu vấn đề chung về null
       */
      return
    }

    /**
     * Gọi hàm lấy dữ liệu
     */
    fetchData_2()
  }, [ORG_ID, PAGE_ID, detail_selected, FILTER_TIME])
  /**
   * Gọi dữ liệu Các vấn đề phổ biến
   */
  useEffect(() => {
    if (TRIGGER_RELOAD) {
      /**
       * Nếu không có tổ chức hoặc trang hoặc thời gian lọc thì return
       */
      if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
        /**
         * Set dữ liệu vấn đề chung về null
         */
        return
      }

      /**
       * Gọi hàm lấy dữ liệu
       */
      fetchData_2()
    }
  }, [ORG_ID, PAGE_ID, detail_selected, FILTER_TIME, TRIGGER_RELOAD])
  /**
   * Call api fetchData_2 với các tham số data
   */
  const fetchData_2 = async () => {
    /** chi tiết 1 vấn đề */
    if (detail_selected) {
      /** Lấy dữ liệu chi tiết vấn đề */
      const DETAIL_DATA = await fetchDetailIssues()
      /**
       * Set dữ liệu chi tiết vấn đề
       */
      setDetailDataIssues(DETAIL_DATA)
    }
  }
  /** Gọi dữ liệu Các vấn đề phổ biến */
  const fetchDataCommonIssues = async () => {
    /**
     * Body gọi api
     */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      type: ['custom_issues'],
    }

    /** Gọi sang component try catch chung */
    const RESULT = await fetchFunction(
      dispatch,
      'countEvent',
      BODY,
      'app/analytic/count_event',
      handleNotify,
    )
    /*
     * Nếu không có dữ liệu thì return
     */
    return RESULT
  }

  /** Gọi dữ liệu chi tiết vấn đề */
  const fetchDetailIssues = async () => {
    /** tính toán period */
    const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
    /**
     * period
     */
    const PERIOD = getPeriod(DISTANCE_TIME)
    /**
     * Body gọi api
     */
    const BODY = {
      PAGE_ID,
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      row: 'staff_id',
      col: 'event',
      event: [`${renderKeyAction(detail_selected)}`],
      type: ['custom_issues'],
    }

    try {
      /** Bắt đầu loading */
      dispatch(startLoading())
      /** Call api */
      const RESULT = await toTable({
        end_point: 'app/analytic/to_table',
        body: BODY,
      })
      /**
       * Dữ liệu trả về
       */
      const DATA = RESULT.data
      /**
       *  Trả về dữ liệu
       */
      return DATA
    } catch (error) {
      console.log('Fetch error:', error)
    } finally {
      console.log('Fetch completed')
      /** Dùng trạng thái loading khi api hoàn thành */
      dispatch(stopLoading())
    }
  }

  /** Tính tổng số lượng */
  const TOTAL_COUNT = keys(common_issue_data)?.reduce(
    (sum, key) => sum + common_issue_data[key].total_value,
    0,
  )
  /**
   * Chuyển đổi dữ liệu thành mảng để sử dụng trong bảng
   * @param value giá trị dữ liệu
   * @param key key của dữ liệu
   */
  const TABLE_DATA = map(common_issue_data, (value: any, key) => ({
    /** Hiển thị tên của vấn đề theo key trong bảng chung */
    action: renderAction(key),
    count: parseInt(value.event_count),
    percentage:
      ((parseInt(value.event_count) / TOTAL_COUNT) * 100).toFixed(2) + '%',
  }))

  /** Define columns using COLUMN_HELPER */
  const COLUMN_HELPER = {
    accessor: (accessorKey, config) => ({
      accessorKey,
      ...config,
    }),
  }

  /**Định nghĩa cột */
  const COLUMNS_COMMON_ISSUES = [
    COLUMN_HELPER.accessor('action', {
      header: t('common_issues'),
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

  /** Tính tổng số lượng để sử dụng cho tỷ lệ phần trăm */
  const TOTAL_COUNT_DETAIL = values(detail_data_issues)?.reduce(
    (sum, event_obj) => {
      return (
        sum +
        values(event_obj).reduce(
          (event_sum, event) => event_sum + event.total_value,
          0,
        )
      )
    },
    0,
  )

  /** Chuyển đổi dữ liệu thành mảng để sử dụng trong bảng */
  const TABLE_DETAIL_DATA = keys(detail_data_issues)?.map(key => {
    /**
     * Tính tổng số lượng cho từng key
     */
    const TOTAL_FOR_KEY = values(detail_data_issues[key])?.reduce(
      (sum, event) => sum + event.total_value,
      0,
    )
    /*
     * Trả về dữ liệu
     */
    return {
      key: getName(key),
      count: TOTAL_FOR_KEY,
      percentage:
        ((Number(TOTAL_FOR_KEY) / Number(TOTAL_COUNT_DETAIL)) * 100).toFixed(
          2,
        ) + '%',
    }
  })

  /** Định nghĩa cột */
  const COLUMNS_DETAIL_ISSUES = useMemo(
    () => [
      COLUMN_HELPER.accessor('key', {
        header: `${t(detail_selected) || t('issue')}`,
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
    ],
    [detail_selected],
  )

  /** Labels hiển thị tên cột */
  const LABELS = keys(common_issue_data)?.map(key =>
    /** hiển thị tên cột trong biểu đồ */
    renderAction(common_issue_data[key].event),
  )

  /** series // Data cho cột */
  const SERIES = keys(common_issue_data)?.map(
    key => common_issue_data[key].total_value,
  )
  /**
   * Effect chọn vấn đề đầu tiên khi không có vấn đề nào được chọn
   */
  useEffect(() => {
    /**
     * Nếu không có vấn đề nào được chọn thì chọn vấn đề đầu tiên
     */
    if (!detail_selected) {
      /**
       * Chọn vấn đề đầu tiên
       */
      setDetailSelected(renderKeyAction(LABELS[0]))
    }
  }, [LABELS])

  /** Chuyển đổi dữ liệu để tạo nhãn (labels) và giá trị (series) */
  const LABELS_DETAIL = keys(detail_data_issues)
  /**
   * Series data chi tiết
   */
  const LABELS_DETAIL_RENDER_NAME = LABELS_DETAIL.map(key => {
    /**
     * Trả về tên nhân viên
     */
    return getName(key)
  })
  /**
   * Series data chi tiết
   */
  const SERIES_DATA_DETAIL = LABELS_DETAIL.map(key => {
    /**
     * Trả về tổng số lượng của từng vấn đề
     */
    return values(detail_data_issues[key])?.reduce(
      (sum, event) => sum + event.total_value,
      0,
    )
  })

  return (
    <div className="flex  w-full rounded-lg p-3 gap-x-3 h-full bg-white">
      <div className="flex-shrink-0 hidden md:block">
        <TableCellsIcon className="size-5" />
      </div>
      <div className="flex w-full flex-grow min-w-0 flex-col h-full gap-y-2">
        <div className="flex gap-x-2.5 items-center">
          {/* Hiện thị icon Mobile */}
          <div className="block md:hidden">
            <TableCellsIcon className="size-5" />
          </div>

          <h4 className="text-sm font-semibold">{t('common_issues')}</h4>
        </div>
        <div className="flex flex-col lg:flex-row w-full lg:h-[40%] ">
          <div className={`flex flex-col w-full lg:w-2/3`}>
            <div className={`flex-col min-h-0 flex-grow`}>
              <ColumnChart
                series_props={SERIES}
                category_props={LABELS}
                height={210}
              />
            </div>
          </div>
          <div className="flex w-full lg:w-1/3 ">
            <div
              className={`flex-col min-h-0 min-w-0 h-64 lg:h-full flex-grow`}
            >
              {!TABLE_DATA.length ? (
                <div className="flex w-full h-64 justify-center items-center">
                  {/* Không có dữ liệu */}
                </div>
              ) : (
                <TableBase
                  data={TABLE_DATA}
                  columns={COLUMNS_COMMON_ISSUES}
                  show_icon={true}
                  onIconClick={() => {
                    handleDetail('all_issues')
                    setBody({
                      PAGE_ID,
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      type: ['custom_issues'],
                    })
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-64">
          <SelectOption
            options={LABELS}
            /** render hành động theo key */
            default_value={renderAction(detail_selected)}
            onChange={e => {
              setDetailSelected(e)
            }}
            key_choice={t('issue')}
            placeholder={t('select_issue')}
          />
        </div>
        <div className="flex flex-col lg:flex-row w-full lg:h-[40%]">
          <div className={`flex flex-col w-full lg:w-2/3`}>
            <div className={`flex-col min-h-0 flex-grow`}>
              <ColumnChart
                series_props={SERIES_DATA_DETAIL}
                category_props={LABELS_DETAIL_RENDER_NAME}
              />
            </div>
          </div>
          <div className="flex w-full lg:w-1/3">
            <div
              className={`flex-col min-h-0 min-w-0 h-64 lg:h-full flex-grow`}
            >
              {!TABLE_DETAIL_DATA.length ? (
                <div className="flex w-full justify-center items-center">
                  {/* Không có dữ liệu */}
                </div>
              ) : (
                <TableBase
                  data={TABLE_DETAIL_DATA}
                  columns={COLUMNS_DETAIL_ISSUES}
                  show_icon={true}
                  onIconClick={() => {
                    handleDetail(detail_selected)
                    setBody({
                      PAGE_ID,
                      start_date: FILTER_TIME.start_time,
                      end_date: FILTER_TIME.end_time,
                      period: PERIOD,
                      row: 'staff_id',
                      col: 'event',
                      event: [`${renderKeyAction(detail_selected)}`],
                      type: ['custom_issues'],
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

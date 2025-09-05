// useEmotionalAnalysisStaff.ts

import { formatWithCommas, renderEmotion, renderKeyEmotion } from '@/utils'
import { keys, values } from 'lodash'
import {
  selectFilterTime,
  selectOrgId,
  selectPageId,
  selectStaffList,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { getPeriod } from '@/services/api_helper'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

/** Định nghĩa kiểu dữ liệu */
interface EventData {
  /**
   * Số lượng sự kiện
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
   * Dữ liệu chi tiết
   * @param key: string
   * @param event_name: string
   */
  [key: string]: {
    [eventName: string]: EventData
  }
}

export const useEmotionalAnalysisStaff = ({
  handleDetail,
  setBody,
}: {
  handleDetail: (val: string) => void
  setBody: (val: any) => void
}) => {
  /** i18n */
  const { t } = useTranslation()
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc theo thời gian*/
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Danh sách nhân viên */
  const STAFF_LIST = useSelector(selectStaffList)
  /** Trạng thái triggerReload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Khoảng thời gian */
  const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
  /** Tạo period từ khoảng thời gian */
  const PERIOD = getPeriod(DISTANCE_TIME)
  /** Chi tiết file đã chọn */
  const [detail_selected, setDetailSelected] = useState('client_emotion_angry')
  /** Chi tiết file base */
  const [detail_selected_base, setDetailSelectedBase] = useState(
    t('client_emotion_angry'),
  )
  /**
   * Dữ liệu chi tiết
   */
  const [detail_data_emotion, setDetailDataEmotion] = useState<DataStructure>(
    {},
  )
  /**
   * Lấy tên nhân viên
   * @param id
   * @returns
   */
  const getName = (id: string): string => {
    if (STAFF_LIST[id]) return STAFF_LIST[id]?.name || id
    return id
  }

  /**
   *  Hàm thống báo
   * @param value giá trị thông báo
   */
  const handleNotify = (value: string) => {
    dispatch(notifyWithDebounce(value, 'error'))
  }

  /**
   *  Lấy dữ liệu chi tiết
   * @returns Dữ liệu
   */
  const fetchDetailEmotion = async () => {
    /**
     * Body request
     */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      row: 'staff_id',
      col: 'event',
      event: [`${detail_selected}`],
    }
    /** Call api function */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    return RESULT
  }

  /** Hàm fetch Lấy dữ liệu */
  const fetchData = async () => {
    /** Nếu không có ID Tổ chức hoặc ID Trang */
    if (!ORG_ID || !PAGE_ID?.length) {
      /** Xoa dữ liệu */
      setDetailDataEmotion({})
      return
    }
    /** Nếu Không có giá trị lựa chọn */
    if (detail_selected) {
      /** Gọi hàm lấy dữ liệu Cảm xúc */
      const RES = await fetchDetailEmotion()
      setDetailDataEmotion(RES)
    }
  }
  /** Use Effect*/
  useEffect(() => {
    fetchData()
  }, [ORG_ID, PAGE_ID, detail_selected, FILTER_TIME])
  /** Use Effect */
  useEffect(() => {
    /** Trạng thái trigger reload */
    if (TRIGGER_RELOAD) {
      fetchData()
    }
  }, [TRIGGER_RELOAD])
  /**
   * Tinh tống sự kiện
   * @returns Tống sự kiện
   */
  const TOTAL_COUNT_DETAIL = values(detail_data_emotion).reduce(
    (sum, eventObj) =>
      sum +
      values(eventObj).reduce(
        (eventSum, event) => eventSum + event.total_value,
        0,
      ),
    0,
  )
  /**
   * Danh sách dữ liệu chi tiết
   * @returns Danh sách dữ liệu
   */
  const TABLE_DETAIL_DATA = keys(detail_data_emotion).map(key => {
    const TOTAL_FOR_KEY = values(detail_data_emotion[key]).reduce(
      (sum, event) => sum + event.total_value,
      0,
    )
    return {
      key: getName(key),
      count: TOTAL_FOR_KEY,
      percentage:
        ((Number(TOTAL_FOR_KEY) / Number(TOTAL_COUNT_DETAIL)) * 100).toFixed(
          2,
        ) + '%',
    }
  })
  /**
   * Danh sách cơ bản
   * @returns Danh sách
   */
  const COLUMN_DETAIL_EMOTION = [
    {
      accessorKey: 'key',
      header: () => `${detail_selected_base}`,
      cell: info => info.getValue(),
      size: 150,
    },
    {
      accessorKey: 'count',
      header: () => t('total_value'),
      cell: info => formatWithCommas(info.getValue()),
      size: 80,
    },
    {
      accessorKey: 'percentage',
      header: () => t('percentage'),
      cell: info => info.getValue(),
      size: 70,
    },
  ]
  /**
   * Chi tiết Label
   */
  const LABEL_DETAIL = keys(detail_data_emotion)
  /** Lấy tên chi tiết */
  const LABELS_DETAIL_RENDER_NAME = LABEL_DETAIL.map(getName)
  /** Lấy dữ liệu chi tiết */
  const SERIES_DATA_DETAIL = LABEL_DETAIL.map(key =>
    values(detail_data_emotion[key]).reduce(
      (sum, event) => sum + event.total_value,
      0,
    ),
  )
  /**
   * Danh sách cơ bản
   */
  const OPTIONS = [
    'client_emotion_angry',
    'client_emotion_happy',
    'client_emotion_sad',
    'client_emotion_like',
    // 'client_emotion_fear',
    // 'client_emotion_surprise',
    // 'client_emotion_disgust',
    // 'client_emotion_love',
    // 'client_emotion_jealousy',
    // 'client_emotion_shame',
    // 'client_emotion_pride',
    // 'client_emotion_none',
  ]

  return {
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
  }
}

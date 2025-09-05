import { aggregateStaffData, formatWithCommas } from '@/utils'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { getPeriod } from '@/services/api_helper'
import { map } from 'lodash'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

/**
 * Emotion Data
 */
interface TagData {
  /**
   * Emotion
   */
  label: string
  /**
   * Value
   */
  value: number
  /**
   * Type
   */
  type: string
}

/**
 * Line Tag Data
 */
interface LineTagData {
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
}

export function useOverviewData() {
  /** i18n */
  const { t } = useTranslation()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang  */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc theo thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Trạng thái triggerReload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** Dữ liệu nhãn */
  const [data_tag, setDataTag] = useState<LineTagData[]>([])
  /** Dữ liệu Biểu đồ */
  const [chart_data, setChartData] = useState<TagData[]>([])

  /**
   * Hàm hành động thống báo
   * @param msg Thống báo
   */
  const handleNotify = (msg: string) => {
    dispatch(notifyWithDebounce(msg, 'error'))
  }
  /**
   *  Hàm fetch table
   * @returns Dữ liệu Biểu đồ
   */
  const fetchTable = async () => {
    /** Khoảng thời gian */
    const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
    /** Tạo period từ khoảng thời gian */
    const PERIOD = getPeriod(DISTANCE_TIME)
    /** Khai báo body */
    const BODY = {
      PAGE_ID,
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      row: 'staff_id',
    }
    /**
     * Kết quả sau khi fetch
     */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )

    const DATA_SUMMARY = aggregateStaffData(RESULT)

    /** DATA_SUMMARY */
    const STAFF_LABELS: Record<string, string> = {
      staff_miss_call_in_hours: t('staff_miss_call_in_hours'),
      staff_miss_call_out_hours: t('staff_miss_call_out_hours'),
      staff_miss_response_in_hours: t('staff_miss_response_in_hours'),
      staff_miss_response_out_hours: t('staff_miss_response_out_hours'),
    }
    /** Xử lý lặp dữ liệu */
    return map(DATA_SUMMARY, (value, key) => {
      const label = STAFF_LABELS[key] || t('no_identify')

      return {
        label, // Nhãn hiển thị
        value, // Giá trị chính là số lượng
        type: key, // Key gốc
      }
    })
  }
  /** Hàm xử lý dữ liệu */
  const renderData = (data: TagData[]) => {
    /** Khai báo kết quả */
    const RESULT: LineTagData[] = [
      {
        title: t('staff_miss_call_in_hours'),
        type: 'staff_miss_call_in_hours',
        count: formatWithCommas(
          data.find(e => e.type === 'staff_miss_call_in_hours')?.value ?? 0,
          true,
        ),
      },
      {
        title: t('staff_miss_call_out_hours'),
        type: 'staff_miss_call_out_hours',
        count: formatWithCommas(
          data.find(e => e.type === 'staff_miss_call_out_hours')?.value ?? 0,
          true,
        ),
      },
      {
        title: t('staff_miss_response_in_hours'),
        type: 'staff_miss_response_in_hours',
        count: formatWithCommas(
          data.find(e => e.type === 'staff_miss_response_in_hours')?.value ?? 0,
          true,
        ),
      },
      {
        title: t('staff_miss_response_out_hours'),
        type: 'staff_miss_response_out_hours',
        count: formatWithCommas(
          data.find(e => e.type === 'staff_miss_response_out_hours')?.value ??
            0,
          true,
        ),
      },
    ]
    /** Lưu dữ liệu tag với RESULT */
    setDataTag(RESULT)
  }

  /** Hàm fetch data */
  const fetchData = async () => {
    /**
     * Kết quả sau khi fetch
     */
    const RES = await fetchTable()

    console.log(RES, 'RES')
    /** Lưu dữ liệu vào state */
    renderData(RES)
    /** Filter dữ liệu khác client_neutral */
    const FILTERED = RES.filter(item => item.type !== 'client_neutral')
    /** Lưu dữ liệu vào state */
    setChartData(FILTERED)
  }
  /** Hàm thay đổi */
  useEffect(() => {
    /** Nếu 1 trong 3 giá trị không tìm thấy thì reset dữ liệu */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset dữ liệu chart */
      setChartData([])
      /** Reset dữ liệu tag */
      setDataTag([])
      return
    }
    /** Call api */
    fetchData()
  }, [ORG_ID, PAGE_ID, FILTER_TIME, TRIGGER_RELOAD])

  return {
    data_tag,
    chart_data,
    ORG_ID,
    FILTER_TIME,
  }
}

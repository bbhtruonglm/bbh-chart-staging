import { aggregateStaffData, formatWithCommas } from '@/utils'
import { keys, map } from 'lodash'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { getPeriod } from '@/services/api_helper'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { t } from 'i18next'

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
export const useStaffScreen = () => {
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc theo thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Trạng thái triggerReload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Dữ liệu nhân viên */
  const [data_staff, setDataStaff] = useState({})

  /** Dữ liệu nhãn */
  const [data_tag, setDataTag] = useState<LineTagData[]>([])
  /**
   *  Hàm notify
   * @param value : string
   */
  const handleNotify = (value: string) => {
    dispatch(notifyWithDebounce(value, 'error'))
  }

  /**
   * Hàm fetch table
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
    /** Kết quả khi fetch */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /** Lưu giá trị nhân viên */
    setDataStaff(RESULT)
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
  }
  /** Hàm fetch table  */
  useEffect(() => {
    /** Nếu có 1 trong 3 giá trị biến ORG_ID, PAGE_ID, FILTER_TIME.end_time thì reset list staff */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset staff */
      setDataStaff({})
      return
    }
    /** Gọi hàm fetchTable */
    fetchTable()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Hàm fetch table
   */
  useEffect(() => {
    /** Kiểm tra nếu triggerReload */
    // if (TRIGGER_RELOAD) {
    /** Nếu có 1 trong 3 giá trị biến ORG_ID, PAGE_ID, FILTER_TIME.end_time thì reset list staff */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset staff */
      setDataStaff({})
      return
    }
    /** Gọi hàm fetchTable */
    /** Call api */
    fetchData()
    // }
  }, [TRIGGER_RELOAD, ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Tạo dữ liệu cho bảng
   */
  const TABLE_DATA = keys(data_staff).map(staff_id_column => {
    /**
     * Tạo dữ liệu cho bảng
     */
    const ROW = { staff_id_column } as any
    /** Xử lý dữ liệu nhân viên */
    keys(data_staff[staff_id_column]).forEach(key => {
      ROW[key] = data_staff[staff_id_column][key].total_value
    })
    /** Trả về dữ liệu */
    return ROW
  })

  return {
    TABLE_DATA: TABLE_DATA,
    data_tag,
    FILTER_TIME,
  }
}

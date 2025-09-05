import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
// hooks/usePageOverview.ts
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { getPeriod } from '@/services/api_helper'
import { keys } from 'lodash'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'

export function usePageScreen() {
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /**
   * Lọc thời gian
   */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Hàm trigger Reload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Dữ liệu Tổng quan */
  const [data_overview, setDataOverview] = useState({})

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
    /** Tạo period tu khoang thoi gian */
    const PERIOD = getPeriod(DISTANCE_TIME)
    /** Body */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
    }
    /** Kết quả sau khi fetch Funtion */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /** Luu vao state */
    setDataOverview(RESULT)
  }

  /** Fetch lần đầu hoặc khi filter/ids đổi */
  useEffect(() => {
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset dữ liệu bảng */
      setDataOverview({})
      return
    }
    /** Call api */
    fetchTable()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])

  /** Fetch nếu có trigger reload */
  useEffect(() => {
    /** Nếu có trạng thái trigger reload */
    if (TRIGGER_RELOAD) {
      /** Bất kỳ giá trị filter nào không có, reset data */
      if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
        setDataOverview({})
        return
      }
      /** Call api */
      fetchTable()
    }
  }, [TRIGGER_RELOAD, ORG_ID, PAGE_ID, FILTER_TIME])

  /** Chuẩn hóa data cho bảng */
  const TABLE_DATA = keys(data_overview).map(date => {
    /** Tạo Row */
    const ROW = { date } as any
    /**Xử lý dữ liệu */
    keys(data_overview[date]).forEach(key => {
      ROW[key] = data_overview[date][key].total_value
    })
    /** Trả về row data xử lý */
    return ROW
  })
  /** Sắp xếp theo thời gian */
  const SORTED_TABLE_DATA = TABLE_DATA.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  return {
    TABLE_DATA: SORTED_TABLE_DATA,
  }
}

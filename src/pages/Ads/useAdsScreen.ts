import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { getPeriod } from '@/services/api_helper'
import { keys } from 'lodash'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'

export const useAdsScreen = () => {
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc theo thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Hàm trigger Reload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /**Dữ liệu Quảng cáo */
  const [data_ads, setDataAds] = useState({})

  /** Hàm notify với debounce */
  const handleNotify = (value: string) => {
    dispatch(notifyWithDebounce(value, 'error'))
  }

  /** Hàm fetch table */
  const fetchTable = async () => {
    /** Khoảng thời gian */
    const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
    /** Tạo period tu khoảng thời gian */
    const PERIOD = getPeriod(DISTANCE_TIME)
    /** Khai báo body */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      PAGE_ID,
      period: PERIOD,
      row: 'ad_id',
      event: ['phone_ai_detect', 'ad_reach'],
    }
    /** Kết quả sau khi fetch */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /** Lưu giá trị */
    setDataAds(RESULT)
  }
  /** Hàm useEffect */
  useEffect(() => {
    /** Kiểm tồn tại 1 trong 3 giá trị thì reset dữ liệu quảng cáo */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset quảng cáo */
      setDataAds({})
      return
    }
    /** Fetch table */
    fetchTable()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Hàm useEffect
   */
  useEffect(() => {
    /** Hàm trigger reload */
    if (TRIGGER_RELOAD) {
      /** Kiểm tồn tại 1 trong 3 giá trị thì reset dữ liệu quảng cáo */
      if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
        /** Reset quảng cáo  */
        setDataAds({})
        return
      }
      /** Fetch table */
      fetchTable()
    }
  }, [TRIGGER_RELOAD, ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Dữ liệu quảng cáo
   */
  const TABLE_DATA = keys(data_ads).map(ads_id_column => {
    /** Tạo row */
    const ROW = { ads_id_column } as any
    /** Xử lý row giá trị */
    keys(data_ads[ads_id_column]).forEach(key => {
      ROW[key] = data_ads[ads_id_column][key].total_value
    })
    /** Trả về row */
    return ROW
  })

  return {
    TABLE_DATA,
  }
}

import { getFormatDate, getPeriod } from '@/services/api_helper'
import { keys, values } from 'lodash'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { format } from 'date-fns'
import { formatWithCommas } from '@/utils'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

export const useOverview = () => {
  /** i18n */
  const { t } = useTranslation()
  /** Dispatch */
  const dispatch: AppDispatch = useDispatch()
  /**
   * ID Tổ chức
   */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Trigger Hot reload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Dữ liệu Tổng quan */
  const [data_overview, setDataOverview] = useState({})
  /** Field mapping cho tổng quan */
  const FIELD_MAPPING = useMemo(
    () => ({
      client_return: t('client_return'),
      client_unique: t('client_unique'),
      message_client: t('message_client'),
      phone_ai_detect: t('phone_ai_detect'),
    }),
    [t],
  )
  /** Có cần call api */
  const SHOULD_FETCH = ORG_ID && PAGE_ID.length && FILTER_TIME?.end_time

  /**
   *  Hàm notify với debounce
   * @param value : string
   */
  const handleNotify = (value: string) => {
    dispatch(notifyWithDebounce(value, 'error'))
  }
  /**
   * Lấy dữ liệu tổng quan
   */
  const fetchData = async () => {
    /**
     * Tính toán Khoảng thơi gian
     */
    const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
    /** Tính toán period từ khoảng thời gian */
    const PERIOD = getPeriod(DISTANCE_TIME)

    /** Khai báo body */
    const BODY = {
      PAGE_ID,
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
    }
    /** Kết quả khi fetch FN */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /** Lưu giá trị vào state */
    setDataOverview(RESULT || {})
  }
  /**
   * Kiểm tra xem có cần call api hay khong
   */
  useEffect(() => {
    if (!SHOULD_FETCH) {
      setDataOverview({})
      return
    }
    fetchData()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Khi trigger reload thì call api
   */
  useEffect(() => {
    /** Nếu có trigger và Cần call api thì gọi */
    if (TRIGGER_RELOAD && SHOULD_FETCH) {
      fetchData()
    }
  }, [TRIGGER_RELOAD, SHOULD_FETCH])
  /**
   * Sắp xếp dữ liệu theo thời gian
   */
  const SORTED_LABEL = useMemo(() => {
    return keys(data_overview).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )
  }, [data_overview])
  /** Dữ liệu hiện trong bảng */
  const SERIES_DATA = useMemo(() => {
    return keys(FIELD_MAPPING).map(key => ({
      name: FIELD_MAPPING[key],
      data: SORTED_LABEL.map(
        date => data_overview[date]?.[key]?.total_value || 0,
      ),
    }))
  }, [FIELD_MAPPING, data_overview, SORTED_LABEL])
  /** FORMAT TIME */
  const FORMAT_TIME = useMemo(() => {
    /**
     * Tính toán Khoảng thơi gian
     */
    const DISTANCE = FILTER_TIME.end_time - FILTER_TIME.start_time
    /**
     * Tính toán period từ khoảng thời gian
     */
    return getFormatDate(DISTANCE)
  }, [FILTER_TIME])
  /**
   * Sắp xếp dữ liệu theo thời gian
   */
  const CATEGORIES = useMemo(() => {
    /**
     * Sắp xếp dữ liệu theo thời gian
     */
    return SORTED_LABEL.map(date => format(date, FORMAT_TIME))
  }, [SORTED_LABEL, FORMAT_TIME])
  /**
   * Dữ liệu hiện trong bảng
   */
  const TABLE_DATA = useMemo(() => {
    /**
     * Sắp xếp dữ liệu theo thời gian
     */
    return SORTED_LABEL.map(date => {
      /**
       * Tạo row
       */
      const ROW: Record<string, any> = { date }
      keys(data_overview[date] || {}).forEach(key => {
        ROW[key] = data_overview[date][key]?.total_value
      })
      /**
       * Trả về row
       */
      return ROW
    })
  }, [SORTED_LABEL, data_overview])
  /**
   * Dữ liệu tống quan
   */
  const SUMMARY_DATA = useMemo(() => {
    return keys(FIELD_MAPPING).map(field => {
      /**
       * Tính toán Tổng
       */
      const TOTAL = values(data_overview).reduce((sum, dateData) => {
        return sum + (dateData[field]?.total_value || 0)
      }, 0)

      return {
        title: FIELD_MAPPING[field],
        type: field,
        count: formatWithCommas(TOTAL as number, true),
      }
    })
  }, [FIELD_MAPPING, data_overview])

  return {
    SUMMARY_DATA,
    SERIES_DATA,
    CATEGORIES,
    TABLE_DATA,
  }
}

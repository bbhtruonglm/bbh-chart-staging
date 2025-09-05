import { getFormatDate, getPeriod } from '@/services/api_helper'
import { keys, mapValues, merge, omitBy, sumBy, values } from 'lodash'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
// hooks/useEmotionalAnalysis.ts
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { format } from 'date-fns'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { renderEmotion } from '@/utils'
import { selectTriggerReload } from '@/stores/reloadSlice'

export const useEmotionalAnalysis = () => {
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc thờii gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /**
   * Trạng thái triggerReload
   */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** List Trạng thái */
  const EMOTIONS = [
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
  /** Xử lý dữ liệu */
  const EMOTION_DATA = EMOTIONS.reduce((acc, emotion) => {
    acc[emotion] = {
      event: emotion,
      event_count: '0',
      total_value: 0,
    }
    return acc
  }, {})
  /**  Màu stroke */
  const [stroke_color, setStrokeColor] = useState('')
  /**
   * Dữ liệu line chart
   */
  const [data_line_chart, setDataLineChart] = useState({})
  /**
   * Dữ liệu api
   */
  const [emotion_api_data, setEmotionApiData] = useState({})

  /** Hàm notify */
  const handleNotify = (value: string) => {
    dispatch(notifyWithDebounce(value, 'error'))
  }
  /**
   * Hàm fetch line chart
   */
  const fetchLineChart = async () => {
    /**
     * Khoảng thời gian
     */
    const DISTANCE = FILTER_TIME.end_time - FILTER_TIME.start_time
    /** Tạo period tu khoảng thời gian */
    const PERIOD = getPeriod(DISTANCE)
    /**
     * Khai báo body
     */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      event: EMOTIONS,
    }
    /**
     * Call api
     */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /**
     * Lưu giá trị
     */
    setDataLineChart(RESULT || {})
  }

  /**
   * Hàm fetch data api
   */
  const fetchEmotionData = async () => {
    /** Khai báo body */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      event: EMOTIONS,
    }
    /**
     * Call api
     */
    const RESULT = await fetchFunction(
      dispatch,
      'countEvent',
      BODY,
      'app/analytic/count_event',
      handleNotify,
    )
    /** Lưu giá trị */
    setEmotionApiData(RESULT || {})
  }

  /**
   *
   * @param init
   * @param incoming
   * @returns
   */
  const updateEmotionsData = (init, incoming) => {
    /**  Xử lý dữ liệu */
    const NORMALIZED_DATA = mapValues(incoming, v => ({
      event: v.event,
      event_count: Number(v.event_count),
      total_value: v.total_value,
    }))
    /**
     * Merge 2 object
     */
    const MERGED = merge({}, init, NORMALIZED_DATA)
    /** Lưu giá trị */
    return omitBy(MERGED, v => v.total_value === 0)
  }
  /**  Xử lý dữ liệu api */
  const UPDATED_EMOTION_DATA = updateEmotionsData(
    EMOTION_DATA,
    emotion_api_data,
  )
  /** Tính tống */
  const TOTAL = sumBy(values(UPDATED_EMOTION_DATA), 'total_value')
  /**
   * Dữ liệu bảng
   */
  const TABLE_DATA = values(UPDATED_EMOTION_DATA).map(emotion => ({
    name: emotion.event,
    total_value: emotion.total_value,
    percentage:
      TOTAL > 0
        ? `${((emotion.total_value / TOTAL) * 100).toFixed(2)}%`
        : '0.00%',
  }))

  /**
   *  Sắp xếp ngày
   * @param dates
   * @returns
   */
  const sortDates = (dates: string[]) =>
    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  /**
   * Lấy key của dữ liệu line chart
   */
  const LABEL_KEYS = sortDates(keys(data_line_chart || {}))
  /**
   * Khoảng thời gian
   */
  const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
  /**
   * Tạo format ngày
   */
  const FORMAT = getFormatDate(DISTANCE_TIME)
  /**
   * Danh sách ngày
   */
  const LABELS = LABEL_KEYS.map(date => format(date, FORMAT))
  /**
   * Sắp xếp Cảm xúc
   */
  const SERIES = EMOTIONS.map(emotion => {
    /**
     * Dữ liệu cảm xúc
     */
    const DATA = LABEL_KEYS.map(
      date => data_line_chart[date]?.[emotion]?.total_value ?? 0,
    )
    /** Lấy dữ liệu của từng ngày cho cảm xúc hiện tại */
    if (DATA.some(val => val !== 0)) {
      return {
        name: renderEmotion(emotion),
        data: DATA,
      }
    }
    return null
  }).filter(Boolean)
  /**
   *  use effect
   */
  useEffect(() => {
    /**
     * Kiểm tra ID có tồn tại không, nếu có thì reset data
     */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset dữ liệu cảm xúc */
      setEmotionApiData({})
      /** Reset line chart */
      setDataLineChart({})
      return
    }
    /**
     * Gọi dữ liệu cảm xúc
     */
    fetchEmotionData()
    /**
     *  Gọi dữ liệu line chart
     */
    fetchLineChart()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * use effect
   */
  useEffect(() => {
    /**
     * Kiểm tra ID có tồn tại không, nếu có thì reset data
     */
    if (TRIGGER_RELOAD && ORG_ID && PAGE_ID?.length && FILTER_TIME.end_time) {
      /**
       * Gọi dữ liệu cảm xúc
       */
      fetchEmotionData()
      /**
       * Gọi dữ liệu line chart
       */
      fetchLineChart()
    }
  }, [ORG_ID, PAGE_ID, FILTER_TIME, TRIGGER_RELOAD])

  return {
    TABLE_DATA,
    CATEGORIES_BAR: TABLE_DATA.map(row => renderEmotion(row.name)),
    VALUES_BAR: TABLE_DATA.map(row => row.total_value),
    SERIES,
    LABELS,
    setStrokeColor,
    stroke_color,
    UPDATED_EMOTION_DATA,
  }
}

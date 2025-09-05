import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { formatWithCommas } from '@/utils'
import { map } from 'lodash'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

/**
 * Emotion Data
 */
interface EmotionData {
  /**
   * Emotion
   */
  emotion: string
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
  const [chart_data, setChartData] = useState<EmotionData[]>([])

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
    /** Khai báo body */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      event: ['client_positive', 'client_negative', 'client_neutral'],
    }
    /**
     * Kết quả sau khi fetch
     */
    const RESULT = await fetchFunction(
      dispatch,
      'countEvent',
      BODY,
      'app/analytic/count_event',
      handleNotify,
    )
    /** Xử lý lại dữ liệu */
    return map(RESULT, (value, key) => {
      const EMOTIONAL_LABEL =
        {
          client_positive: t('client_positive'),
          client_negative: t('client_negative'),
          client_neutral: t('client_neutral'),
        }[key] || t('no_identify')

      return {
        emotion: EMOTIONAL_LABEL,
        value: value.total_value,
        type: key,
      }
    })
  }
  /** Hàm xử lý dữ liệu */
  const renderData = (data: EmotionData[]) => {
    /** Khai báo kết quả */
    const RESULT: LineTagData[] = [
      {
        title: t('total_messages_positive'),
        type: 'smile',
        count: formatWithCommas(
          data.find(e => e.type === 'client_positive')?.value ?? 0,
          true,
        ),
      },
      {
        title: t('total_messages_negative'),
        type: 'frown',
        count: formatWithCommas(
          data.find(e => e.type === 'client_negative')?.value ?? 0,
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

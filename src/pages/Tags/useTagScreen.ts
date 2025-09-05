import { entries, map } from 'lodash'
import {
  selectFilterTime,
  selectLabelList,
  selectOrgId,
  selectPageId,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { AppDispatch } from '@/stores'
import { fetchFunction } from '@/api/fetchApi'
import { formatWithCommas } from '@/utils'
import { getPeriod } from '@/services/api_helper'
import { notifyWithDebounce } from '@/stores/notifySlice'
import { selectTriggerReload } from '@/stores/reloadSlice'
import { useTranslation } from 'react-i18next'

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
    [event_name: string]: EventData
  }
}
export const useTagScreen = () => {
  /** Hàm dispatch */
  const dispatch: AppDispatch = useDispatch()
  /** I18n */
  const { t } = useTranslation()
  /** ID Tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** ID Trang */
  const PAGE_ID = useSelector(selectPageId)
  /** Lọc theo thời gian */
  const FILTER_TIME = useSelector(selectFilterTime)
  /** Danh sách nhãn */
  const LABEL_LIST = useSelector(selectLabelList)
  /** Trạng thái triggerReload */
  const TRIGGER_RELOAD = useSelector(selectTriggerReload)
  /** Dữ liệu raw */
  const [data_raw, setDataRaw] = useState<DataStructure>({})
  /** Dữ liệu nhãn */
  const [data_tag, setDataTag] = useState<
    { title: string; type: string; count: number | string }[]
  >([])

  /** Lấy tên nhãn */
  const getLabel = (id: string): string => {
    return LABEL_LIST[id]?.title || id
  }
  /** Hàm notify */
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
      PAGE_ID,
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      row: 'label_id',
    }
    /** Dữ liệu trả về khí fetchFunction */
    const RESULT = await fetchFunction(
      dispatch,
      'toTable',
      BODY,
      'app/analytic/to_table',
      handleNotify,
    )
    /** Lưu dữ liệu render Tag */
    renderDataTag(RESULT)
    /** Lưu dữ liệu Raw data */
    setDataRaw(RESULT)
  }

  /** Render Tổng các cột tương ứng */
  const renderDataTag = (data: object) => {
    /** Tính tổng số Thẻ sử dụng */
    const TOTAL_KEYS = Object.keys(data).length

    /** Tổng */
    let total_label_add_value = 0
    /** Tính tổng */
    for (const [key, value] of entries(data)) {
      /**
       * Nếu có dữ liệu thì cộng dồn
       */
      if (value.label_add) {
        /**
         * Cộng dồn giá trị
         */
        total_label_add_value += value.label_add.total_value
      }
    }

    /** Khai báo dữ liệu cho LineTag */
    const RESULT = [
      {
        title: t('total_label_active'),
        type: 'active_label',
        count: formatWithCommas(TOTAL_KEYS, true),
      },
      {
        title: t('total_label_count'),
        type: 'total_label',
        count: formatWithCommas(total_label_add_value, true),
      },
    ]
    /** Set data cho LineTag */
    setDataTag(RESULT)
  }
  /** Sử dụng useEffect */
  useEffect(() => {
    /** Khi ID Tổ chức, ID Trang, Lọc theo thời gian chưa khai bao */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /** Reset dữ liệu raw */
      setDataRaw({})
      /** Reset dữ liệu nhãn */
      setDataTag([])
      return
    }
    /** Gọi hàm fetch table */
    fetchTable()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])

  /** Sử dụng useEffect */
  useEffect(() => {
    /** Khi triggerReload */
    if (TRIGGER_RELOAD) {
      /**
       * Khi ID Tổ chức, ID Trang, Lọc theo thời gian chưa khai bao
       */
      if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
        /** Reset dữ liệu raw */
        setDataRaw({})
        /**
         * Reset dữ liệu nhãn
         */
        setDataTag([])
        return
      }

      fetchTable()
    }
  }, [TRIGGER_RELOAD, ORG_ID, PAGE_ID, FILTER_TIME])
  /**
   * Dữ liệu table
   */
  const TABLE_DATA = useMemo(() => {
    return map(data_raw, (value, key) => {
      return {
        id: getLabel(key),
        label_add: value.label_add?.total_value || 0,
        label_remove: value.label_remove?.total_value || 0,
        using_label:
          (value.label_add?.total_value || 0) -
          (value.label_remove?.total_value || 0),
      }
    })
  }, [data_raw, LABEL_LIST])
  /** Dữ liệu nhãn */
  const LABELS_CHART = []
  /** Dữ liệu Chart */
  const DATA_CHART = []
  /** Tạo vòng lặp xử lý dữ liệu */
  for (const [key, value] of entries(data_raw)) {
    if (value.label_add) {
      LABELS_CHART.push(getLabel(key))
      DATA_CHART.push(value.label_add.total_value)
    }
  }

  return {
    TABLE_DATA,
    data_tag,
    LABELS_CHART,
    DATA_CHART,
  }
}

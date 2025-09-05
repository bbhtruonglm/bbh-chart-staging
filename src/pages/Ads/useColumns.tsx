import { useEffect, useMemo, useState } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { formatWithCommas } from '@/utils'
import { useTranslation } from 'react-i18next'

/**
 * Kiểu dữ liệu sử dụng cho bảng Ads
 */
export type User = {
  /**
   *  ID quảng cáo
   */
  ads_id_column: string | null
  /**
   * AI phát hiện số điện thoại
   */
  phone_ai_detect: string | null
  /**
   * Số điện thoại duy nhất
   */
  unique_phone_numbers: string | null
  /**
   * Nhãn kích hoạt
   */
  label_add: string | null
  /**
   * Nhãn huỷ
   */
  label_remove: string | null
  /**
   * Số lượt tiếp cận quảng cáo
   */
  ad_reach: string | null
}

/** Setup các field cho header của 1 bảng */
export const useColumns = () => {
  /**
   * Sử dụng hook i18n
   */
  const { t } = useTranslation()
  /** Với mỗi bảng sẽ setup type, và các field khác nhau */
  const COLUMN_HELPER = createColumnHelper<User>()

  /**
   * Xử lý khi resize
   */
  useEffect(() => {
    /**
     *  Hàm xử lý khi resize
     * @returns
     */
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    /**
     * Thêm sự kiện resize
     */
    window.addEventListener('resize', handleResize)
    /**
     * Xóa sự kiện resize
     */
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  /**
   * State lưu trạng thái hiển thị mobile
   */
  const [is_mobile, setIsMobile] = useState(window.innerWidth < 768)
  /**
   * Các cột của bảng
   */
  const COLUMNS = useMemo(
    () => [
      COLUMN_HELPER.accessor('ads_id_column', {
        meta: {
          label: t('_ads_id_column'),
        },
        header: () => t('_ads_id_column'),
        cell: info => <div className="truncate">{info.getValue() ?? '-'}</div>,
        footer: () => 'Tổng',
        size: is_mobile ? 145 : 180,
      }),

      COLUMN_HELPER.accessor('phone_ai_detect', {
        meta: {
          label: t('_phone_total'),
        },
        header: () => <div className="">{t('_phone_total')}</div>,
        cell: info => formatWithCommas(info.getValue()) ?? '-',

        size: 90,
      }),

      COLUMN_HELPER.accessor('ad_reach', {
        meta: {
          label: t('_ad_reach'),
        },
        header: () => t('_ad_reach'),
        cell: info => formatWithCommas(info.getValue()) ?? '-',
        size: 120,
      }),
    ],
    [is_mobile],
  )

  return {
    COLUMNS,
  }
}

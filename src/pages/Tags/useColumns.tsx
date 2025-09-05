import { useEffect, useMemo, useState } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import { formatWithCommas } from '@/utils'
import { useTranslation } from 'react-i18next'

/** Setup các field cho header của 1 bảng */
export const useColumns = () => {
  /**
   * Sử dụng hook i18n
   */
  const { t } = useTranslation()
  /** Với mỗi bảng sẽ setup type, và các field khác nhau */
  const COLUMN_HELPER = createColumnHelper<any>()

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
      COLUMN_HELPER.accessor('id', {
        meta: {
          label: t('label_name'),
        },
        header: () => <div>{t('label_name')}</div>,
        cell: info => <div className="truncate">{info.getValue() ?? '-'}</div>,
        size: 150,
      }),
      {
        meta: {
          label: t('label_active'),
        },
        header: t('label_active'),
        accessorKey: 'label_add',
        cell: info => (
          <div className="truncate">
            {formatWithCommas(info.getValue() as number, true)}
          </div>
        ),
        size: 100,
      },
      {
        meta: {
          label: t('label_remove'),
        },
        header: t('label_remove'),
        accessorKey: 'label_remove',
        cell: info => (
          <div className="truncate">
            {formatWithCommas(info.getValue() as number, true)}
          </div>
        ),
        size: 100,
      },
      {
        meta: {
          label: t('using_label'),
        },
        header: t('using_label'),
        accessorKey: 'using_label',
        cell: info => (
          <div className="truncate">
            {formatWithCommas(info.getValue() as number, true)}
          </div>
        ),
        size: 100,
      },
    ],
    [is_mobile],
  )

  return {
    COLUMNS,
  }
}

// hooks/useLanguage.ts
import { useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook để quản lý ngôn ngữ (locale) của ứng dụng
 */
export const useLanguage = () => {
  const { i18n } = useTranslation()

  /** State lưu trữ locale hiện tại */
  const [locale, set_locale] = useState<string | number>('vi')

  /** Search param để sync locale với URL */
  const [search_params, setSearchParams] = useSearchParams()

  /** Khi component mounted, lấy ngôn ngữ từ localStorage */
  useEffect(() => {
    /** Lấy ngôn ngữ từ localStorage */
    const STORED_LANG = localStorage.getItem('locale') || 'vi'
    set_locale(STORED_LANG)
  }, [])

  /**
   * Thay đổi ngôn ngữ
   * @param lng - Mã ngôn ngữ mới (vd: 'vi', 'en')
   */
  const changeLanguage = (lng: string) => {
    /** i18n xử lý ngôn ngữ */
    i18n.changeLanguage(lng)
    /** cập nhật state */
    set_locale(lng)
    /** lưu vào localStorage */
    localStorage.setItem('locale', lng)

    /** cập nhật query param */
    search_params.set('locale', lng)
    /** Update params */
    setSearchParams(search_params)
  }

  return {
    locale,
    changeLanguage,
  }
}

// hooks/useUserSettings.ts
import { useEffect, useState } from 'react'

/** Giá trị mặc định cho user settings */
const DEFAULT_SETTINGS = {
  is_enable_personal_setting: false,
  is_hide_page_avatar: false,
  display_label_type: 'FULL',
}

/**
 * Custom hook để lấy và cập nhật thông tin cài đặt người dùng từ localStorage
 */
export const useUserSettings = () => {
  /** State lưu trữ cài đặt người dùng */
  const [user_settings, setUserSettings] = useState(DEFAULT_SETTINGS)

  /** Lấy dữ liệu userSettings từ localStorage khi khởi tạo */
  useEffect(() => {
    /** Lấy dữ liệu userSettings từ localStorage */
    const STORED_SETTINGS = localStorage.getItem('userSettings')
    setUserSettings(
      STORED_SETTINGS ? JSON.parse(STORED_SETTINGS) : DEFAULT_SETTINGS,
    )
  }, [])

  /**
   * Cập nhật một setting cụ thể và lưu vào localStorage
   * @param key - Tên thuộc tính cần cập nhật
   * @param value - Giá trị mới
   */
  const updateSetting = (key: string, value: any) => {
    /** Cập nhật setting */
    const UPDATED_SETTINGS = { ...user_settings, [key]: value }
    /** Lưu setting */
    setUserSettings(UPDATED_SETTINGS)
    /** Lưu setting vào localStorage */
    localStorage.setItem('userSettings', JSON.stringify(UPDATED_SETTINGS))
  }

  return {
    settings: user_settings,
    updateSetting,
  }
}

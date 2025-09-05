/** thông tin nhân viên */
export interface Staff {
  /**  Số lượng thiết bị đang online */
  count_device_online?: number
  /** Thời gian tạo tài khoản */
  createdAt?: string
  /** ID của trang Facebook */
  fb_page_id?: string
  /** ID persona của trang Facebook */
  fb_page_persona_id?: string
  /** ID nhân viên Facebook */
  fb_staff_id?: string
  /** Trạng thái token Facebook */
  fb_token_status?: boolean
  /** Danh sách các nhân viên nhóm */
  group_staff?: string[]
  /**  Biến thể hiện nhân viên có đang hoạt động hay không */
  is_active?: boolean
  /**  Biến thể hiện nhân viên có được gán tự động hay không */
  is_auto_assign?: boolean
  /**  Biến thể hiện nhân viên có phải là nhân viên ưu tiên hay không */
  is_priority?: boolean
  /** Biến thể hiện nhân viên có phải là nhân viên phụ hay không */
  is_secondary_staff?: boolean
  /**  Tên nhân viên */
  name?: string
  /** Trạng thái online của nhân viên */
  online_status?: boolean
  /** Vai trò của nhân viên */
  role?: string
  /** Loại nhân viên */
  type?: string
  /** Thời gian cập nhật cuối cùng */
  updatedAt?: string
  /** Danh sách số điện thoại WhatsApp */
  whatsapp_phone_list?: string[]
  /** Số phiên bản của tài liệu */
  __v?: number
  /** ID duy nhất của nhân viên */
  _id?: string
}

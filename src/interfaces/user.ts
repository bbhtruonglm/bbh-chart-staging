/** thông tin người dùng */
export interface User {
  /**  ID duy nhất của người dùng */
  _id?: string
  /** ID nhân viên Facebook của người dùng */
  fb_staff_id?: string
  /**  Số phiên bản của tài liệu */
  __v?: number
  /** Thời gian tạo tài khoản */
  createdAt?: string
  /** Họ và tên đầy đủ của người dùng */
  full_name?: string
  /**  Biến thể hiện người dùng có quyền quản trị hay không */
  is_admin?: boolean
  /** Biến thể hiện người dùng có phải là token chết hay không */
  is_die_token?: boolean
  /** Biến thể hiện người dùng có thể tải xuống dữ liệu hay không */
  is_download?: boolean
  /** Biến thể hiện người dùng đã được xác minh hay chưa */
  is_verify?: boolean
  /** Danh sách ID của các bộ phận Facebook */
  list_fb_bm_id?: string[]
  /** Danh sách các trang Facebook */
  list_page?: string[] // Bạn cần xác định rõ kiểu dữ liệu của list_page
  /** Cấu hình của người dùng */
  setting?: Setting
  /** Thời gian cập nhật cuối cùng */
  updatedAt?: string
  /** Id người dùng */
  user_id?: string
}

/** Cấu hình của người dùng */
interface Setting {
  /** Cấu hình hiển thị */
  display: Display
  /**  Danh sách bộ lọc cuộc trò chuyện tùy chỉnh */
  custom_filter_conversation: any[] // Bạn cần xác định rõ kiểu dữ liệu của custom_filter_conversation
  /** ID duy nhất của thiết lập */
  _id: string
}

/** Cấu hình hiển thị */
interface Display {
  /**  Hiển thị avatar */
  assign_avatar: 'HIDE' | 'SHOW'
  /** Hiển thị nhãn */
  label: 'HIDE' | 'SHOW'
  /** ID duy nhất của thiết lập hiển thị */
  _id: string
}

export interface Retion {
  /**
   * ID của khu vực
   */
  domain?: string
  /**
   * Tên khu vực
   */
  name?: string
  /**
   * Logo
   */
  logo?: {
    /**
     * Ảnh
     */
    icon?: string
    /**
     * Ảnh đầy đủ
     */
    full?: string
  }
  /**
   * Thông tin ngân hàng
   */
  bank_account?: {
    /**
     * Thông tin hóa đơn
     */
    invoice?: BankDetails
    /**
     * Thông tin không hóa đơn
     */
    non_invoice?: BankDetails
  }
  /**
   * code copy page setting
   */
  code_copy_page_setting?: string
}

/**
 * BankDetails interface
 */
interface BankDetails {
  /**
   * Mã ngân hàng
   */
  bank_bin?: number
  /**
   * Tên ngân hàng
   */
  account?: string
  /**
   * Tên chủ tài khoản
   */
  name?: string
  /**
   * Số tài khoản
   */
  bank?: string
  /**
   * Chi nhánh
   */
  code?: string
}

/** thông tin của tổ chức */
interface OrgInfo {
  /** ID của thông tin tổ chức */
  _id: string
  /** Tên của tổ chức */
  org_name?: string
  /** Mã khách hàng của tổ chức */
  org_customer_code?: string
  /** Tên công ty của tổ chức */
  org_company_name?: string
  /** Địa chỉ của tổ chức */
  org_address?: string
  /** Mã hợp đồng của tổ chức */
  org_contract_code?: string
  /** Email của tổ chức */
  org_email?: string
  /** Số điện thoại của tổ chức */
  org_phone?: string
  /** Mã số thuế của tổ chức */
  org_tax_code?: string
  /** Người đại diện của tổ chức */
  org_representative?: string
  /** Avatar của tổ chức */
  org_avatar?: string
}

/** dịch vụ gói của tổ chức */
interface OrgPackage {
  /** ID của gói dịch vụ */
  _id?: string
  /** Loại gói dịch vụ (ví dụ: PRO, FREE) */
  org_package_type?: string
  /** Số lượng trang được cấp phát */
  org_quota_page?: number
  /** Số lượng nhân viên được cấp phát */
  org_quota_staff?: number
  /** Số lượng FAU được cấp phát */
  org_quota_fau?: number
  /** Số lượng khách hàng được cấp phát */
  org_quota_client?: number
  /** Số lượng AI text được cấp phát */
  org_quota_ai_text?: number
  /** Số lượng AI image được cấp phát */
  org_quota_ai_image?: number
  /** Số lượng AI sound được cấp phát */
  org_quota_ai_sound?: number
  /** Số lượng AI video được cấp phát */
  org_quota_ai_video?: number
  /** Số lượng trang hiện tại đang sử dụng */
  org_current_page?: number
  /** Số lượng nhân viên hiện tại đang sử dụng */
  org_current_staff?: number
  /** Số lượng FAU hiện tại đang sử dụng */
  org_current_fau?: number
  /** Số lượng khách hàng hiện tại đang sử dụng */
  org_current_client?: number
  /** Số lượng AI text hiện tại đang sử dụng */
  org_current_ai_text?: number
  /** Số lượng AI image hiện tại đang sử dụng */
  org_current_ai_image?: number
  /** Số lượng AI sound hiện tại đang sử dụng */
  org_current_ai_sound?: number
  /** Số lượng AI video hiện tại đang sử dụng */
  org_current_ai_video?: number
  /** Ngày kết thúc gói dịch vụ */
  org_end_date?: number
  /** Cho biết tổ chức có đang dùng thử hay không */
  org_has_trial?: boolean
  /** Ngày bắt đầu gói dịch vụ */
  org_start_date?: number
  /** Cho biết AI image có bị khóa hay không */
  org_is_lock_ai_image?: boolean
  /** Cho biết AI sound có bị khóa hay không */
  org_is_lock_ai_sound?: boolean
  /** Cho biết AI video có bị khóa hay không */
  org_is_lock_ai_video?: boolean
  /** Cho biết khách hàng có bị khóa hay không */
  org_is_lock_client?: boolean
  /** Cho biết FAU có bị khóa hay không */
  org_is_lock_fau?: boolean
  /** Mức chiết khấu */
  org_discount?: number
  /** Ngày kết thúc chiết khấu */
  org_discount_end_date?: number
  /** Cho biết AI text có bị khóa hay không */
  org_is_lock_ai_text?: boolean
}

/** thiết lập của tổ chức */
interface OrgConfig {
  /** ID của cấu hình tổ chức */
  _id?: string
  /** Cho biết 2FA có được kích hoạt hay không */
  org_is_active_2fa?: boolean
  /** Cho biết tính năng tự động thanh toán có được kích hoạt hay không */
  org_is_auto_charge?: boolean
  /** Cho biết tính năng tự động dịch AI có được kích hoạt hay không */
  org_is_ai_auto_translate?: boolean
  /** Cho biết tính năng tự động gắn thẻ AI có được kích hoạt hay không */
  org_is_ai_auto_auto_tag?: boolean
  /** Cho biết tính năng tự động cảnh báo khiếu nại AI có được kích hoạt hay không */
  org_is_ai_auto_alert_complain?: boolean
  /** Tài khoản thực hiện tự động thanh toán */
  org_auto_charge_actor?: string
}

/** vai trò của người dùng hiện tại */
interface CurrentMS {
  /** ID của người dùng hiện tại */
  _id?: string
  /** ID của tổ chức */
  org_id?: string
  /** Vai trò của người dùng hiện tại */
  ms_role?: string
}

/** dữ liệu của tổ chức */
export interface OrganizationData {
  /** ID của tổ chức */
  _id?: string
  /** Thông tin tổ chức */
  org_info?: OrgInfo
  /** Gói dịch vụ của tổ chức */
  org_package?: OrgPackage
  /** ID của tổ chức */
  org_id?: string
  /** Thời gian tạo */
  createdAt?: string
  /** Thời gian cập nhật */
  updatedAt?: string
  /** Phiên bản */
  __v?: number
  /** Cấu hình của tổ chức */
  org_config?: OrgConfig
  /** Người dùng hiện tại */
  current_ms?: CurrentMS
}

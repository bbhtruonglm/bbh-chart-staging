/** Cấu hình Lead Form */
interface LeadFormField {
  /** Tên trường dữ liệu */
  field_name: string
  /** Tên trường số điện thoại */
  field_phone: string
  /** Tên trường địa chỉ */
  field_address: string
  /** Nội dung tin nhắn */
  message: string
  /** Tên trường email */
  field_email: string
  /** Tên trường ghi chú */
  field_note: string
  /** Tên nút gửi */
  field_submit: string
  /** Tên rút gọn của trường dữ liệu */
  short_name: string
  /** Tên rút gọn của trường số điện thoại */
  short_phone: string
  /** Tên rút gọn của trường ghi chú */
  short_note: string
  /** Tên rút gọn của trường địa chỉ */
  short_address: string
  /** Tên rút gọn của nút gửi */
  short_submit: string
  /** Tên rút gọn của trường email */
  short_email: string
  /** ID của cấu hình Lead Form */
  _id: string
}

/** Cấu hình của trang */
interface PageConfig {
  /** Môi trường sản xuất (production) */
  env_prod: boolean
  /** Cấu hình Lead Form */
  lead_form: LeadFormField
  /** ID của cấu hình trang */
  _id: string
}

/** Thông tin trang */
interface PageInfo {
  /** ID của thông tin trang */
  _id: string
  /** ID của trang Facebook */
  fb_page_id: string
  /** Phiên bản */
  __v: number
  /** Thời gian chờ để thay đổi nhân viên gán */
  change_assign_after: number
  /** Cấu hình của trang */
  config: PageConfig
  /** Thời gian tạo */
  createdAt: string
  /** Token của trang Facebook */
  fb_page_token: string
  /** Cho biết trang có đang dùng thử hay không */
  has_trial: boolean
  /** Cho biết trang có đang hoạt động hay không */
  is_active: boolean
  /** Cho biết có tự động gán nhân viên hay không */
  is_auto_assign_staff: boolean
  /** Cho biết có tự động thay đổi nhân viên gán hay không */
  is_auto_change_assign: boolean
  /** Cho biết có tự động ẩn bình luận hay không */
  is_auto_hide_comment: boolean
  /** Cho biết trang có bị chặn hay không */
  is_block: boolean
  /** Cho biết trang có bị vô hiệu hóa hay không */
  is_disable: boolean
  /** Cho biết có xóa dữ liệu trang hay không */
  is_has_remove_page_data: boolean
  /** Cho biết có ẩn dữ liệu nhân viên hay không */
  is_hide_staff_data: boolean
  /** Cho biết trang có phải trang ban đầu khi tạo tenant hay không */
  is_init_tenant: boolean
  /** Cho biết trang có phải là trang nội bộ hay không */
  is_internal: boolean
  /** Cho biết trang có phải là trang chưa khởi tạo của BBH hay không */
  is_not_init_bbh: boolean
  /** Cho biết trang có phải là trang ưu tiên hay không */
  is_priority: boolean
  /** Cho biết có quét tên hay không */
  is_scan_name: boolean
  /** Cho biết có chuyển giao nhân viên hay không */
  is_tranfer_staff: boolean
  /** Cho biết có sử dụng Persona ID hay không */
  is_use_persona_id: boolean
  /** Chỉ số nhân viên gán cuối cùng */
  last_assign_staff_index: number
  /** Giới hạn hoạt động */
  limit_activity: number
  /** Danh sách người dùng */
  list_user: any[]
  /** Tên của trang */
  name: string
  /** ID của trang */
  page_id: string
  /** Loại trang (ví dụ: FB_MESS, WHATSAPP) */
  type: string
  /** Token cập nhật */
  update_token: string
  /** Thời gian cập nhật */
  updatedAt: string
  /** Danh sách số điện thoại Whatsapp */
  whatsapp_phone_list: any[]
  /** Ngày kết thúc dùng thử */
  end_date_trial: number
  /** Tên gợi nhớ */
  alias?: string
}

interface StaffGroup {
  /** ID của nhóm nhân viên */
  _id: string
  /** ID của trang Facebook */
  fb_page_id: string
  /** ID của nhân viên Facebook */
  fb_staff_id: string
  /** Phiên bản */
  __v: number
  /** Số lượng thiết bị online */
  count_device_online: number
  /** Thời gian tạo */
  createdAt: string
  /** Trạng thái token Facebook */
  fb_token_status: boolean
  /** Danh sách ID của nhóm nhân viên */
  group_staff: string[]
  /** Trạng thái hoạt động */
  is_active: boolean
  /** Cho biết nhân viên có tự động được gán hay không */
  is_auto_assign: boolean
  /** Cho biết nhân viên có phải là nhân viên ưu tiên hay không */
  is_priority: boolean
  /** Cho biết nhân viên có phải là nhân viên phụ hay không */
  is_secondary_staff: boolean
  /** Tên của nhân viên */
  name: string
  /** Trạng thái online */
  online_status: boolean
  /** Vai trò của nhân viên */
  role: string
  /** Loại nhân viên (ví dụ: FB_MESS, WHATSAPP) */
  type: string
  /** Thời gian cập nhật */
  updatedAt: string
  /** Danh sách số điện thoại Whatsapp */
  whatsapp_phone_list: any[]
  /** ID của Persona trên Facebook Page */
  fb_page_persona_id?: string
}

interface WidgetAccessRole {
  /** Cho phép truy cập hồ sơ công khai */
  public_profile: boolean
  /** Cho phép truy cập tin nhắn cuộc hội thoại */
  conversation_message: boolean
  /** Cho phép truy cập liên hệ cuộc hội thoại */
  conversation_contact: boolean
  /** Cho phép truy cập nhãn cuộc hội thoại */
  conversation_label: boolean
  /** Cho phép truy cập ghi chú cuối cùng cuộc hội thoại */
  conversation_last_note: boolean
  /** Cho phép truy cập nhân viên cuộc hội thoại */
  conversation_staff: boolean
  /** Cho phép truy cập chatbot cuộc hội thoại */
  conversation_chatbot: boolean
  /** ID của quyền truy cập */
  _id: string
}

interface SnapApp {
  /** Trạng thái ứng dụng */
  status: string
  /** Số lần cài đặt */
  install_number: number
  /** Quyền truy cập */
  access_role: WidgetAccessRole
  /** ID của ứng dụng */
  _id: string
  /** Tên ứng dụng */
  name: string
  /** Website chính thức */
  website_offical: string
  /** Tên đối tác */
  partner_name: string
  /** URL của ứng dụng */
  url_app: string
  /** Mô tả ứng dụng */
  description: string
  /** Tài liệu ứng dụng */
  document: string
  /** Icon của ứng dụng */
  icon: string
  /** ID danh mục */
  category_id: string
  /** URL xác thực */
  url_auth: string
  /** Số điện thoại */
  phone: string
  /** Email */
  email: string
  /** ID của admin Facebook */
  fb_as_id: string
  /** Icon của đối tác */
  partner_icon: string
  /** Icon nhỏ của ứng dụng */
  mini_icon: string
  /** ID người tạo */
  user_created: string
  /** Khóa bí mật */
  secret_key: string
  /** Thời gian tạo */
  createdAt: string
  /** Thời gian cập nhật */
  updatedAt: string
  /** Phiên bản */
  __v: number
}

interface Widget {
  /** ID của widget */
  _id: string
  /** Trạng thái của widget */
  status: string
  /** Cho biết widget có đang hoạt động hay không */
  active_widget: boolean
  /** Vị trí của widget */
  position: string
  /** Chỉ mục vị trí */
  index_position: number
  /** Kích thước widget khi được cài đặt */
  app_installed_size: string
  /** Nhóm truy cập */
  access_group: string[]
  /** Quyền truy cập */
  access_role_select: WidgetAccessRole
  /** Ẩn trên PC */
  hide_pc: boolean
  /** ID của ứng dụng */
  app_id: string
  /** ID của trang Facebook */
  fb_page_id: string
  /** Ứng dụng snap */
  snap_app: SnapApp
  /** Thời gian tạo */
  createdAt: string
  /** Thời gian cập nhật */
  updatedAt: string
  /** Phiên bản */
  __v: number
}

/** dữ liệu trang đầy đủ */
export interface PageDataFull {
  /** thông tin trang */
  page?: PageInfo
  /** Nhân viên hiện tại */
  current_staff?: StaffGroup
  /** ID nhóm quản trị */
  group_admin_id?: string
  /** ID nhóm tất cả */
  group_all_id?: string
  /** Danh sách nhân viên */
  staff_list?: { [key: string]: StaffGroup }
  /** Danh sách Widget */
  widget_list?: Widget[]
}

/** dữ liệu của trang */
export interface PageData {
  /** ID của dữ liệu trang */
  _id?: string
  /** ID của tổ chức */
  org_id?: string
  /** ID của trang */
  page_id?: string
  /** Phiên bản */
  __v?: number
  /** Thời gian tạo */
  createdAt?: string
  /** Thời gian cập nhật */
  updatedAt?: string
  /** Thông tin trang */
  page_info?: PageInfo
}

export interface DetailMessage {
  /** id tổ chức */
  org_id?: string
  /** id trang */
  page_id?: string
  /** id người dùng */
  client_id?: string
  /** id nhân viên */
  staff_id?: string
  /** id nhãn */
  label_id?: string
  /** id bộ lọc */
  ad_id?: string
  /** sự kiện */
  event?: string
  /** loại tin nhắn */
  type?: 'system'
  /** giá trị */
  value?: 1
  /** Nội dung tin nhắn */
  data?: string
  /** Loại tin nhắn */
  message_type?: 'page' | 'client'
  /** Tên khách hàng */
  client_name?: string
  /** THời gian */
  timestamp?: string
  /** Nội dung tin nhắn sau khi parse */
  parsedData?: any
}

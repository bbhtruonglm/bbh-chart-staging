import { GeneralSettingInterface } from '@/interfaces/generalSetting'

interface SettingDisplay {
  /** Trạng thái hiển thị của ảnh đại diện khi phân công (có thể là "HIDE" hoặc "SHOW") */
  assign_avatar: 'HIDE' | 'SHOW'

  /** Trạng thái hiển thị của nhãn (có thể là "HIDE" hoặc "SHOW") */
  label: 'HIDE' | 'SHOW'

  /** ID của đối tượng display */
  _id: string
}

interface Setting {
  /** Cài đặt hiển thị liên quan đến phân công và nhãn */
  display: SettingDisplay

  /** Bộ lọc tùy chỉnh cho hội thoại (có thể chứa các điều kiện khác nhau, kiểu `any[]` có thể thay đổi nếu biết cấu trúc rõ ràng hơn) */
  custom_filter_conversation: any[]

  /** ID của đối tượng setting */
  _id: string
}

export interface Staff {
  /** ID của nhân viên trong hệ thống */
  _id: string

  /** ID nhân viên liên kết với tài khoản Facebook */
  fb_staff_id: string

  /** Phiên bản của tài liệu trong cơ sở dữ liệu (dùng để kiểm soát thay đổi) */
  __v: number

  /** Ngày giờ tạo tài khoản (ISO date string) */
  createdAt: string

  /** Tên đầy đủ của nhân viên */
  full_name: string

  /** Trạng thái của nhân viên có phải là quản trị viên hay không */
  is_admin: boolean

  /** Trạng thái token Facebook của nhân viên có bị lỗi hay không */
  is_die_token: boolean

  /** Trạng thái tải xuống của nhân viên có được phép hay không */
  is_download: boolean

  /** Trạng thái xác thực của tài khoản nhân viên */
  is_verify: boolean

  /** Danh sách các ID BM (Business Manager) liên kết với tài khoản Facebook */
  list_fb_bm_id: string[]

  /** Danh sách các trang Facebook mà nhân viên quản lý */
  list_page: string[]

  /** Cài đặt cá nhân của nhân viên */
  setting: Setting

  /** Ngày giờ cập nhật cuối cùng của tài khoản (ISO date string) */
  updatedAt: string

  /** ID người dùng liên kết với tài khoản nhân viên */
  user_id: string

  /** Vai trò của nhân viên trong hệ thống (có thể là "ADMIN", "MEMBER", hoặc "AFFILIATE") */
  role: 'ADMIN' | 'MEMBER' | 'AFFILIATE'

  /** Trạng thái tài khoản của nhân viên có bị vô hiệu hóa hay không */
  is_disable: boolean
}
/**
 * Interface cho dữ liệu cuộc trò chuyện
 */
interface Conversation {
  /** Loại cuộc trò chuyện, ví dụ: CHAT, CALL */
  conversation_type: string

  /** ID của khách hàng trên Facebook */
  fb_client_id: string

  /** ID của trang Facebook liên quan đến cuộc trò chuyện */
  fb_page_id: string

  /** Số phiên bản dữ liệu */
  __v: number

  /** Trạng thái khách hàng có bị chặn hay không */
  block_client: boolean

  /** Thời gian tạo cuộc trò chuyện (ISO 8601 format) */
  createdAt: string

  /** Trạng thái cuộc trò chuyện có được phân công lại hay không */
  is_re_assign: boolean

  /** Cuộc trò chuyện có bị đánh dấu là spam trên Facebook không */
  is_spam_fb: boolean

  /** Danh sách ID của các nhãn (labels) gắn vào cuộc trò chuyện */
  label_id: string[]

  /** Nội dung tin nhắn cuối cùng */
  last_message: string

  /** Thời gian của tin nhắn cuối cùng (timestamp UNIX) */
  last_message_time: number

  /** Loại tin nhắn cuối cùng, ví dụ: client, staff */
  last_message_type: string

  /** Danh sách ID của các bài đăng Facebook liên quan */
  list_fb_post_id: string[]

  /** Loại nền tảng, ví dụ: FB_MESS (Facebook Messenger) */
  platform_type: string

  /** Số lượng tin nhắn chưa đọc */
  unread_message_amount: number

  /** Thời gian cập nhật cuối cùng của cuộc trò chuyện (ISO 8601 format) */
  updatedAt: string

  /** Trạng thái có tin nhắn trong hộp thư đến của Facebook không */
  is_have_fb_inbox: boolean

  /** ID của tin nhắn cuối cùng đã đọc */
  last_read_message: string

  /** Thông tin đọc tin nhắn của nhân viên, với key là ID nhân viên và value là timestamp đọc */
  staff_read: Record<string, number>

  /** URL hoặc dữ liệu hình ảnh đại diện của khách hàng */
  client_avatar: string | null

  /** Tên của khách hàng */
  client_name: string

  /** Số điện thoại của khách hàng */
  client_phone: string

  /** Trạng thái khách hàng có bài đăng Facebook liên quan không */
  is_have_fb_post: boolean

  /** Thông tin chi tiết về khách hàng */
  client_bio: {
    /** UID của khách hàng trên Facebook */
    fb_uid: string

    /** Thông tin Facebook chi tiết của khách hàng */
    fb_info: {
      /** Công việc hiện tại */
      work: string

      /** Học vấn */
      education: string

      /** Thành phố hiện tại */
      current_city: string

      /** Quê quán */
      hometown: string

      /** Tình trạng mối quan hệ */
      relationship: string

      /** Ngày sinh của khách hàng */
      birthday: string

      /** Gợi ý bán hàng thêm */
      upsell: string

      /** Email liên hệ */
      email: string

      /** Website cá nhân */
      website: string

      /** Tên hiển thị của khách hàng */
      screenname: string

      /** Giới tính của khách hàng */
      gender: string

      /** Đại từ nhân xưng của khách hàng */
      pronouns: string

      /** Ngôn ngữ mà khách hàng sử dụng */
      languages: string
    }
  }

  /** Danh sách các nhãn tạm thời gắn vào cuộc trò chuyện */
  snap_label: string[]

  /** ID nhân viên Facebook phụ trách */
  fb_staff_id: string

  /** Thông tin chi tiết về nhân viên phụ trách */
  snap_staff: {
    /** Loại nền tảng của nhân viên */
    type: string

    /** Trạng thái token Facebook của nhân viên */
    fb_token_status: boolean

    /** Trạng thái tự động phân công nhân viên */
    is_auto_assign: boolean

    /** Nhóm nhân viên liên quan */
    group_staff: string[]

    /** Trạng thái trực tuyến của nhân viên */
    online_status: boolean

    /** Số lượng thiết bị trực tuyến của nhân viên */
    count_device_online: number

    /** Trạng thái hoạt động của nhân viên */
    is_active: boolean

    /** Trạng thái ưu tiên của nhân viên */
    is_priority: boolean

    /** Trạng thái quản lý quảng cáo của nhân viên */
    is_ads_manager: boolean

    /** Trạng thái nhân viên phụ trợ */
    is_secondary_staff: boolean

    /** ID hệ thống của nhân viên */
    _id: string

    /** ID trang Facebook liên quan */
    fb_page_id: string

    /** ID nhân viên Facebook */
    fb_staff_id: string

    /** Ngày tạo thông tin nhân viên (ISO 8601 format) */
    createdAt: string

    /** Tên của nhân viên */
    name: string

    /** Vai trò của nhân viên, ví dụ: MANAGE */
    role: string

    /** Ngày cập nhật thông tin nhân viên (ISO 8601 format) */
    updatedAt: string

    /** ID cá nhân Facebook của nhân viên */
    fb_page_persona_id: string
  }

  /** Email của khách hàng */
  client_email: string

  /** Cảm xúc của khách hàng, ví dụ: angry, happy */
  emotion: string

  /** ID của người dùng */
  user_id: string

  /** ID của tin nhắn cuối cùng */
  last_message_id: string
}

/**
 * Kiểu dữ liệu của một item
 */
type IItem = {
  accessorKey: string
  header: any
}
/**
 * Props của một item
 */
interface IItemPropCustoms {
  /**
   * Giá trị của item
   */
  value: IItem
  /**
   * Hàm được gọi khi rê chuột vào
   */
  handleMouseEnter?: (e: React.MouseEvent, text: string) => void
  /**
   * Hàm được gọi khi rê chuột ra
   */
  handleMouseLeave?: () => void
  /**
   * Hàm được gọi khi rê chuột vào
   */
  handleMouseEnterNoTruncated?: (e: React.MouseEvent, text: string) => void
  /**
   * Hàm xóa item
   */
  setItemDelete?: (item: any) => void
  /**
   * Hàm mở cảnh báo
   */
  setOpenWarning?: (open: boolean) => void
  /**
   * Hàm mở modal
   */
  setOnOpenModal?: (open: boolean) => void
  /**
   * Hàm thiết lập loại modal
   */
  setTypeModalTemplate?: (type: string) => void
  /**
   * Có thể kéo thả
   */
  useDragHandle?: boolean
  /**
   * Hàm cập nhật dữ liệu
   */
  setDataUpdate?: (data: IItem[]) => void
  /**
   * index của item
   */
  index_item
}
/**
 * Props của SortableList
 */
type SortableListProps = {
  /**
   * Danh sách các item
   */
  items: IItem[]
  /**
   *  Hàm được gọi khi sắp xếp xong
   * @param param0  oldIndex: vị trí cũ, newIndex: vị trí mới
   * @returns  void
   */
  onSortEnd: ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number
    newIndex: number
  }) => void
  /**
   * Hàm được gọi khi rê chuột vào
   */
  handleMouseEnter: (e: React.MouseEvent, text: string) => void
  /**
   * Hàm được gọi khi rê chuột ra
   */
  handleMouseLeave: () => void
  /**
   * Hàm được gọi khi rê chuột vào
   */
  handleMouseEnterNoTruncated: (e: React.MouseEvent, text: string) => void
  /**
   * Hàm xóa item
   */
  setItemDelete: (item: IItem) => void
  /**
   * Hàm mở cảnh báo
   */
  setOpenWarning: (open: boolean) => void
  /**
   * Hàm mở modal
   */
  setOnOpenModal: (open: boolean) => void
  /**
   * Hàm thiết lập loại modal
   */

  setTypeModalTemplate: (type: string) => void
  /**
   * Có thể kéo thả
   */
  draggable: boolean
  /**
   * Hàm cập nhật dữ liệu
   */
  setDataUpdate: (data: IItem[]) => void
}
/**
 * Interface của state app
 */
export interface AppState {
  /** access_token dùng để auth khi call, api lấy từ url */
  access_token: string
  /** danh sách id của các page cần được thống kê  */
  page_id: string[]
  /** id của tổ chức cần thống kê */
  org_id: string
  /** thông tin của người dùng */
  user_info: User

  /** Thông tin partner */
  partner_info: Retion

  /** danh sách dữ liệu trang */
  page_list: {
    /**
     * id của page
     */
    page_id: string
    /**
     * thông tin của page
     */
    page_info: {
      /**
       * tên của page
       */
      name: string
      /**
       * loại page
       */
      type: string
      /**
       * avatar của page
       */
      avatar?: string
    }
  }[]
  user_role?: string

  /** locale hiện tại */
  locale?: string

  /** page type */
  page_type?: string

  /** BM package */
  bm_package?: string

  /**
   * unread notification
   */
  unread_notification?: number
  /**
   * list notification
   */
  list_notification?: any[]
  /**
   * Root url
   */
  root_url?: string
  /**
   * drag & drop change
   */
  is_drag_drop_change?: boolean | null
  /**
   * setting global
   */
  setting_global?: GeneralSettingInterface
  /** data app */
  data_app?: any[]
  /**
   * Cho phép pin tài liệu
   */
  org_allow_agent_pin_data?: boolean
  /**
   * cho phép sử dụng prompt tài liệu
   */
  org_allow_agent_custom_prompt?: boolean
  /** List org */
  list_org?: Org[]
  /** Trạng thái tự động gửi tin */
  is_auto_messaging?: boolean
  /** Trạng thái tự động gửi kết bạn */
  is_auto_send_friend_request?: boolean
  /** User Page Role */
  user_page_role?: boolean
  /** Gói. bussiness */
  is_business?: boolean
}
/** Kiểu dữ liệu domain */
type TagType = {
  /** Domain */
  domain?: string
  /**
   * Trang thái
   */
  status?: 'CONNECTED' | 'NOT_CONNECTED'
}

export interface ConversationData {
  /** fb_client_id */
  fb_client_id: string
  /** fb_page_id */
  fb_page_id: string
  /** conversation_id */
  conversation_id: string
  /** conversation_name */
  __v: number
  /** block client */
  block_client: boolean
  /** client_name */
  client_name: string
  /** client_id */
  client_email?: string
  /** client phone */
  client_phone?: string
  /** conversation_type */
  conversation_type: 'CHAT' | string
  /** THời gian khởi tạo */
  createdAt: string
  /** Có tin nhắn fb không */
  is_have_fb_inbox: boolean
  /** Có bài post fb không */
  is_have_fb_post: boolean
  /** có được asign lại k */
  is_re_assign: boolean
  /** Có spam fb không */
  is_spam_fb: boolean
  /** ID nhãn */
  label_id: string[]
  /** Thống kê bài post */
  list_fb_post_id: string[]

  platform_type: 'WEBSITE' | string
  /** Nhân viên đã đọc */
  staff_read: Record<string, number>
  /** Tổng số tin nhắn đã đọc */
  unread_message_amount: number
  /** Thời gian cập nhật*/
  updatedAt: string
  /** TIn nhắn cuối */
  last_message: string
  /** ID tin nhắn cuối */
  last_message_id: string
  /** Thời gian tin nhắn cuối */
  last_message_time: number
  /** Loại tin nhắn cuối */
  last_message_type: 'page' | 'client' | string
  /** Cho pheps agent khoong*/
  is_allow_agent: boolean
  /**Cảm xúc */
  emotion?: 'happy' | 'sad' | 'angry' | 'calm' | string
  /** AI trả lời ? */
  ai_answer?: string
  /** Tên gốc */
  client_origin_name?: string
  /** Giới tính client */
  client_gender?: string
}
/** UID status */
export interface UIDStatus {
  /** UID */
  uid: string
  /** Status */
  status: {
    status_phone_conversion: 'PHONE_CONVERTED' | 'FAILED' | 'WAITING_CONVERSION'
    status_friend_addition: 'FRIEND_ADDED' | 'FAILED' | 'WAITING_CONVERSION'
  }
}

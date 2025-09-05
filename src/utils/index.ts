import _ from 'lodash'
import { format } from 'date-fns'
import { t } from 'i18next'

/** Hàm xóa dấu tiếng việt
 * @param str chuoịc xóa
 */
export const removeVietnameseTones = str => {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}
/**
 * Máp giá trị cảm xúc
 */
const EMOTION_MAP = {
  client_emotion_happy: 'client_emotion_happy',
  client_emotion_sad: 'client_emotion_sad',
  client_emotion_angry: 'client_emotion_angry',
  client_emotion_fear: 'client_emotion_fear',
  client_emotion_surprise: 'client_emotion_surprise',
  client_emotion_disgust: 'client_emotion_disgust',
  client_emotion_love: 'client_emotion_love',
  client_emotion_jealousy: 'client_emotion_jealousy',
  client_emotion_shame: 'client_emotion_shame',
  client_emotion_pride: 'client_emotion_pride',
  client_emotion_none: 'client_emotion_none',
  client_emotion_like: 'client_emotion_like',
}
/** Hàm xử lý cảm xúc
 * @param emotion giá trị cảm xúc
 */
export const renderEmotion = (emotion: string) => {
  return t(EMOTION_MAP[emotion] || 'client_emotion_none')
}

/** Emotion key map */
const EMOTION_KEY_MAP = {
  '😊 Vui vẻ': 'client_emotion_happy',
  '😊 Happy': 'client_emotion_happy',
  '😢 Buồn bã': 'client_emotion_sad',
  '😢 Sad': 'client_emotion_sad',
  '😱 Sợ hãi': 'client_emotion_fear',
  '😱 Fear': 'client_emotion_fear',
  '😡 Giận dữ': 'client_emotion_angry',
  '😡 Angry': 'client_emotion_angry',
  '😲 Ngạc nhiên': 'client_emotion_surprise',
  '😲 Surprise': 'client_emotion_surprise',
  '🤢 Ghê tởm': 'client_emotion_disgust',
  '🤢 Disgust': 'client_emotion_disgust',
  '❤️ Yêu thương': 'client_emotion_love',
  '❤️ Love': 'client_emotion_love',
  '😒 Ghen tị': 'client_emotion_jealousy',
  '😒 Jealousy': 'client_emotion_jealousy',
  '😳 Xấu hổ': 'client_emotion_shame',
  '😳 Shame': 'client_emotion_shame',
  '😌 Tự hào': 'client_emotion_pride',
  '😌 Pride': 'client_emotion_pride',
  '🤔 Không rõ': 'client_emotion_none',
  '🤔 Unknown': 'client_emotion_none',
  '👍 Thích': 'client_emotion_like',
  '👍 Like': 'client_emotion_like',
}

/**
 *  Hàm xử lý cảm xúc
 * @param emotion giá trị cảm xúc
 * @returns
 */
export const renderKeyEmotion = (emotion: string) => {
  return EMOTION_KEY_MAP[emotion] || 'client_emotion_none'
}

/** Máp giá trị sản phẩm */
const ACTION_MAP = {
  product_quality: 'product_quality',
  delivery_issues: 'delivery_issues',
  customer_service: 'customer_service',
  pricing_concerns: 'pricing_concerns',
  technical_issues: 'technical_issues',
  refund_request: 'refund_request',
  other: 'other',
}

/** Hàm xử lý hành động
 * @param action giá trị hành động
 */
export const renderAction = (action: string) => {
  return t(ACTION_MAP[action] || 'other')
}
/**
 * Máp giá trị hành động
 */
const ACTION_KEY_MAP = {
  'Chất lượng sản phẩm': 'product_quality',
  'Product Quality': 'product_quality',
  'Giao hàng': 'delivery_issues',
  'Delivery Issues': 'delivery_issues',
  'Dịch vụ khách hàng': 'customer_service',
  'Customer Service': 'customer_service',
  Giá: 'pricing_concerns',
  'Pricing Concerns': 'pricing_concerns',
  'Kỹ thuật': 'technical_issues',
  'Technical Issues': 'technical_issues',
  'Hoàn tiền': 'refund_request',
  'Refund Request': 'refund_request',
  Khác: 'other',
  Other: 'other',
}

/**
 *  Hàm xử lý hành động
 * @param action giá trị hành động
 * @returns
 */
export const renderKeyAction = (action: string) => {
  return ACTION_KEY_MAP[action] || 'other'
}
/**
 * Máp giá trị hành động
 */
const SUGGESTED_MAP = {
  apologize_customer: 'apologize_customer',
  improve_support: 'improve_support',
  investigate_issue: 'investigate_issue',
  update_customer: 'update_customer',
  enhance_training: 'enhance_training',
  maintain_quality: 'maintain_quality',
  other: 'other',
}
/**
 *  Hàm xử lý hành động
 * @param action  giá trị hành động
 * @returns
 */
export const renderSuggest = (action: string) => {
  return t(SUGGESTED_MAP[action] || 'other')
}
/**
 * Máp giá trị hành động
 */
const SUGGEST_KEY_MAP = {
  'Xin lỗi khách hàng': 'apologize_customer',
  'Cải thiện dịch vụ CSKH': 'improve_support',
  'Điều tra nguyên nhân vấn đề': 'investigate_issue',
  'Cập nhật đơn hàng': 'update_customer',
  'Đào tạo lại nhân sự': 'enhance_training',
  'Nâng cao chất lượng sản phẩm': 'maintain_quality',
  Khác: 'other',
}
/**
 *  Hàm xử lý hành động
 * @param action giá trị hành động
 * @returns
 */
export const renderKeySuggest = (action: string) => {
  return SUGGEST_KEY_MAP[action] || 'other'
}

/**
 *  Hàm xử lý hành động
 * @param action
 * @returns
 */
export const renderTypeSuggest = (action: string) => {
  return action === 'action_required_false'
    ? 'Không cần hành động'
    : 'Cần hành động'
}

/** Tag map */
const TAG_MAP = {
  client_positive: 'Tích cực',
  client_neutral: 'Trung lập',
  client_negative: 'Tiêu cực',
}
/**
 *  Hàm xử lý tag
 * @param key
 * @returns
 */
export const renderTag = key => TAG_MAP[key] || 'Không xác định'

/** Render conversation tag */
export const renderConversationTag = key => {
  return t(key)
}
/** Path map */
const PATH_MAP = {
  '/dashboard': 'overview',
  '/page': 'page',
  '/staff': 'staff',
  '/ads': 'ads',
  '/tags': 'tags',
  '/emotional': 'emotional',
}
/** Hàm xử lý tên trang hiện tại */
export const renderPathName = key => {
  return t(PATH_MAP[key] || 'overview')
}

/**
 *  Hàm xử lý width size
 * @param index
 * @param value
 * @param size
 * @returns
 */
export function getWidthSize(index, value, size) {
  if (typeof window !== 'undefined' && window.innerWidth < 768 && index === 0) {
    if (value === 'action') return 180
    if (value === 'ads_id_column') return 150
    if (value === 'staff_id_column') return 135
  } else if (
    typeof window !== 'undefined' &&
    window.innerWidth >= 768 &&
    index === 0
  ) {
    return size
  }
  return size
}

/** Hàm xử lý thời gian
 * @param times
 * @param format_str
 */
export function formatDateTimeZones(times, format_str) {
  /** Parse the input time (assumed to be in UTC) */
  const UTC_DATE = new Date(times + 'Z')

  /** Convert to UTC+7 by adding 7 hours */
  const TIMEZONE_OFFSET = 7 * 60 * 60 * 1000
  /**
   *  Xử lý thời gian
   */
  const ADJUSTED_DATE = new Date(UTC_DATE.getTime() + TIMEZONE_OFFSET)
  /** Giờ */
  const HOURS = String(ADJUSTED_DATE.getUTCHours()).padStart(2, '0')
  /** Phút */
  const MINUTES = String(ADJUSTED_DATE.getUTCMinutes()).padStart(2, '0')
  /** Ngày */
  const DAY = String(ADJUSTED_DATE.getUTCDate()).padStart(2, '0')
  /** Tháng */
  const MONTH = String(ADJUSTED_DATE.getUTCMonth() + 1).padStart(2, '0')
  /** Năm */
  const YEAR = ADJUSTED_DATE.getUTCFullYear()
  /** Replace the format with the adjusted values */
  return format_str
    .replace('HH', HOURS)
    .replace('mm', MINUTES)
    .replace('dd', DAY)
    .replace('MM', MONTH)
    .replace('yyyy', YEAR)
}

/**
 *  Hàm xử lý thời gian
 * @param date_string
 * @returns
 */
export function formatDateTime(date_string: string): string {
  /**
   * Tạo date từ chuỗi thời gian
   */
  const DATE = new Date(date_string)
  /**
   * Xử lý thời gian
   */
  return format(DATE, 'HH:mm dd/MM/yyyy ')
}
/**
 * Base url
 */
export const BASE_URL = import.meta.env.VITE_BASE_URL || '/'
/**
 *  Hàm xử lý render routes
 * @param path
 * @returns
 */
export const renderRoutes = path => `${BASE_URL}${path}`.replace(/\/\/+/, '/')

/**
 *  Hàm xử Formats a number with commas
 * @param value
 * @param return_value
 * @returns
 */
export const formatWithCommas = (
  value: string | number,
  return_value?: boolean,
) => {
  /**
   * Nếu giá trị không tồn tại thì trả về 0 hoặc '-'
   */
  if (!value) return return_value ? '0' : '-'
  /**
   * Chuyển giá trị thành chuỗi, sau đó chuyển dấu phẩy vào dấu chấm
   */
  const NUM_VALUE = parseFloat(value.toString().replace(/\,/g, ''))
  /**
   * Nếu giá trị không phải là số thì trả về chuỗi rỗng
   */
  if (isNaN(NUM_VALUE)) return ''
  /**
   * Trả về giá trị
   */
  return NUM_VALUE.toLocaleString('en-US')
}
/**
 * Hàm sao chép văn bản vào clipboard và hiển thị thông báo thành công
 * @param text Văn bản cần sao chép
 * @param onError Callback khi sao chép thất bại (tùy chọn)
 */
export function copyToClipboard(text: string, onError?: (error: any) => void) {
  /** Kiểm tra nếu trình duyệt hỗ trợ Clipboard API */
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showSuccessMessage('Đã sao chép thành công!')
      })
      .catch(error => {
        console.error('Lỗi khi sao chép:', error)
        onError && onError(error)
      })
  } else {
    /** Trường hợp trình duyệt không hỗ trợ Clipboard API, sử dụng phương pháp cũ */
    try {
      /** Định nghĩa textArea ở đây */
      const TEXT_AREA = document.createElement('textarea')
      /**
       * Gán giá trị text vào textArea
       */
      TEXT_AREA.value = text
      /** Đảm bảo phần tử này không hiển thị trên màn hình */
      TEXT_AREA.style.position = 'fixed'
      /**
       * Đảm bảo phần tử này không hiển thị tr
       */
      TEXT_AREA.style.opacity = '0'
      /**
       * Thêm textArea vào body
       */
      document.body.appendChild(TEXT_AREA)
      /**
       * Focus vào textArea
       */
      TEXT_AREA.focus()
      /**
       * Chọn toàn bộ văn bản trong textArea
       */
      TEXT_AREA.select()
      /**
       * Thử sao chép văn bản vào clipboard
       */
      const SUCCESSFUL = document.execCommand('copy')
      /**
       * Kiểm tra xem sao chép có thành công không
       */
      if (SUCCESSFUL) {
        /**
         * Hiển thị thông báo thành công
         */
        showSuccessMessage('Đã sao chép thành công!')
      } else {
        throw new Error('Không thể sao chép')
      }
    } catch (error) {
      console.error('Lỗi khi sao chép:', error)
      onError && onError(error)
    } finally {
      /** Kiểm tra nếu textArea đã được thêm vào DOM thì xóa nó đi */
      const TEXT_ARE = document.querySelector('textarea')
      /**
       * Kiểm tra nếu textArea đã được thêm vào DOM thì xóa nó đi
       */
      if (TEXT_ARE) {
        document.body.removeChild(TEXT_ARE)
      }
    }
  }
}
/**
 * Hàm hiển thị thông báo thành công dạng absolute
 * @param message Nội dung thông báo
 */
function showSuccessMessage(message: string) {
  /**
   * Tạo element div để chứa thông báo
   */
  const MESSAGE_ELEMENT = document.createElement('div')
  /**
   * Thêm style cho element
   */
  MESSAGE_ELEMENT.textContent = message
  MESSAGE_ELEMENT.style.position = 'absolute'
  MESSAGE_ELEMENT.style.bottom = '20px'
  MESSAGE_ELEMENT.style.right = '20px'
  MESSAGE_ELEMENT.style.backgroundColor = '#4caf50'
  MESSAGE_ELEMENT.style.color = '#fff'
  MESSAGE_ELEMENT.style.padding = '10px 20px'
  MESSAGE_ELEMENT.style.borderRadius = '5px'
  MESSAGE_ELEMENT.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'
  MESSAGE_ELEMENT.style.zIndex = '1000'
  MESSAGE_ELEMENT.style.transition = 'opacity 0.5s'
  /**
   * Thêm element vào body
   */
  document.body.appendChild(MESSAGE_ELEMENT)

  /** Tự động ẩn sau 3 giây */
  setTimeout(() => {
    /**
     * Thay đổi opacity của element để ẩn đi
     */
    MESSAGE_ELEMENT.style.opacity = '0'
    setTimeout(() => {
      /**
       * Xóa element khỏi DOM
       */
      document.body.removeChild(MESSAGE_ELEMENT)
    }, 500)
  }, 2000)
}

interface StaffEvent {
  event_count: string
  total_value: number
}

interface StaffData {
  [key: string]: StaffEvent | undefined
}

interface AllStaffData {
  [staffId: string]: StaffData
}

interface Summary {
  staff_miss_call_in_hours: number
  staff_miss_call_out_hours: number
  staff_miss_response_in_hours: number
  staff_miss_response_out_hours: number
}

const fieldsToSum: (keyof Summary)[] = [
  'staff_miss_call_in_hours',
  'staff_miss_call_out_hours',
  'staff_miss_response_in_hours',
  'staff_miss_response_out_hours',
]

export const aggregateStaffData = (data: AllStaffData): Summary => {
  return _.reduce(
    data,
    (summary, staffData) => {
      _.forEach(fieldsToSum, field => {
        const value = _.get(staffData, [field, 'total_value'], 0) as number
        summary[field] += value
      })
      return summary
    },
    {
      staff_miss_call_in_hours: 0,
      staff_miss_call_out_hours: 0,
      staff_miss_response_in_hours: 0,
      staff_miss_response_out_hours: 0,
    } as Summary,
  )
}

// utils/fetchApi.ts
import { fetchFunction } from '@/api/fetchApi'

interface FetchApiProps {
  dispatch: any
  /** Tên action Redux, ví dụ: 'readEvent' */
  type: string
  /** Payload gửi API */
  body: Record<string, any>
  /** Endpoint API */
  endpoint: string
  /** Hàm notify thông báo lỗi/thành công */
  notify?: (msg?: string) => void
  /** Ngăn không gọi redux loading */
  preventLoading?: boolean
  /** Số bản ghi mỗi lần gọi API */
  pageSize?: number
  /** true => Crawl toàn bộ dữ liệu */
  fetchAll?: boolean
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Gọi API lấy dữ liệu có phân trang, hỗ trợ crawl toàn bộ dữ liệu nếu cần
 * @template T Kiểu dữ liệu trả về
 * @returns Promise<T[]>
 */
export async function fetchApi<T>({
  dispatch,
  type,
  body,
  endpoint = 'app/analytic/read_event',
  notify = () => {},
  preventLoading = false,
  pageSize = 50,
  fetchAll = true,
}: FetchApiProps): Promise<T[]> {
  /** Skip */
  let skip = 0
  /** Kết quả trả về */
  const RESULTS: T[] = []

  try {
    /** Bật loading Redux nếu cần */
    if (!preventLoading) {
      dispatch({ type: `${type}_LOADING`, payload: true })
    }

    while (true) {
      /**
       * Tạo payload cho lần gọi API
       */
      const REQUEST_BODY = {
        ...body,
        limit: pageSize,
        skip,
      }

      /**
       * Gọi API lấy dữ liệu trang hiện tại
       */
      const PAGE_DATA: T[] = await fetchFunction(
        dispatch,
        type,
        REQUEST_BODY,
        endpoint,
        () => {},
        true,
      )

      // Trường hợp API trả dữ liệu không hợp lệ
      if (!Array.isArray(PAGE_DATA)) {
        console.warn(`API [${endpoint}] không trả về mảng dữ liệu`)
        break
      }

      /**
       * Push dữ liệu mới vào RESULTS
       */
      RESULTS.push(...PAGE_DATA)

      /**
       * Nếu không cần lấy tất cả => thoát luôn sau lần gọi đầu tiên
       */
      if (!fetchAll) {
        break
      }

      /**
       * Nếu số bản ghi nhỏ hơn pageSize => hết dữ liệu => dừng crawl
       */
      if (PAGE_DATA.length < pageSize) {
        break
      }

      /**
       * Tăng skip để gọi trang tiếp theo
       */
      skip += pageSize

      /**
       * Thêm delay 300ms để tránh bị rate-limit
       */
      await delay(300)
    }
    /** Tra ve */
    return RESULTS
  } catch (error: any) {
    console.error('Fetch API error:', error)
    notify(error?.response?.data?.message || 'Lỗi khi gọi API')
    return []
  } finally {
    /** Tắt loading Redux nếu cần */
    if (!preventLoading) {
      dispatch({ type: `${type}_LOADING`, payload: false })
    }
  }
}

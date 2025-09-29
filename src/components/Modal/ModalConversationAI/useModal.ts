import { HOST, fetchFunction } from '@/api/fetchApi'
import { extractJsonFromMarkdown, handleResponseData } from '@/utils'
import { selectPageList, selectStaffList } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

export function useModal({ is_open, body, onClose }) {
  /** Trạng thái loading */
  const [loading, setLoading] = useState(false)
  /** Dispatch */
  const dispatch = useDispatch()

  /** Dữ liệu cho bảng */
  const [data_table, setDataTable] = useState([])

  /** Số mục hiển thị mặc định trên mỗi trang */
  const [items_per_page, setItemsPerPage] = useState(20)
  /** Trang hiện tại */
  const [current_page, setCurrentPage] = useState(1)
  /** next page */
  const [is_next_page, setIsNextPage] = useState(true)
  /** Skip */
  const [skip, setSkip] = useState(0)
  /** danh sách page khi đã chọn tổ chức */
  const PAGE_LIST = useSelector(selectPageList)
  /**  Lấy tên của page
   * @param id id của page
   * @returns tên của page
   */
  function getNamePage(id: string): string {
    /** Tìm đối tượng có page_id khớp với id đầu vào */
    const PAGE = PAGE_LIST.find(item => item?.page_id === id)

    /** Kiểm tra xem page có tồn tại hay không, nếu có trả về tên, nếu không trả về null hoặc thông báo */
    return PAGE ? PAGE?.page_info.name : id
  }
  /**
   * Gọi api gồm:
   * -dispatch : hàm để gọi đến redux
   * -type: readEvent
   * -body: body từ đầu vào từ modal
   * -endpoint: endpoint trên API
   * -function: hàm xử lý notify // hoặc truyền vào function rỗng
   * -preventLoading: Ngăn không gọi loading trên redux
   */
  const fetchApi = async () => {
    /**
     * Set loading
     */
    setLoading(true)
    /**
     * Gọi API
     */
    const RESULT = await fetchFunction(
      dispatch,
      'readEvent',
      (body = { ...body, limit: items_per_page, skip }),
      'app/analytic/read_event',
      () => {},
      true,
    )
    /**
     * Set loading
     */
    setLoading(false)
    /**
     * Nếu không có dữ liệu thì return
     */
    if (RESULT.length < items_per_page) {
      /**
       * Không còn trang nào
       */
      setIsNextPage(false)
    } else {
      /**
       * Còn trang
       */
      setIsNextPage(true)
    }
    /**
     * Set dữ liệu vào bảng
     */
    setDataTable(RESULT)
  }
  /** Đóng modal khi click ra ngoài modal
   * @param e sự kiện click chuột
   */
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    /**
     * Nếu click ra ngoài thì đóng modal
     */
    if (e.target === e.currentTarget) {
      /**
       * Đóng modal
       */
      onClose()
    }
  }
  /** Mở sang tab chi tiết tin nhắn
   * @param row thông tin hàng
   */
  const handleClick = row => {
    /** Lấy page_id */
    const PAGE_ID = row?.cell?.row?.original.page_id
    /** Lấy user_id */
    const CLIENT_ID = row?.cell?.row?.original.client_id

    /** Lấy URL hiện tại */
    const CURRENT_URL = window.location.href

    /** HOST botbanhang */
    const HOST_URL = `${HOST['chatbox_v2']}/chat`

    /** Host retion */
    const HOST_URL_RETION = `${HOST['root_domain']}/chat`

    /** Xây dựng URL  đến trang chatbox */
    const PATH = `?page_id=${PAGE_ID}&user_id=${CLIENT_ID}`

    if (CLIENT_ID) {
      /** Mở URL trong tab mới */
      window.open(
        CURRENT_URL?.includes(HOST['root']) ||
          CURRENT_URL?.includes('localhost')
          ? HOST_URL_RETION + PATH
          : HOST_URL + PATH,
        '_blank',
      )
    }
  }

  /**   Xử lý khi chuyển trang
   * @param page số trang
   */
  const handlePageChange = page => {
    /** set skip tương ứng với số trang */
    setSkip((page - 1) * items_per_page)
    /** set trang hiện tại */
    setCurrentPage(page)
  }

  /** Xử lý khi thay đổi số mục hiển thị trên mỗi trang
   * @param new_per_page số mục hiển thị trên mỗi trang
   */
  const handlePerPageChange = new_per_page => {
    /** Set số lượng hiển thị trên 1 trang */
    setItemsPerPage(new_per_page)
    /** set lại về trang 1 */
    setSkip(0)
  }

  /** Parse tất cả các trường `data` từ mảng JSON */
  const PARSED_DATA = useMemo(() => {
    /**
     * Parse tất cả các trường `data` từ mảng JSON
     */
    return data_table.map(item => {
      /** Parse data */
      const PARSED = JSON.parse(item?.data || '{}')

      // const DATA = extractJsonFromMarkdown(
      //   PARSED.candidates[0]?.content?.parts[0]?.text,
      // )

      console.log(PARSED, 'parsed')

      return {
        ...item,
        /** Parse trường `data` và thêm vào parsedText */
        parsedText:
          PARSED?.candidates?.[0]?.content?.parts?.[0]?.text ??
          PARSED?.response,
        aiAsking: PARSED?.candidates?.[0]?.content?.parts?.[0]?.text
          ? '-'
          : PARSED?.text,
        // parsedText: JSON.stringify(DATA),
        /** Parse trường `data` và thêm vào parsedText */
        parsedClientName: PARSED?.client_name,
        /** Parse trường `data` và thêm vào parsedText */
        parsedMessageType: PARSED?.message_type,

        totalTokenCount: item?.value,
        candidatesTokenCount: PARSED?.usageMetadata?.candidatesTokenCount || 0,
        promptTokenCount: PARSED?.usageMetadata?.promptTokenCount || 0,
        thoughtsTokenCount: PARSED?.usageMetadata?.thoughtsTokenCount || 0,
      }
    })
  }, [data_table])

  useEffect(() => {
    /**
     * Nếu không có dữ liệu thì gọi api
     */
    if (!body.length) fetchApi()
  }, [body, items_per_page, current_page])

  useEffect(() => {
    if (!is_open) return

    /** Đóng modal khi nhấn phím Esc
     * @param event sự kiện bàn phím
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      /**
       * Nếu phím nhấn là `Escape` thì đóng modal
       */
      if (event.key === 'Escape') {
        /**
         * Đóng modal
         */
        onClose()
      }
    }
    /**
     * Lắng nghe sự kiện bàn phím
     */
    document.addEventListener('keydown', handleKeyDown)
    /**
     * Cleanup khi component bị unmount
     */
    return () => {
      /**
       * Xóa sự kiện bàn phím
       */
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [is_open])

  return {
    loading,
    current_page,
    items_per_page,
    is_next_page,
    data_table,
    PARSED_DATA,
    handleClick,
    getNamePage,
    handlePageChange,
    handlePerPageChange,
    handleClickOutside,
  }
}

import ChevronLeft from '@/assets/icons/ChevronLeft'
import ChevronRight from '@/assets/icons/ChevronRight'
import { t } from 'i18next'
import { useState } from 'react'

const Pagination = ({
  items_per_page,
  onPageChange,
  onPerPageChange,
  current_page_parent,
  is_next_page,
  is_loading,
}) => {
  /**
   * State lưu trữ trang hiện tại
   */
  const [current_page, setCurrentPage] = useState(current_page_parent)
  /**
   * State lưu trữ số lượng mục hiển thị trên mỗi trang
   */
  const [per_page, setPerPage] = useState(items_per_page)

  /** Xử lý chuyển trang trước */
  const handlePrevious = () => {
    /** đến trang 1 thì dừng không cho bấm 8? */
    if (current_page > 1) {
      /**
       * Xử lý chuyển trang trước
       */
      setCurrentPage(current_page - 1)
      /**
       * Gọi hàm chuyển trang
       */
      onPageChange(current_page - 1)
    }
  }
  /**  Xử lý chuyển trang sau */
  const handleNext = () => {
    /** còn data thì cho next */
    if (is_next_page) {
      /**
       * Xử lý chuyển trang sau
       */
      setCurrentPage(current_page + 1)
      /**
       * Gọi hàm chuyển trang
       */
      onPageChange(current_page + 1)
    }
  }
  /** Đổi số trang hiển thị
   * @param e sự kiện thay đổi
   */
  const handlePerPageChange = (e) => {
    /** lấy số lượng mục hiển thị trên mỗi trang */
    const NEW_PER_PAGE = parseInt(e.target.value)
    /** set lại số lượng mục hiển thị trên mỗi trang */
    setPerPage(NEW_PER_PAGE)
    /** gọi hàm chuyển trang */
    onPerPageChange(NEW_PER_PAGE)
    /** Reset lại về trang đầu tiên khi thay đổi số lượng trên mỗi trang */
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-row items-center justify-end p-1 gap-5">
      {/* Chọn trang */}
      <div className="flex justify-between items-center gap-2">
        <button
          onClick={handlePrevious}
          /** Khi loading không cho spam */
          disabled={current_page === 1 || is_loading}
          className="rounded disabled:opacity-50"
        >
          <ChevronLeft />
        </button>

        <div className=" bg-blue-700 py-0.5 px-2 rounded-md text-white text-sm font-medium">
          {current_page}
        </div>

        <button
          onClick={handleNext}
          /** Khi loading thì k cho spam */
          disabled={!is_next_page || is_loading}
          className="  rounded disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
      {/* Chọn số lượng mục hiển thị trên mỗi trang */}
      <div className="flex items-center h-9 w-32 ">
        <select
          id="per_page"
          value={per_page}
          onChange={handlePerPageChange}
          className="border flex h-9 rounded px-2 py-1 w-full text-sm"
        >
          <option value={20}>20 / {t('_page')}</option>
          <option value={30}>30 / {t('_page')}</option>
          <option value={50}>50 / {t('_page')}</option>
        </select>
      </div>
    </div>
  )
}

export default Pagination

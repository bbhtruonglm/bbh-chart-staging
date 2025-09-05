// hooks/useModalEffects.ts
import { useEffect } from 'react'

/**
 * Hook xử lý hiệu ứng khi mở/đóng modal:
 * - Vô hiệu hoá scroll khi modal mở
 * - Đóng modal khi nhấn phím Escape
 *
 * @param is_open - Trạng thái mở/đóng modal
 * @param onClose - Hàm callback khi đóng modal
 */
export const useModalEffects = (is_open: boolean, onClose: () => void) => {
  /**
   * Thêm / xoá class no-scroll vào <body> khi mở/đóng modal
   */
  /**
   * useEffect hook để theo dõi thay đổi của biến is_open.
   * Khi is_open thay đổi, sẽ thực hiện logic bên trong hàm này.
   */
  useEffect(() => {
    /**
     * Kiểm tra xem is_open có giá trị true hay false.
     * Nếu is_open là true, thêm lớp 'no-scroll' vào thẻ body.
     */
    if (is_open) {
      /**
       * Thêm lớp 'no-scroll' vào thẻ body.
       */
      document.body.classList.add('no-scroll')
    } else {
      /**
       * Nếu is_open là false, loại bỏ lớp 'no-scroll' khỏi thẻ body.
       */
      document.body.classList.remove('no-scroll')
    }

    /**
     * Hàm trả về này sẽ được gọi khi component bị unmount
     * hoặc trước khi chạy lại useEffect lần tiếp theo.
     * Nó đảm bảo rằng lớp 'no-scroll' sẽ được loại bỏ
     * khi component không còn được sử dụng.
     */
    return () => {
      /**
       * Loại bỏ lớp 'no-scroll' khỏi thẻ body.
       */
      document.body.classList.remove('no-scroll')
    }
    /** useEffect sẽ được chạy lại khi is_open thay đổi. */
  }, [is_open])

  /**
   * Lắng nghe phím ESC để đóng modal
   */
  useEffect(() => {
    /** Handle key down */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    /** Lắng nghe phím */
    document.addEventListener('keydown', handleKeyDown)

    /** Cleanup khi unmount */
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])
}

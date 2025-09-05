import { clearNotification } from '@/stores/notifySlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
/** Custom hooks xử lý hiển thị toast message */
const useNotify = (notify) => {
  /**
   * Sử dụng useDispatch để gọi action
   */
  const dispatch = useDispatch()
  /**
   * Effect chạy khi notify thay đổi
   */
  useEffect(() => {
    /** Kiểm tra nếu có message */
    if (notify?.message) {
      /**
       * Hiển thị toast message
       */
      if (notify.type === 'error') {
        /**
         * Hiển thị loại error
         */
        toast.error(notify.message, { position: 'top-right' })
        /**
         * Hiển thị loại success
         */
      } else if (notify.type === 'success') {
        /**
         * Hiển thị loại success
         */
        toast.success(notify.message, { position: 'top-right' })
        /**
         * Hiển thị loại warning
         */
      } else {
        /** Mặc định dùng loại info nếu không có type */
        toast.info(notify.message, { position: 'top-right' })
      }

      /** Sau khi hiển thị thông báo, reset lại thông báo trong store */
      dispatch(clearNotification())
    }
  }, [notify, dispatch])
}

export default useNotify

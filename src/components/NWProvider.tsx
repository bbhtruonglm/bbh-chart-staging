import { ReactNode, createContext, useEffect, useState } from 'react'
/**
 * NetworkContext
 */
export const NetworkContext = createContext<{
  /**
   * Trạng thái kết nối mạng
   */
  is_online: boolean
  /**
   * Hiển thị show Reconnect
   */
  show_reconnect: boolean
}>({
  is_online: true,
  show_reconnect: false,
})

interface NetworkProviderProps {
  /**
   * Children components
   */
  children: ReactNode
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  /**
   * Trạng thái kết nối mạng
   */
  const [is_online, setIsOnline] = useState(navigator.onLine)
  /**
   * Hiển thị show Reconnect
   */
  const [show_reconnect, setShowReconnect] = useState(false)
  /**
   * Lắng nghe sự kiện online và offline
   */
  useEffect(() => {
    /**
     * Timeout id
     */
    let timeout_id: NodeJS.Timeout | null = null

    /**
     *
     * hàm xử lý khi online
     * @returns
     */
    const handleOnline = () => {
      /**
       * Set trạng thái online
       */
      setIsOnline(true)
      /**
       * Hiển thị show reconnect
       */
      setShowReconnect(true)
      /**
       * Nếu timeout_id tồn tại thì hủy timeout
       */
      timeout_id = setTimeout(() => {
        /**
         * Ẩn show reconnect
         */
        setShowReconnect(false)
      }, 3000)
    }
    /**
     *  hàm xử lý khi offline
     * @returns
     */
    const handleOffline = () => setIsOnline(false)
    /**
     * Lắng nghe sự kiện online
     */
    window.addEventListener('online', handleOnline)
    /**
     * Lắng nghe sự kiện offline
     */
    window.addEventListener('offline', handleOffline)

    /**
     * Hủy lắng nghe sự kiện online và offline
     */
    return () => {
      /**
       * Nếu timeout_id tồn tại thì hủy timeout
       */
      if (timeout_id) clearTimeout(timeout_id)
      /**
       * Hủy lắng nghe sự kiện online
       */
      window.removeEventListener('online', handleOnline)
      /**
       * Hủy lắng nghe sự kiện offline
       */
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <NetworkContext.Provider value={{ is_online, show_reconnect }}>
      {children}
    </NetworkContext.Provider>
  )
}

import { useEffect, useRef, useState } from 'react'

import ReactDOM from 'react-dom'

/** Define TooltipState type */
export interface TooltipState {
  /**
   * Nội dung của tooltip
   */
  content: string
  /**
   * Hiển thị tooltip
   */
  visible: boolean
  /**
   * Vị trí hiển thị tooltip
   */
  position: { x: number; y: number }
  /**
   * Index
   */
  index?: number
}
function TooltipTable({ content, visible, position }: TooltipState) {
  /**
   * Ref để lấy DOM của tooltip
   */
  const TOOLTIP_REF = useRef(null)
  /**
   * Trạng thái vị trí tooltip
   */
  const [tooltip_position, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    /** Kiểm tra nếu tooltip cần hiển thị và ref của tooltip đã được gán */
    if (visible && TOOLTIP_REF.current) {
      /** Lấy chiều cao của tooltip từ DOM */
      const TOOLTIP_HEIGHT = TOOLTIP_REF.current.offsetHeight

      /** Lấy chiều rộng của tooltip từ DOM */
      const TOOLTIP_WIDTH = TOOLTIP_REF.current.offsetWidth

      /** Tính toán vị trí trên (top) của tooltip sao cho nó nằm phía trên cell
       * 'position.y' là vị trí y của cell, trừ đi chiều cao của tooltip và thêm khoảng cách nhỏ (10px)
       */
      const ADJUSTED_TOP = position.y - TOOLTIP_HEIGHT - 10

      /** Tính toán vị trí bên trái (left) của tooltip sao cho nó nằm ở giữa cell
       * 'position.x' là vị trí x của cell, trừ đi một nửa chiều rộng của tooltip
       */
      const ADJUSTED_LEFT = position.x - TOOLTIP_WIDTH / 2

      /** Lấy chiều rộng và chiều cao của viewport (khung nhìn) */
      const VIEWPORT_WIDTH = window.innerWidth
      /**
       * Chiều cao của viewport
       */
      const VIEWPORT_HEIGHT = window.innerHeight

      /** Kiểm tra nếu tooltip nằm ra ngoài phía bên trái của viewport */
      if (ADJUSTED_LEFT < 0) {
        /** Nếu tooltip nằm ngoài, điều chỉnh vị trí để tooltip nằm ở lề trái của viewport */
        setTooltipPosition({ top: ADJUSTED_TOP, left: 0 })
        /**
         * Đặt tooltip ở lề trái
         */
      } else if (ADJUSTED_LEFT + TOOLTIP_WIDTH > VIEWPORT_WIDTH) {
        /** Kiểm tra nếu tooltip nằm ra ngoài phía bên phải của viewport
         * Nếu tooltip nằm ngoài, điều chỉnh vị trí để tooltip nằm trong viewport
         */
        setTooltipPosition({
          top: ADJUSTED_TOP,
          left: VIEWPORT_WIDTH - TOOLTIP_WIDTH,
        })
      } else {
        /** Nếu tooltip nằm trong viewport, sử dụng vị trí đã tính toán */
        setTooltipPosition({ top: ADJUSTED_TOP, left: ADJUSTED_LEFT })
      }

      /** Kiểm tra nếu tooltip nằm ra ngoài phía trên của viewport */
      if (ADJUSTED_TOP < 0) {
        /** Nếu tooltip nằm ngoài, điều chỉnh vị trí để tooltip nằm bên dưới cell */
        setTooltipPosition({
          top: position.y + 10, // Đặt tooltip bên dưới cell, thêm khoảng cách nhỏ (10px)
          left: ADJUSTED_LEFT,
        })
      }
    }
  }, [position, visible])

  /** Không hiển thì sẽ return null */
  if (!visible) return null

  return ReactDOM.createPortal(
    <div
      ref={TOOLTIP_REF}
      className="absolute z-50 bg-color-inverse text-white text-sm rounded-md px-3 py-1.5 max-w-xs shadow-md"
      style={{
        top: `${tooltip_position.top}px`,
        left: `${tooltip_position.left}px`,
      }}
    >
      {/* Tooltip Content */}
      <div className="whitespace-normal break-words">{content}</div>

      {/* Tooltip Arrow */}
      <div className="absolute border-8 border-transparent border-t-color-inverse bottom-0 translate-y-4 right-[50%] z-10"></div>
    </div>,
    document.body,
  )
}

export default TooltipTable

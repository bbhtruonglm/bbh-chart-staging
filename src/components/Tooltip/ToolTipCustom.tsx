import * as ReactDOM from 'react-dom'

import { useEffect, useRef, useState } from 'react'

/** Định nghĩa interface cho trạng thái Tooltip */
export interface TooltipState {
  /** Nội dung của tooltip */
  content: string
  /** Trạng thái hiển thị của tooltip */
  visible: boolean
  /** Vị trí hiện tooltip trên màn hình */
  position: { x: number; y: number }
}

function ToolTipCustom({ content, visible, position }: TooltipState) {
  /** REF để lấy DOM của tooltip */
  const TOOLTIP_REF = useRef<HTMLDivElement>(null)
  /** Trạng thái vị trí tooltip */
  const [tooltip_position, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    /** Chỉ thực hiện nếu tooltip cần hiển thị và ref đã được gán */
    if (visible && TOOLTIP_REF.current) {
      /** Lấy chiều cao của tooltip */
      const TOOLTIP_HEIGHT = TOOLTIP_REF.current.offsetHeight
      /** Lấy chiều rộng của tooltip */
      const TOOLTIP_WIDTH = TOOLTIP_REF.current.offsetWidth
      /** Tính toán vị trí top cho tooltip (phía trên phần tử được hover) */
      const ADJUSTED_TOP = position.y - TOOLTIP_HEIGHT - 10
      /** Tính toán vị trí left cho tooltip (đặt giữa phần tử được hover) */
      const ADJUSTED_LEFT = position.x - TOOLTIP_WIDTH / 2

      /** Kích thước của viewport (khung nhìn) */
      const VIEWPORT_WIDTH = window.innerWidth
      /**
       * Kích thước chiều cao của viewport (khung nhìn)
       */
      const VIEWPORT_HEIGHT = window.innerHeight

      /** Kiểm tra và điều chỉnh vị trí tooltip để nó không nằm ngoài viewport */
      if (ADJUSTED_LEFT < 0) {
        /** Nếu tooltip nằm ngoài bên trái của viewport */
        /** Đặt nó ở lề trái */
        setTooltipPosition({ top: ADJUSTED_TOP, left: 0 })
        /**
         * Nếu tooltip nằm ngoài bên phải của viewport
         */
      } else if (ADJUSTED_LEFT + TOOLTIP_WIDTH > VIEWPORT_WIDTH) {
        /** Nếu tooltip nằm ngoài bên phải của viewport */
        setTooltipPosition({
          top: ADJUSTED_TOP,
          /** Đặt nó ở lề phải */
          left: VIEWPORT_WIDTH - TOOLTIP_WIDTH,
        })
      } else {
        /** Nếu tooltip nằm trong viewport, sử dụng vị trí đã tính toán */
        setTooltipPosition({ top: ADJUSTED_TOP, left: ADJUSTED_LEFT })
      }

      /** Kiểm tra nếu tooltip nằm ngoài phía trên viewport */
      if (ADJUSTED_TOP < 0) {
        /** Nếu nằm ngoài, điều chỉnh vị trí để tooltip nằm bên dưới phần tử được hover */
        setTooltipPosition({
          /** Đặt tooltip bên dưới, thêm khoảng cách 10px */
          top: position.y,
          left: ADJUSTED_LEFT,
        })
      }
    }
    /** Phụ thuộc vào position và visible */
  }, [position, visible])

  /** Nếu tooltip không hiển thị, trả về null */
  if (!visible) return null

  /** Render tooltip với vị trí đã tính toán */
  return ReactDOM.createPortal(
    <div
      /** Gán ref cho div tooltip */
      ref={TOOLTIP_REF}
      className="absolute z-50 bg-color-inverse text-white text-sm rounded-md px-3 py-1.5 max-w-lg shadow-md"
      style={{
        /** Vị trí top của tooltip */
        top: `${tooltip_position.top}px`,
        /** Vị trí left của tooltip */
        left: `${tooltip_position.left}px`,
        pointerEvents: 'none',
      }}
    >
      {/* Nội dung của tooltip */}
      <div className="whitespace-pre-line break-words">{content}</div>
      {/* Mũi tên của tooltip */}
      <div className="absolute rotate-45 border-8 border-transparent border-b-color-inverse border-r-color-inverse bottom-0 translate-y-1 left-1/2 transform -translate-x-1/2 z-10"></div>
    </div>,
    /** Render tooltip vào body */
    document.body,
  )
}

export default ToolTipCustom

import { TooltipState } from './ToolTipCustom'
import { useState } from 'react'

/** Custom hook để quản lý trạng thái và vị trí của tooltip */
export const useTooltip = () => {
  /** State quản lý nội dung, vị trí, và trạng thái hiển thị của tooltip */
  const [tooltip, setTooltip] = useState<TooltipState>({
    content: '',
    visible: false,
    position: { x: 0, y: 0 },
  })

  /**
   * Kiểm tra xem nội dung có bị cắt bớt (truncated) không
   * @param element Element cần kiểm tra
   * @returns boolean
   */
  const isTextTruncated = (element: HTMLElement): boolean => {
    return element.scrollWidth > element.clientWidth
  }

  /**
   * Hiển thị tooltip khi hover vào phần tử
   * @param e Sự kiện chuột
   * @param content Nội dung của tooltip
   */
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    content: string,
  ) => {
    /** Dùng e.target thay vì e.currentTarget để đảm bảo phần tử gốc được kiểm tra */
    const TARGET = e.target as HTMLElement
    /** trả về một đối tượng chứa kích thước và vị trí của phần tử trong viewport (khung nhìn). */
    const ELEMENT_RECT = TARGET.getBoundingClientRect()
    /** Check xem có bị truncate không */
    const IS_TRUNCATED = isTextTruncated(TARGET)
    // const IS_TRUNCATED = true

    /** Nếu có bị truncate thì lưu vị trí để hiển thị tooltip */
    if (IS_TRUNCATED) {
      setTooltip({
        content,
        visible: true,
        position: {
          x: ELEMENT_RECT.left + window.scrollX + ELEMENT_RECT.width / 2, // Center horizontally
          y: ELEMENT_RECT.top + window.scrollY, // Adjust for the tooltip height
        },
      })
    }
  }
  const handleMouseEnterNoTruncated = (
    e: React.MouseEvent<HTMLElement>,
    content: string,
  ) => {
    /** Dùng e.target thay vì e.currentTarget để đảm bảo phần tử gốc được kiểm tra */
    const TARGET = e.target as HTMLElement
    /** trả về một đối tượng chứa kích thước và vị trí của phần tử trong viewport (khung nhìn). */
    const ELEMENT_RECT = TARGET.getBoundingClientRect()
    /** Check xem có bị truncate không */
    // const IS_TRUNCATED = isTextTruncated(TARGET)
    const IS_TRUNCATED = true

    /** Nếu có bị truncate thì lưu vị trí để hiển thị tooltip */
    if (IS_TRUNCATED) {
      setTooltip({
        content,
        visible: true,
        position: {
          x: ELEMENT_RECT.left + window.scrollX + ELEMENT_RECT.width / 2, // Center horizontally
          y: ELEMENT_RECT.top + window.scrollY, // Adjust for the tooltip height
        },
      })
    }
  }

  /**
   * Ẩn tooltip khi chuột rời khỏi phần tử
   */
  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return {
    tooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseEnterNoTruncated,
  }
}

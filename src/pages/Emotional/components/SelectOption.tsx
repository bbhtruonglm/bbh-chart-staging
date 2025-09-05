import React, { useEffect, useRef, useState } from 'react'

import { Down } from '@/assets/icons/Down'
import { Subtract } from '@/assets/icons/Subtract'

/**
 * Interface của SelectOption
 */
interface SelectProps {
  /**
   * Danh sách các options
   */
  options: string[]
  /**
   * Sự kiện khi thay đổi giá trị
   * @param value giá trị đã chọn
   */
  onChange?: (value: string) => void
  /**
   * Giá trị mặc định
   */
  default_value?: string
  /**
   * Key của giá trị
   */
  key_choice?: string
  /**
   * Placeholder
   */
  placeholder?: string
}

const SelectOption: React.FC<SelectProps> = ({
  options,
  onChange,
  default_value,
  key_choice,
  placeholder,
}) => {
  /**
   * State lưu trữ trạng thái của select
   */
  const [is_open, setIsOpen] = useState(false)
  /**
   * State lưu trữ giá trị đã chọn
   */
  const [selected_value, setSelectedValue] = useState<string>('')
  /**
   * Ref của select
   */
  const SELECT_REF = useRef<HTMLDivElement>(null)
  /**
   * Hàm xử lý khi bấm vào select
   */
  const handleToggle = () => {
    setIsOpen(!is_open)
  }
  /**
   *  Hàm xử lý khi chọn option
   * @param data giá trị đã chọn
   */
  const handleOptionClick = (data: string) => {
    /**
     * Set giá trị đã chọn
     */
    setSelectedValue(data)
    /**
     * Gọi hàm onChange
     */
    onChange?.(data)
    /**
     * Đóng select
     */
    setIsOpen(false)
  }
  useEffect(() => {
    /**
     * Set giá trị mặc định
     */
    setSelectedValue(default_value || '')
  }, [default_value])

  /** hàm xử lý khi bấm ra ngoài select
   * @param event sự kiện click
   */
  const handleClickOutside = (event: MouseEvent) => {
    /**
     * Nếu không phải phần tử được chọn thì đóng select
     */
    if (
      SELECT_REF.current &&
      !SELECT_REF.current.contains(event.target as Node)
    ) {
      /**
       * Đóng select
       */
      setIsOpen(false)
    }
  }

  /** khởi tạo sự kiên bấm ra ngoài */
  useEffect(() => {
    /**
     *  Gán sự kiện click ra ngoài
     */
    document.addEventListener('mousedown', handleClickOutside)
    /**
     * Xóa sự kiện khi unmount
     */
    return () => {
      /**
       * Xóa sự kiện click ra ngoài
       */
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  /** kiểm tra xem có phải phần tử được chọn không
   * @param item giá trị được chọn
   */
  const isSelected = (item: string) => {
    /** nếu không bằng id đã chọn thì trả về false */
    return selected_value === item
  }

  return (
    <div
      ref={SELECT_REF}
      className="relative h-9 cursor-pointer"
    >
      <button
        className="group flex relative h-full items-center justify-between w-full px-3 py-2 border rounded-lg bg-white text-left line-clamp-1"
        onClick={handleToggle}
      >
        {selected_value ? (
          <p className="line-clamp-1 items-center text-sm">
            {key_choice + ':'} {selected_value}
          </p>
        ) : (
          <p className="text-slate-700 font-normal line-clamp-1">
            {placeholder}
          </p>
        )}
        <div className="flex-shrink-0">
          <Down />
        </div>
        {/* Tooltip */}
        {selected_value && (
          <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 w-full p-2 bg-slate-500 text-white text-center text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-[999999999]">
            {selected_value}
          </div>
        )}
      </button>

      {is_open && (
        <div>
          {/* <div className="absolute border-8 border-transparent border-b-white bottom-0 translate-y-2 right-[20%] z-10"></div> */}
          <div className="absolute w-full mt-1 md:left-0 bg-white shadow-lg z-[9999999] rounded-lg">
            <div className="flex flex-col p-2 gap-y-2 h-48 overflow-y-auto scrollbar-webkit scrollbar-thin">
              {options.map((option: string, index) => (
                <div
                  key={index}
                  className={`${index === 0 ? ' ' : ''} `}
                >
                  <div
                    key={index}
                    className={`flex items-center justify-between hover:bg-gray-100 rounded-lg px-2 py-1 ${isSelected(option) && 'bg-gray-100'}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div
                      className={`flex gap-x-3 px-2 py-2 items-center cursor-pointer gap-y-2 rounded-lg `}
                    >
                      <div>
                        <p className="text-sm font-medium">{option || ''}</p>
                      </div>
                    </div>
                    {isSelected(option) && (
                      <div>
                        <Subtract />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectOption

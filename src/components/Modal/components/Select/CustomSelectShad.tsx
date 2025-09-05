import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useRef } from 'react'
/**
 * Interface SelectOption
 */
interface SelectOption {
  /** Key */
  key: string
  /** Value */
  value: string | number
}
/**
 * Custom select component
 */
interface CustomSelectProps {
  /** Tên Select */
  label: string
  /** Data select */
  data: SelectOption[]

  /** Giá trị trong select */
  value?: string | number

  /** Select  */
  selected?: SelectOption | null

  /** Disable */
  disabled?: boolean
  /** onSelect
   * @param option SelectOption
   * @returns void
   */
  setSelected?: (option: SelectOption) => void
}

const CustomSelectShad: React.FC<CustomSelectProps> = ({
  label,
  data,
  value,
  selected,
  disabled,
  setSelected,
}) => {
  /**
   * Hàm xử lý chọn select
   */
  /** Chọn status
   *  @param option SelectOption
   * @returns void
   */
  const handleSelect = (option: SelectOption) => {
    /**
     * Nếu có hàm onSelect thì gọi hàm onSelect
     */
    setSelected(option)
  }
  /** REF select */
  const SELECT_REF = useRef<HTMLDivElement>(null)
  /**
   * Click chuột ra ngoài
   */
  useEffect(() => {
    /**
     * Thêm sự kiện click chuột ra ngoài
     */
    document.addEventListener('mousedown', handleClickOutside)
    /**
     * Xóa sự kiện click chuột ra ngoài
     */
    return () => {
      /**
       * Xóa sự kiện click chuột ra ngoài
       */
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  /** click chuột ra ngoài
   * @param event MouseEvent
   * @returns void
   */
  const handleClickOutside = (event: MouseEvent) => {
    /**
     * Nếu click ra ngoài select
     */
    if (
      SELECT_REF.current &&
      !SELECT_REF.current.contains(event.target as Node)
    ) {
      // setIsOpen(false)
    }
  }
  return (
    <div
      className="relative w-full"
      ref={SELECT_REF}
    >
      <Select
        defaultValue={selected?.key as string}
        onValueChange={(selectedKey) => {
          /**
           * Tìm option được chọn trong data
           */
          const SELECTED_OPTION = data.find((item) => item.key === selectedKey)
          if (SELECTED_OPTION) {
            handleSelect(SELECTED_OPTION)
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full min-w-28 px-3 py-2 border flex justify-between border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-none text-sm">
          <SelectValue
            // placeholder={value || `${label}`}
            className="text-sm"
          >
            <span className="truncate">
              {selected ? selected.key : `${label}`}
            </span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup className="gap-y-2 flex flex-col">
            {data.map((item) => (
              <SelectItem
                key={item.key}
                value={item.key as string}
                className="truncate"
                style={{ background: item.key }}
              >
                {item.key}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CustomSelectShad

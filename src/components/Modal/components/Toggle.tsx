/**
 *  Toggle component
 */
interface ToggleProps {
  /** param hiển thị trạng thái toggle */
  is_on: boolean
  /** param xử lý khi click vào toggle */
  onToggle: () => void
  /** param kiểu toggle */
  type: 'voucher' | 'member' | 'transaction' | 'overview'
  /** param label khi toggle on */
  label_on?: string
  /** param label khi toggle off */
  label_off?: string
  /** param disabled */
  disabled?: boolean
  /** is hide label */
  is_hide_label?: boolean
}

const Toggle: React.FC<ToggleProps> = ({
  is_on = true,
  onToggle,
  type = 'voucher',
  label_on = 'Kích hoạt',
  label_off = 'Chưa kích hoạt',
  disabled = false,
  is_hide_label = false,
}) => {
  return (
    <div
      className="flex gap-x-2 cursor-pointer w-fit"
      onClick={onToggle}
    >
      <div
        className={`relative w-11 h-6 flex items-center p-0.5 rounded-full cursor-pointer transition-colors duration-300 ${
          is_on ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            is_on ? 'translate-x-5' : '-translate-x-0'
          }`}
        />
      </div>
      {!is_hide_label && (
        <div>
          {is_on ? (
            <h4 className="text-sm font-medium">{label_on}</h4>
          ) : (
            <h4 className="text-sm font-medium">{label_off}</h4>
          )}
        </div>
      )}
    </div>
  )
}

export default Toggle

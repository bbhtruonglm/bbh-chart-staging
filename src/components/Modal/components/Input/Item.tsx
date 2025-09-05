import {
  BellIcon,
  Cog8ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'

import Bell from '@/assets/icons/Bell'
import CustomSelectShad from '../Select/CustomSelectShad'
import Toggle from '../Toggle'
import ToolSetting from '@/assets/icons/ToolSetting'
import { UserCircle } from '@/assets/icons/UserCircle'
import UserCircleBlack from '@/assets/icons/UserCircleBlack'

interface ItemProps {
  /** Loại item */
  type?: string
  /** Tiêu đề của item */
  title?: string
  /** Mô tả của item */
  desc?: string
  /** Tùy chọn của item */
  option?: string
  /** Mô tả phụ của item */
  sub_desc?: string
  /** Hàm được gọi khi chọn item
   * @param e giá trị được chọn
   *  @returns void
   */
  onSelect?: (e: string | number) => void
  /** Giá trị được chọn của item */
  value_select?: string | number
  /** data select nếu có  */
  data_select?: any
  /** label select nếu có */
  label_select?: string
  /** value input */
  value_input?: string | number
  /** onChange input
   * @param e giá trị input
   * @returns void
   */
  onChangeInput?: (e: string) => void
  /** value toggle */
  value_toggle?: boolean | undefined
  /** onChange toggle
   * @param e giá trị toggle
   * @returns void
   */
  onChangeToggle?: (e: boolean) => void
}

const Item = ({
  type,
  title,
  desc,
  option,
  sub_desc,
  onSelect,
  value_select,
  data_select,
  label_select,
  value_input,
  onChangeInput: setValueInput,
  value_toggle,
  onChangeToggle,
}: ItemProps) => {
  return (
    <div className="flex gap-x-3 w-full">
      <div className="flex justify-center items-center flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full">
        {type === 'setting' && <Cog8ToothIcon className="size-5" />}
        {type === 'bell' && <BellIcon className="size-5" />}
        {type === 'user' && <UserCircleIcon className="size-5" />}
      </div>
      <div className="flex flex-col md:flex-row w-full md:justify-between md:gap-x-3">
        <div className="flex w-full justify-between">
          <div
            style={{
              maxWidth: '570px',
            }}
          >
            <h4 className="text-sm font-medium">{title}</h4>

            <h4 className="text-xs text-gray-500 font-medium break-words">
              {desc}
              <br />
              {sub_desc}
            </h4>
          </div>
          {option === 'toggle' && value_toggle !== undefined && (
            <div className="">
              <Toggle
                type="overview"
                label_on=""
                label_off=""
                is_on={value_toggle}
                onToggle={() => {
                  onChangeToggle && onChangeToggle(!value_toggle)
                }}
                is_hide_label
              />
            </div>
          )}
        </div>
        {option === 'select' && value_select && (
          <div className="w-full md:w-64">
            <CustomSelectShad
              label={label_select}
              data={data_select}
              selected={data_select.find(
                (item: any) => item.value === value_select,
              )}
              value={value_select}
              setSelected={(option: any) => {
                onSelect && onSelect(option.value)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Item

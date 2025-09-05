import {
  GlobeAmericasIcon,
  GlobeAsiaAustraliaIcon,
} from '@heroicons/react/24/solid'

import CustomSelectShad from '../Select/CustomSelectShad'
import Global from '@/assets/icons/Global'

/**
 * Properties for the Item component.
 */
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
   * @returns void
   */
  onSelected?: (e: string | number) => void
  /** Giá trị được chọn của item */
  value_selected?: string | number
  /** data select nếu có  */
  data_select?: any
  /** label select nếu có */
  label_select?: string
}

const ItemSelectNoToggle = ({
  type,
  title,
  desc,
  option,
  sub_desc,
  onSelected,
  value_selected,
  data_select,
  label_select,
}: ItemProps) => {
  /** State chọn option */

  return (
    <div className="flex gap-3 w-full">
      <div className="flex justify-center items-center flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full">
        <GlobeAsiaAustraliaIcon className="size-5" />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between ">
        <div style={{ maxWidth: '570px' }}>
          <h4 className="text-sm font-medium">{title}</h4>
          <h4 className="text-xs text-gray-500 font-medium break-words">
            {desc}
            <br />
            {sub_desc}
          </h4>
        </div>

        {option === 'select-no-toggle' && value_selected !== undefined && (
          <div className="w-full md:w-52">
            <CustomSelectShad
              label={label_select}
              data={data_select}
              selected={data_select.find(e => e.value === value_selected)}
              value={value_selected}
              setSelected={e => {
                onSelected && onSelected(e.value)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemSelectNoToggle

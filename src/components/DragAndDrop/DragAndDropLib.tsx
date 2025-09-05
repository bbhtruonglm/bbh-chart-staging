import { IItem, IItemPropCustoms, SortableListProps } from '@/utils/interface'
import React, { useEffect, useState } from 'react'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'

import DragIcon from '@/assets/icons/DragIcon'
import ToolTipCustom from '../Tooltip/ToolTipCustom'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { arrayMove } from '@dnd-kit/sortable'
import { t } from 'i18next'
import { useTooltip } from '../Tooltip/useTooltip'

/**
 * Component của DragHandle để giới hạn khu vực kéo thả
 */
const DragHandle = SortableHandle(() => (
  <span className="cursor-move">
    <DragIcon />
  </span>
))

/**
 * Component của một item
 */
const SortableItem = SortableElement<IItemPropCustoms>(
  ({
    value,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseEnterNoTruncated,
    setItemDelete,
    setOpenWarning,
    setOnOpenModal,
    setTypeModalTemplate,
    setDataUpdate,
    index_item,
  }) => (
    <div
      onClick={e => {
        /**
         * Ngăn chặn sự kiện click lan sang các component khác
         */
        e.stopPropagation()
        /**
         * Thiết lập dữ liệu cần cập nhật
         */
        setDataUpdate(value)
      }}
      className={`flex flex-row justify-between items-center bg-white p-2 rounded-md hover:bg-blue-200 border hover:border-blue-200`}
    >
      <div className="w-8 md:w-12 flex-shrink-0">
        <DragHandle />
      </div>

      <div className="flex gap-x-2 md:gap-x-4 flex-grow min-w-0">
        <p
          className="truncate text-sm"
          onMouseEnter={e => handleMouseEnter(e, value?.title)}
          onMouseLeave={handleMouseLeave}
        >
          {typeof value.header === 'function' ? value.header() : value.header}
        </p>
      </div>

      <div
        className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:text-red-500"
        onMouseEnter={e => handleMouseEnterNoTruncated(e, t('hide_column'))}
        onMouseLeave={handleMouseLeave}
        onClick={e => {
          e.stopPropagation()
          setItemDelete(value.accessorKey)
          handleMouseLeave()
        }}
      >
        <XMarkIcon className="size-5" />
      </div>
    </div>
  ),
)

/**
 * Component của danh sách các item
 */
const SortableList = SortableContainer<SortableListProps>(
  ({
    items,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseEnterNoTruncated,
    setItemDelete,
    setOpenWarning,
    setOnOpenModal,
    setTypeModalTemplate,
    setDataUpdate,
  }) => {
    return (
      <ul className="flex flex-col gap-2">
        {items.map((value, index) => (
          <SortableItem
            key={value.accessorKey}
            index={index}
            value={value}
            index_item={index}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseEnterNoTruncated={handleMouseEnterNoTruncated}
            setItemDelete={setItemDelete}
            setOpenWarning={setOpenWarning}
            setOnOpenModal={setOnOpenModal}
            setTypeModalTemplate={setTypeModalTemplate}
            setDataUpdate={() => setDataUpdate(value)}
          />
        ))}
      </ul>
    )
  },
)

/**
 *  Component DragAndDropLib
 * @param param0  initialData: dữ liệu ban đầu, onUpdate: hàm được gọi khi sắp xếp xong, setDataUpdate: hàm cập nhật dữ liệu, setOnOpenModal: hàm mở modal, setTypeModalTemplate: hàm thiết lập loại modal, setItemDelete: hàm xóa item, setOpenWarning: hàm mở cảnh báo, draggable: có thể kéo thả
 * @returns JSX.Element
 */
const DragAndDropLib: React.FC<{
  initialData: IItem[]
  onUpdate: (data: IItem[]) => void
  setDataUpdate?: (data: IItem[]) => void
  setOnOpenModal?: (open: boolean) => void
  setTypeModalTemplate?: (type: string) => void
  setItemDelete?: (item: IItem) => void
  setOpenWarning?: (open: boolean) => void
  draggable?: boolean
}> = ({
  initialData,
  onUpdate,
  setDataUpdate,
  setOnOpenModal,
  setTypeModalTemplate,
  setItemDelete,
  setOpenWarning,
  draggable = false,
}) => {
  /** Lấy các dữ liệu tooltip từ customHook */
  const {
    tooltip,
    handleMouseEnterNoTruncated,
    handleMouseEnter,
    handleMouseLeave,
  } = useTooltip()

  /**
   * Danh sách các item
   */
  const [items, setItems] = useState<IItem[]>(initialData)

  /**
   * Cập nhật dữ liệu khi initialData thay đổi
   */
  useEffect(() => {
    /**
     * Cập nhật dữ liệu
     */
    setItems(initialData)
  }, [initialData])

  /**
   * Hàm được gọi khi sắp xếp xong
   * @param param0 oldIndex: vị trí cũ, newIndex: vị trí mới
   */
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number
    newIndex: number
  }) => {
    /**
     * Sắp xếp lại dữ liệu
     */
    const NEW_ITEMS = arrayMove(items, oldIndex, newIndex)
    /**
     * Cập nhật dữ liệu
     */
    setItems(NEW_ITEMS)
    /**
     * Gọi hàm onUpdate
     */
    onUpdate(NEW_ITEMS)
  }

  return (
    <div>
      <SortableList
        useDragHandle /** Kích hoạt chỉ kéo thả khi dùng DragHandle */
        onSortEnd={onSortEnd}
        items={items}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleMouseEnterNoTruncated={handleMouseEnterNoTruncated}
        setItemDelete={setItemDelete}
        setOpenWarning={setOpenWarning}
        setOnOpenModal={() => {
          setOnOpenModal(true)
          handleMouseLeave()
        }}
        setTypeModalTemplate={setTypeModalTemplate}
        draggable={draggable}
        setDataUpdate={e => setDataUpdate(e)}
        helperClass="z-50 shadow-lg bg-white rounded-lg pointer-events-none"
      />
      <ToolTipCustom
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
    </div>
  )
}

export default DragAndDropLib

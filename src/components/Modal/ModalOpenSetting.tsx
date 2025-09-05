import { PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useState } from 'react'

import Close from '@/assets/icons/Close'
import DragAndDropLib from '../DragAndDrop/DragAndDropLib'
import ModalContent2 from './ModalContent2'
import ToolTipCustom from '../Tooltip/ToolTipCustom'
import { removeVietnameseTones } from '@/utils'
import { useTooltip } from '../Tooltip/useTooltip'
import { useTranslation } from 'react-i18next'

/** Interface định nghĩa các props được truyền vào component */
interface IProps {
  /** Trạng thái mở modal hay không */
  is_open?: boolean

  /** Hàm đóng modal */
  onClose?: () => void

  /** Danh sách các cột đang hiển thị chính thức */
  visibleColumns: any[] // Nên định nghĩa kiểu rõ ràng thay vì `any[]`, ví dụ: ColumnDef[]

  /** Danh sách tất cả các cột có thể hiển thị */
  allColumns: any[] // Nên định nghĩa kiểu rõ ràng nếu có

  /** Danh sách các key của cột đang hiển thị tạm thời (trong modal cấu hình) */
  tempVisibleKeys: string[]

  /** Hàm cập nhật danh sách cột hiển thị tạm thời */
  updateVisibleColumnsState: (keys: string[]) => void

  /** Hàm lưu cấu hình cột hiển thị chính thức */
  saveVisibleColumns: () => void

  /** Danh sách key của các cột đang hiển thị chính thức (tuỳ chọn) */
  visible_keys?: string[]
}

const ModalOpenSetting = ({
  is_open,
  onClose,
  visibleColumns,
  allColumns,
  tempVisibleKeys,
  updateVisibleColumnsState,
  saveVisibleColumns,
  visible_keys,
}: IProps) => {
  /** Nếu modal chưa mở thì không render gì cả */
  if (!is_open) return null

  /** Hook i18n để dịch ngôn ngữ */
  const { t } = useTranslation()

  /** Trạng thái hiển thị modal cảnh báo (mở khi người dùng thay đổi cột mà chưa lưu) */
  const [open_warning_modal, setOpenWarningModal] = useState(false)

  /**
   * Hook tooltip hỗ trợ hiển thị nội dung đầy đủ khi bị cắt (truncated)
   * - `tooltip`: JSX nội dung tooltip được render bên ngoài
   * - `handleMouseLeave`: sự kiện để ẩn tooltip khi hover out
   * - `handleMouseEnterNoTruncated`: sự kiện để hiện tooltip nếu text bị cắt
   */
  const { tooltip, handleMouseLeave, handleMouseEnterNoTruncated } =
    useTooltip()

  /** Check đóng mở để tự động scroll */
  useEffect(() => {
    /** Kiểm tra trạng thái đóng mở */
    if (is_open) {
      /** Mở thì thêm no-scroll */
      document.body.classList.add('no-scroll')
    } else {
      /** Đóng thì loại bỏ no-scroll */
      document.body.classList.remove('no-scroll')
    }
    /** Hàm return */
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [is_open])

  useEffect(() => {
    /** Hàm xử lý khi bấm phím
     * @param event Sự kiện keydown
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      /** Nếu bấm phím `Escape`, đóng modal. */
      if (event.key === 'Escape') {
        /** Đóng modal */
        onClose?.()
      }
    }
    /** Thêm sự kiện */
    document.addEventListener('keydown', handleKeyDown)
    /** Hàm return */
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  /** Hàm click ra ngoài
   * @param e Sự kiện click
   */
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    /** Nếu click ra ngoài modal, đóng modal. */
    if (e.target === e.currentTarget) {
      /** Đóng modal */

      /**
       * So sánh độ dài giữa danh sách tạm thời và danh sách đang hiển thị
       */
      const ARE_LENGTHS_DIFFERENT =
        tempVisibleKeys.length !== visibleColumns.length

      /**
       * Nếu độ dài giống nhau, kiểm tra từng phần tử
       */
      const ARE_VALUES_DIFFERENT =
        !ARE_LENGTHS_DIFFERENT &&
        tempVisibleKeys.some(
          (key, idx) => key !== visibleColumns[idx].accessorKey,
        )

      /**
       * Nếu có thay đổi → mở modal cảnh báo
       */
      if (ARE_LENGTHS_DIFFERENT || ARE_VALUES_DIFFERENT) {
        setOpenWarningModal(true)
        return
      }

      /**
       * Nếu không có thay đổi → đóng modal (nếu có hàm)
       */
      onClose?.()
    }
  }

  /** Hàm trích xuất nhãn (label) từ header của column
   * @param header Header của column
   */
  function extractHeaderLabel(header: any): string {
    /** Nếu là chuỗi, trả về trực tiếp */
    if (typeof header === 'string') return header

    /** Nếu là function, gọi để lấy giá trị */
    if (typeof header === 'function') return extractHeaderLabel(header())

    /** Nếu là React element có prop label */
    if (header?.props?.label && typeof header.props.label === 'string') {
      return header.props.label
    }

    /** Không xác định được label */
    return ''
  }

  /** State cho ô tìm kiếm danh sách cột ẩn */
  const [search_hidden_text, setSearchHiddenText] = useState<string>('')

  /** State cho ô tìm kiếm danh sách cột hiển thị */
  const [search_visible_text, setSearchVisibleText] = useState<string>('')

  /** Lọc cột theo nội dung tìm kiếm đã loại bỏ dấu tiếng Việt
   * @param search_text Nội dung tìm kiếm
   * @param columns Danh sách cotle
   */
  function filterColumnsBySearch(search_text: string, columns: any[]) {
    /** Xoá dấu tiếng việt */
    const NORMALIZED_TEXT = removeVietnameseTones(search_text.toLowerCase())
    /** Xử lý filter tìm kiếm */
    return columns.filter(col => {
      /** Lấy tên cột */
      const LABEL = extractHeaderLabel(col.header)
      /** Xử lý xoá dấu tiếng việt */
      const NORMALIZED_LABEL = removeVietnameseTones(LABEL.toLowerCase())
      /** Trá về giá trị `true` */
      return NORMALIZED_LABEL.includes(NORMALIZED_TEXT)
    })
  }

  /** Danh sách cột ẩn ban đầu chưa lọc */
  const RAW_HIDDEN_COLUMNS = allColumns.filter(
    col => !tempVisibleKeys.includes(col.accessorKey),
  )

  /** Danh sách cột ẩn sau khi lọc tìm kiếm */
  const HIDDEN_COLUMNS = useMemo(() => {
    /** Lấy danh sách đã filter */
    return filterColumnsBySearch(search_hidden_text, RAW_HIDDEN_COLUMNS)
  }, [RAW_HIDDEN_COLUMNS, search_hidden_text])

  /** Danh sách cột hiển thị ban đầu dựa theo temp_visible_keys */
  const RAW_VISIBLE_COLUMNS = useMemo(() => {
    return tempVisibleKeys
      .map(key => allColumns.find(col => col.accessorKey === key))
      .filter(Boolean) as any[]
  }, [tempVisibleKeys, allColumns])

  /** Danh sách cột hiển thị sau khi lọc tìm kiếm */
  const VISIBLE_COLUMNS = useMemo(() => {
    /** Lấy danh sách đã filter */
    return filterColumnsBySearch(search_visible_text, RAW_VISIBLE_COLUMNS)
  }, [RAW_VISIBLE_COLUMNS, search_visible_text])

  /**
   * Hàm xử lý thêm một cột hiển thị
   * @param key accessorKey của cột muốn thêm
   */
  const handleAddColumn = (key: string) => {
    updateVisibleColumnsState([...tempVisibleKeys, key])
  }

  /**
   * Hàm xử lý ẩn (gỡ bỏ) một cột đang hiển thị
   * @param key accessorKey của cột muốn ẩn
   */
  const handleRemoveColumn = (key: string) => {
    updateVisibleColumnsState(tempVisibleKeys.filter(k => k !== key))
  }
  /** Hàm xử lý khi drag & drop */
  const handleDragUpdate = (updatedColumns: any[]) => {
    /** Lấy danh sách keys sau khi drop */
    const NEW_KEYS = updatedColumns.map(col => col.accessorKey)
    /** Lưu vào giá trị temp */
    updateVisibleColumnsState(NEW_KEYS)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 md:px-20 md:py-5 select-none"
      onClick={handleClickOutside}
    >
      <div className="flex flex-col bg-white md:rounded-lg w-full md:w-full min-w-96 h-full md:h-full p-3 md:px-5 md:py-2 shadow-lg">
        <div className="flex justify-between py-2 border-b flex-shrink-0 items-center">
          <div></div>
          <h2 className="text-lg font-semibold">
            {t('_custom_showing_columns')}
          </h2>
          <div
            onClick={() => {
              /**
               * So sánh độ dài giữa danh sách tạm thời và danh sách đang hiển thị
               */
              const ARE_LENGTHS_DIFFERENT =
                tempVisibleKeys.length !== visibleColumns.length

              /**
               * Nếu độ dài giống nhau, kiểm tra từng phần tử
               */
              const ARE_VALUES_DIFFERENT =
                !ARE_LENGTHS_DIFFERENT &&
                tempVisibleKeys.some(
                  (key, idx) => key !== visibleColumns[idx].accessorKey,
                )

              /**
               * Nếu có thay đổi → mở modal cảnh báo
               */
              if (ARE_LENGTHS_DIFFERENT || ARE_VALUES_DIFFERENT) {
                setOpenWarningModal(true)
                return
              }

              /**
               * Nếu không có thay đổi → đóng modal (nếu có hàm)
               */
              onClose?.()
            }}
            className="text-slate-700 text-sm font-medium p-2 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <Close />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 w-full flex-grow min-h-0 overflow-hidden py-2">
          {/* Thêm cột */}
          <div className="flex flex-col w-full lg:w-1/2 flex-grow min-h-0 overflow-hidden bg-slate-200 p-2 rounded-md gap-2">
            <div className="flex justify-between items-center">
              <label className="flex py-2 items-center gap-1">
                {t('add_column')}
                <QuestionMarkCircleIcon
                  className="size-4 text-blue-400"
                  onMouseEnter={(e: any) =>
                    handleMouseEnterNoTruncated(
                      e,
                      t('click_plus_to_add_column'),
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </label>
              <div className="text-xs bg-white px-2 py-1 rounded-md">
                {HIDDEN_COLUMNS.length}
              </div>
            </div>
            <div className=" w-full">
              <input
                placeholder={t('search_column')}
                value={search_hidden_text}
                onChange={e => setSearchHiddenText(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 flex-grow min-h-0 overflow-hidden overflow-y-auto h-full">
              {HIDDEN_COLUMNS.map(col => (
                <div
                  className="flex flex-row justify-between items-center bg-white p-2 rounded-md hover:bg-blue-200 border hover:border-blue-200 transition"
                  key={col.accessorKey}
                >
                  <div className="flex gap-2 items-center text-sm text-gray-700">
                    <label className="flex items-center gap-1">
                      {typeof col.header === 'function'
                        ? col.header()
                        : col.header}
                    </label>
                  </div>
                  <div
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleAddColumn(col.accessorKey)}
                    onMouseEnter={e =>
                      handleMouseEnterNoTruncated(e, t('add_column'))
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <PlusIcon className="size-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột hiển thị */}
          <div className="flex flex-col w-full lg:w-1/2 flex-grow min-h-0 overflow-hidden rounded-md bg-slate-200 p-2 gap-2">
            <div className="flex justify-between items-center">
              <label className="flex py-2 items-center gap-1">
                {t('visible_columns')}
                <QuestionMarkCircleIcon
                  className="size-4 text-blue-400"
                  onMouseEnter={(e: any) =>
                    handleMouseEnterNoTruncated(
                      e,
                      t('dnd_to_change_column_order'),
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </label>
              <div className="text-xs bg-white px-2 py-1 rounded-md">
                {VISIBLE_COLUMNS.length}
              </div>
            </div>
            <div className=" w-full">
              <input
                placeholder={t('search_column')}
                value={search_visible_text}
                onChange={e => setSearchVisibleText(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 flex-grow min-h-0 overflow-hidden overflow-y-auto h-full">
              <DragAndDropLib
                initialData={VISIBLE_COLUMNS}
                onUpdate={handleDragUpdate}
                setDataUpdate={item => {}}
                setOnOpenModal={() => {}}
                setTypeModalTemplate={() => {}}
                setItemDelete={(item: any) => {
                  handleRemoveColumn(item)
                }}
                setOpenWarning={() => {}}
                draggable
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between py-4 border-t flex-shrink-0 items-center">
          <div
            className="text-slate-700 text-sm font-medium px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 cursor-pointer"
            onClick={() => {
              /**
               * So sánh độ dài giữa danh sách tạm thời và danh sách đang hiển thị
               */
              const ARE_LENGTHS_DIFFERENT =
                tempVisibleKeys.length !== visibleColumns.length

              /**
               * Nếu độ dài giống nhau, kiểm tra từng phần tử
               */
              const ARE_VALUES_DIFFERENT =
                !ARE_LENGTHS_DIFFERENT &&
                tempVisibleKeys.some(
                  (key, idx) => key !== visibleColumns[idx].accessorKey,
                )

              /**
               * Nếu có thay đổi → mở modal cảnh báo
               */
              if (ARE_LENGTHS_DIFFERENT || ARE_VALUES_DIFFERENT) {
                setOpenWarningModal(true)
                return
              }

              /**
               * Nếu không có thay đổi → đóng modal (nếu có hàm)
               */
              onClose?.()
            }}
          >
            {t('_close')}
          </div>
          <div className="flex gap-x-2">
            <div
              className="text-slate-700 text-sm font-medium px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 cursor-pointer"
              onClick={() =>
                updateVisibleColumnsState(
                  allColumns.map(col => col.accessorKey),
                )
              }
            >
              {t('reset_to_default')}
            </div>
            <div
              className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-500 cursor-pointer"
              onClick={() => {
                saveVisibleColumns()
                onClose?.()
              }}
            >
              {t('_save')}
            </div>
          </div>
        </div>
      </div>
      {open_warning_modal && (
        <ModalContent2
          type={'warning'}
          title={t('exit_without_saving')}
          message={t('warning_exit_without_saving')}
          onCancel={() => {
            setOpenWarningModal(false)
          }}
          onConfirm={() => {
            updateVisibleColumnsState(visible_keys)
            setOpenWarningModal(false)
            onClose?.()
          }}
        />
      )}

      <ToolTipCustom
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
    </div>
  )
}

export default ModalOpenSetting

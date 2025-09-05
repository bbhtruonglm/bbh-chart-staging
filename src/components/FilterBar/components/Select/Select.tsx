import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Down } from '@/assets/icons/Down'
import { PageData } from '@/interfaces'
import React from 'react'
import SquaresPlus from '@/assets/icons/SquaresPlus'
import SquaresPlusBlack from '@/assets/icons/SquaresPlusBlack'
import { Subtract } from '@/assets/icons/Subtract'
import { useSelectPages } from './useSelectPages'
import { useTranslation } from 'react-i18next'
/**  interface page Info */
interface PageInfo {
  /**Tên */
  name: string
  /**  Tên gợi nhớ */
  alias?: string
}

interface ListItem {
  /** Thông tin page */
  page_info?: PageInfo
}

const Select: React.FC<{
  /**
   * Danh sách option
   */
  options?: PageData[]
  /**
   * Giá trị placeholder
   */
  placeholder?: string | null
}> = ({ options, placeholder }) => {
  /**
   * I18n
   */
  const { t } = useTranslation()
  /**
   * Hooks
   */
  const {
    SELECT_REF,
    is_open,
    toggleOpen,
    handleSearch,
    handleOptionClick,
    handleClearSelection,
    list_selected,
    isSelected,
    GROUP_ARRAY,
    renderGroupName,
    truncatedName,
    getImageUrl,
    filtered_options,
  } = useSelectPages()
  const MAX_LENGTH = {
    1: 999, // 1 item => không giới hạn
    2: 18, // 2 item => tối đa 18 ký tự
    default: 12, // >=3 item => tối đa 12 ký tự
  }

  const getDisplayName = (item: ListItem) => {
    /** Raw name */
    const RAW_NAME = item.page_info?.alias || item.page_info?.name || 'N/A'
    /** LImit */
    const LIMIT =
      MAX_LENGTH[TOTAL as keyof typeof MAX_LENGTH] || MAX_LENGTH.default
    /** Trả về */
    return RAW_NAME.length > LIMIT
      ? `${RAW_NAME.slice(0, LIMIT - 2)}...`
      : RAW_NAME
  }
  /** Tổng số trang */
  const TOTAL = list_selected.length

  return (
    <div
      ref={SELECT_REF}
      className="relative h-9"
    >
      <button
        className="hidden md:flex h-9 items-center justify-between w-full bg-white px-3 py-2 border rounded-lg text-left min-w-56 max-w-72"
        onClick={toggleOpen}
      >
        {/* Vùng text, đảm bảo luôn chỉ 1 dòng */}
        <div className="flex-1 min-w-0 truncate">
          {TOTAL > 0 ? (
            <div className="flex items-center text-sm truncate">
              {list_selected.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="mr-1 text-slate-700 font-normal flex items-center"
                >
                  <p className="truncate text-sm">{getDisplayName(item)}</p>
                  {index < 2 && index < TOTAL - 1 && ', '}
                </div>
              ))}

              {TOTAL > 3 && (
                <span className="ml-1 text-slate-500 text-sm">
                  (+{TOTAL - 3})
                </span>
              )}
            </div>
          ) : (
            <h4 className="text-slate-700 text-sm shrink-0">
              {placeholder || t('select_page')}
            </h4>
          )}
        </div>

        {/* Icon Down cố định bên phải */}
        <ChevronDownIcon className="ml-2 shrink-0 size-4" />
      </button>
      {/* Mobile toggle */}
      <button
        className={`md:hidden flex h-fit items-center justify-between w-full bg-white px-2 py-2 border ${is_open ? 'border-blue-200' : 'border-slate-200'} rounded-lg`}
        onClick={toggleOpen}
      >
        {is_open ? <SquaresPlus /> : <SquaresPlusBlack />}
      </button>
      {is_open && (
        <div>
          <div className="absolute border-8 border-transparent border-b-white bottom-0 translate-y-2 right-[20%] z-10"></div>
          <div className="absolute w-72 max-h-96 md:w-72 mt-2 right-0 md:left-0 bg-white shadow-lg z-[99999999] p-2 rounded-lg flex flex-col gap-y-2">
            <input
              className="w-full bg-slate-100 p-2 rounded-lg text-sm"
              placeholder={t('search_for_page')}
              onChange={e => handleSearch(e.target.value)}
            />
            <div className="flex h-full flex-col overflow-y-auto scrollbar-webkit scrollbar-thin gap-y-2 min-h-48 md:min-h-0">
              {GROUP_ARRAY.map(([group, items], idx) => (
                <div
                  key={group}
                  className={`flex flex-col gap-y-2 ${idx < GROUP_ARRAY.length - 1 ? 'border-b pb-2 border-color-border' : ''}`}
                >
                  <h4 className="ml-2 text-xs text-color-text-placeholder">
                    {renderGroupName(group)}
                  </h4>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-lg ${isSelected(item) ? 'bg-gray-100' : ''}`}
                      onClick={() => handleOptionClick(item)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            item.page_info?.avatar ||
                            getImageUrl(item.page_id, item.page_info?.type)
                          }
                          alt="avatar"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm truncate">
                            {truncatedName(
                              item.page_info?.alias || item.page_info?.name,
                            )}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {truncatedName(item.page_id)}
                          </p>
                        </div>
                      </div>
                      {isSelected(item) && <Subtract />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {list_selected.length > 0 && (
              <div
                onClick={handleClearSelection}
                className="flex w-full justify-center items-center bg-slate-200 p-2 rounded-lg text-sm cursor-pointer"
              >
                <p>{t('unselect')}</p>
              </div>
            )}
            {filtered_options.length === 0 && (
              <div className="flex p-2 justify-center items-center">
                {t('no_data_found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select

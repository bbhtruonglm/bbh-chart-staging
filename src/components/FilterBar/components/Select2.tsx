import React, { useEffect, useMemo, useRef, useState } from 'react'
import { groupBy, toPairs } from 'lodash'
import { selectPageId, selectPageList, setPageId } from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'

import { Down } from '@/assets/icons/Down'
import EARTH_SVG from '@/assets/images/earth.svg'
import { PageData } from '@/interfaces'
import SquaresPlus from '@/assets/icons/SquaresPlus'
import SquaresPlusBlack from '@/assets/icons/SquaresPlusBlack'
import { Subtract } from '@/assets/icons/Subtract'
import { apiImage } from '@/api/fetchApi'
import { removeVietnameseTones } from '@/utils'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Interface của Select
 */
interface SelectProps {
  /**
   * Dữ liệu của các trang
   */
  options?: PageData[]

  /**
   * Placeholder
   */
  placeholder?: string | null
}

const Select2: React.FC<SelectProps> = ({ options, placeholder }) => {
  /** Import i18n */
  const { t } = useTranslation()

  /** hàm dispacth hành động của store */
  const dispatch = useDispatch()

  /** query url */
  const [search_params, setSearchParams] = useSearchParams()

  /** danh sách id các page */
  const PAGE_IDS = useSelector(selectPageId)

  /** ẩn hiện option của select */
  const [is_open, setIsOpen] = useState(false)
  /**
   * Danh sách trang từ store
   */
  const PAGE_LIST = useSelector(selectPageList) as PageData[]

  /** danh sách dữ liệu của các trang đã chọn */
  const [list_selected_value, setListSelectedValue] = useState<PageData[]>([])
  /**
   * Danh sách lọc
   */
  const [filtered_options, setFilteredOptions] = useState([])
  /**
   * Ref của select
   */
  const SELECT_REF = useRef<HTMLDivElement>(null)

  /** hàm xử lý sự kiện mở đóng modal */
  const handleToggle = () => {
    /**
     * Đảo ngược giá trị của isOpen
     */
    setIsOpen(!is_open)
  }

  /** hàm xử lý sự kiện chọn page
   * @param item: PageData
   *
   */
  const handleOptionClick = (item: PageData) => {
    /** danh sách id page mới */
    let new_page_ids = []

    /** id đã chọn tồn tại trong danh sách thì xóa đi */
    if (PAGE_IDS.includes(item.page_id))
      new_page_ids = PAGE_IDS.filter(id => id !== item.page_id)
    /** không thì sẽ thêm vào mảng */ else
      new_page_ids = [...PAGE_IDS, item.page_id]

    /** lưu lại danh sách id page vào store */
    // dispatch(setPageId(new_page_ids))

    /** ghi lại giá trị lên url */
    setSearchParams({
      ...Object.fromEntries([...search_params]),
      page_id: new_page_ids.join(','),
    })
  }

  /** hàm xử lý sự kiện bỏ chọn page */
  const handleOptionRemove = () => {
    /** danh sách id page mới */
    let new_page_ids = []

    /** lưu lại danh sách id page vào store */
    dispatch(setPageId(new_page_ids))

    /** ghi lại giá trị lên url */
    setSearchParams({
      ...Object.fromEntries([...search_params]),
      page_id: new_page_ids.join(','),
    })
  }
  /** Khi click ra ngoài thì tắt modal
   * @param event: MouseEvent
   */
  const handleClickOutside = (event: MouseEvent) => {
    /**
     * Nếu click ra ngoài thì đóng select
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

  /** Check item có đang được chọn không */
  const isSelected = (item: PageData) => {
    /**
     * Kiểm tra xem item có trong danh sách đã chọn không
     */
    return list_selected_value.some(
      selected => selected?.page_id === item.page_id,
    )
  }
  /**
   * Khởi tạo giá trị khi lấy được danh sách id page từ url hoặc có thay đổi page_id
   */
  useEffect(() => {
    /**
     * @param STRING_PAGE_IDS_URL: string
     */
    document.addEventListener('mousedown', handleClickOutside)
    /**
     * @param STRING_PAGE_IDS_URL: string
     */
    return () => {
      /**
       * Xóa sự kiện click ra ngoài
       */
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /** khởi tạo giá trị khi lấy được danh sách id page từ url hoặc có thay đổi page_id */
  useEffect(() => {
    /**
     * @param STRING_PAGE_IDS_URL: string
     */
    const STRING_PAGE_IDS_URL = search_params.get('page_id')
    /**
     * @param STRING_PAGE_IDS_URL: string
     */
    setFilteredOptions(PAGE_LIST)
    /** nếu chuỗi rỗng thì set mảng rỗng */
    if (!STRING_PAGE_IDS_URL) {
      /**
       * @param STRING_PAGE_IDS_URL: string
       */
      setListSelectedValue([])
      /**
       * @param STRING_PAGE_IDS_URL: string
       */
      return
    }

    /** nếu có thì đổi thành mảng các id */
    const ARRAY_PAGE_IDS_URL = STRING_PAGE_IDS_URL.split(',')

    /** sau đó filter lấy là thông tin của các page có trong mảng */
    setListSelectedValue(
      PAGE_LIST.filter(item => ARRAY_PAGE_IDS_URL.includes(item.page_id)),
    )
  }, [PAGE_LIST, PAGE_IDS])

  /** hàm xử lý khi truncate value
   * @param value: string
   * @returns string
   */
  const truncatedNameFunc = value =>
    value?.length > 24 ? `${value.slice(0, 22)}...` : value

  /**
   *  Nhận page_id và trả về URL ảnh
   * @param page_id: string
   * @param page_type: string
   * @returns string
   */
  const IMAGE_URL = (page_id, page_type) => {
    /**
     * Nếu là FB_MESS thì trả về URL ảnh của Facebook
     */
    if (page_type === 'FB_MESS') {
      const DATA = apiImage(
        `/app/facebook/avatar/${page_id}?width=64&height=64`,
      )
      return DATA
    } else {
      return EARTH_SVG
    }
  }

  /**
   * Hàm xử lý khi người dùng nhập vào ô input
   *  @param e: string
   */
  const handleSearch = e => {
    /**
     * Giá trị người dùng nhập vào
     */
    const VALUE = e

    /** Lọc danh sách dựa trên id hoặc name */
    const FILTERED = PAGE_LIST.filter(
      option =>
        /* Xoá dấu tiếng việt */
        removeVietnameseTones(option?.page_info?.name.toLowerCase()).includes(
          VALUE.toLowerCase(),
        ) || option?.page_id.toString().includes(VALUE),
    )

    /** Set lại danh sách options sau khi filter */
    setFilteredOptions(FILTERED)
  }

  const GROUP_ARRAY = useMemo(() => {
    console.log('🔄 Recalculating GROUP_ARRAY...')
    if (!filtered_options?.length) return []

    // Nhóm dữ liệu theo page_info.type
    const groupedData = groupBy(filtered_options, item => item?.page_info?.type)

    // Chuyển object thành array
    return toPairs(groupedData)
  }, [filtered_options]) // Chỉ tính toán lại khi `filtered_options` thay đổi
  /** Render tên nhóm các trang
   * @param group: string
   * @returns string
   */
  const renderGroup = group => {
    /**
     * Nếu là FB_MESS thì trả về Facebook
     */
    if (group === 'FB_MESS') return 'Facebook'
    /**
     * Nếu là FB_INSTAGRAM thì trả về Instagram
     */
    if (group === 'FB_INSTAGRAM') return 'Instagram'
    /**
     * Nếu là WEBSITE thì trả về Website
     */
    if (group === 'WEBSITE') return 'Website'
    /**
     * Nếu là ZALO thì trả về Zalo
     */
    if (group === 'ZALO_OA') return 'Zalo'
    /**
     * Nếu là ZALO_PERSONAL thì trả về ZALO_PERSONAL
     */
    if (group === 'ZALO_PERSONAL') return 'Zalo Cá nhân'
  }

  /** Chuyển đổi groupedData thành một mảng các cặp key-value
   * @returns array
   */

  return (
    <div
      ref={SELECT_REF}
      className="relative h-9"
    >
      <button
        className="hidden md:flex h-9  items-center justify-between w-full bg-white px-3 py-2 border rounded-lg text-left truncate line-clamp-1 min-w-56 max-w-72"
        onClick={handleToggle}
      >
        {list_selected_value.length > 0 ? (
          <div className="flex line-clamp-1 items-center text-sm">
            {list_selected_value.slice(0, 3).map((item, index) => {
              /** Truncate tên nếu nhiều hơn 1 page */
              const TRUNCATED_NAME =
                list_selected_value.length === 1
                  ? item?.page_info?.name
                  : list_selected_value.length === 2
                    ? item?.page_info?.name?.length > 15
                      ? `${item?.page_info?.name.slice(0, 13)}...`
                      : item?.page_info?.name
                    : item?.page_info?.name?.length > 10
                      ? `${item?.page_info?.name.slice(0, 8)}...`
                      : item?.page_info?.name

              return (
                <div
                  key={index}
                  className="mr-1 text-slate-700 font-normal flex"
                >
                  <p className="truncate text-sm">{TRUNCATED_NAME}</p>
                  {index < 2 && index < list_selected_value.length - 1 && ', '}
                </div>
              )
            })}
            {list_selected_value.length > 3 && (
              <p className="ml-1 p-1">(+{list_selected_value.length - 3})</p>
            )}
          </div>
        ) : (
          <h4 className="text-slate-700 text-sm">
            {placeholder || t('select_page')}
          </h4>
        )}

        <Down />
      </button>
      {/* Mobile */}
      <button
        className={`md:hidden flex h-fit items-center justify-between w-full bg-white px-2 py-2 border ${is_open ? 'border-blue-200' : 'border-slate-200'} rounded-lg text-left truncate`}
        onClick={handleToggle}
      >
        {is_open ? <SquaresPlus /> : <SquaresPlusBlack />}
      </button>
      {is_open && (
        <div>
          <div className="">
            <div className="absolute border-8 border-transparent border-b-white bottom-0 translate-y-2 right-[20%] z-10"></div>
            <div className="absolute w-72 max-h-96 h-fit md:w-72 mt-2 right-0 md:left-0 translate-x-100 md:translate-x-0 bg-white shadow-lg z-[99999999] p-2 rounded-lg flex flex-col gap-y-2">
              <input
                className="w-full bg-slate-100 p-2 rounded-lg text-sm"
                placeholder={t('search_for_page')}
                onChange={e => handleSearch(e.target.value)}
              />

              <div className="flex h-full flex-col overflow-y-auto scrollbar-webkit scrollbar-thin gap-y-2 min-h-32">
                {GROUP_ARRAY.map(([type, items], index) => {
                  return (
                    <div
                      key={type}
                      className={`${index === GROUP_ARRAY.length - 1 ? '' : 'border-b pb-2 '} flex flex-col border-color-border gap-y-2`}
                    >
                      <h4 className="ml-2 text-xs text-color-text-placeholder">
                        {renderGroup(type)}
                      </h4>
                      <div className="flex flex-col gap-y-2 ">
                        {items.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between px-2 py-2 ${isSelected(option) && 'bg-gray-100'} hover:bg-gray-100 cursor-pointer rounded-lg`}
                            onClick={() => handleOptionClick(option)}
                          >
                            <div className="flex gap-2 items-center">
                              <div className="w-8 h-8 flex-shrink-0 flex justify-center items-center text-sm">
                                <img
                                  src={
                                    option.page_info?.avatar ||
                                    IMAGE_URL(
                                      option?.page_id,
                                      option?.page_info?.type,
                                    )
                                  }
                                  alt={'logo'}
                                  style={{ objectFit: 'cover' }}
                                  className="w-8 h-8 rounded-lg flex justify-center items-center"
                                />
                              </div>
                              <div className="flex-row">
                                <p className="truncate text-sm">
                                  {truncatedNameFunc(option?.page_info?.name)}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {truncatedNameFunc(option?.page_id)}
                                </p>
                              </div>
                            </div>
                            {isSelected(option) && (
                              <div className="flex-shrink-0">
                                <Subtract />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              {list_selected_value?.length > 0 && (
                <div
                  onClick={() => {
                    handleOptionRemove()
                    setListSelectedValue([])
                  }}
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
          {/* <div className="absolute w-72 max-h-96 h-fit md:w-72 mt-2 right-0 md:left-0 translate-x-100 md:translate-x-0 bg-white shadow-lg p-2 overflow-hidden overflow-y-auto z-40">
            {filtered_options?.map((option, index) => (
              <div
                key={index}
                className={`flex w-full items-center gap-x-2 px-2 py-2 ${isSelected(option) ? 'bg-gray-100' : ''} hover:bg-gray-100 cursor-pointer rounded-lg`}
                onClick={() => handleOptionClick(option)}
              >
                <div className="w-8 h-8 flex-shrink-0 flex gap-x-2 items-center text-sm">
                  <img
                    src={
                      option.page_info?.avatar ||
                      IMAGE_URL(option?.page_id, option?.page_info?.type)
                    }
                    alt={'logo'}
                    style={{ objectFit: 'cover' }}
                    className="w-8 h-8 rounded-lg flex justify-center items-center"
                  />
                </div>
                <div className="flex-row">
                  <p className="truncate text-sm">
                    {truncatedNameFunc(option?.page_info?.name)}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {truncatedNameFunc(option?.page_id)}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      )}
    </div>
  )
}

export default Select2

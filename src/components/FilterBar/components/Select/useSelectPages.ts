import { groupBy, toPairs } from 'lodash'
import {
  selectPageId,
  selectPageList,
  setIsPageIncludesFb,
  setPageId,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'

import EARTH_SVG from '@/assets/images/earth.svg'
import { PageData } from '@/interfaces'
import { apiImage } from '@/api/fetchApi'
import { removeVietnameseTones } from '@/utils'
import { useSearchParams } from 'react-router-dom'

export const useSelectPages = () => {
  /** Hàm dispatch */
  const dispatch = useDispatch()
  /** Lấy thống tin từ URL */
  const [search_params, setSearchParams] = useSearchParams()
  /** Page ID */
  const PAGE_IDS = useSelector(selectPageId)
  /** Danh sách trang */
  const PAGE_LIST = useSelector(selectPageList) as PageData[]
  /** Trạng thái đóng mở */
  const [is_open, setIsOpen] = useState(false)
  /** Danh sách đã chọn */
  const [list_selected, setListSelected] = useState<PageData[]>([])
  /**
   * Danh sách lọc
   */
  const [filtered_options, setFilteredOptions] = useState<PageData[] | any>([])
  /** Ref */
  const SELECT_REF = useRef<HTMLDivElement>(null)
  /** Hàm toggle */
  const toggleOpen = () => setIsOpen(prev => !prev)
  /**
   *  Hàm xử lý sự kiện click ra ngoài select
   * @param event sự kiện click chuột
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      SELECT_REF.current &&
      !SELECT_REF.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  /**
   *  Hàm xử lý sự kiện search
   * @param value string
   */
  const handleSearch = (value: string) => {
    /** lower case value */
    const QUERY = value.toLowerCase()
    /** Lọc dữ liệu */
    const FILTERED = PAGE_LIST.filter(
      item =>
        removeVietnameseTones(item?.page_info?.name.toLowerCase()).includes(
          QUERY,
        ) || item.page_id.toString().includes(QUERY),
    )
    /**
     * Set lớp filter
     */
    setFilteredOptions(FILTERED)
  }

  /**
   *  Hàm xử lý sự kiện click option
   * @param item
   */
  const handleOptionClick = (item: PageData) => {
    let new_ids = PAGE_IDS.includes(item.page_id)
      ? PAGE_IDS.filter(id => id !== item.page_id)
      : [...PAGE_IDS, item.page_id]
    /** Cập nhật url */
    setSearchParams({
      ...Object.fromEntries([...search_params]),
      page_id: new_ids.join(','),
    })
  }
  /**
   *  Hàm xử lý sự kiện clear selection
   */
  const handleClearSelection = () => {
    dispatch(setPageId([]))
    setSearchParams({
      ...Object.fromEntries([...search_params]),
      page_id: '',
    })
    setListSelected([])
  }
  /**
   *  Hàm xử lý sự kiện chọn page
   * @param item
   * @returns
   */
  const isSelected = (item: PageData) =>
    list_selected.some(i => i.page_id === item.page_id)

  /** Hàm xử lý truncate */
  const truncatedName = (value?: string) =>
    value?.length > 24 ? `${value.slice(0, 22)}...` : value

  /**
   *  Nhận page_id và trả về URL ảnh
   * @param page_id
   * @param type
   * @returns
   */
  const getImageUrl = (page_id: string, type: string) =>
    type === 'FB_MESS' ? apiImage(`/media/fb/${page_id}/page`) : EARTH_SVG
  /**
   * Xử lý group page
   */
  const GROUP_ARRAY = useMemo(() => {
    /**
     * Lớp dữ liệu theo page_info.type
     */
    if (!filtered_options.length) return []
    /**
     * Nhóm dữ liệu theo page_info.type
     */
    const GROUPED = groupBy(filtered_options, item => item.page_info?.type)
    /**
     * Chuyển object thanh array
     */
    return toPairs(GROUPED)
  }, [filtered_options])

  /**
   *  Render tên nhóm trang
   * @param group
   * @returns
   */
  const renderGroupName = (group: string) => {
    switch (group) {
      case 'FB_MESS':
        return 'Facebook'
      case 'FB_INSTAGRAM':
        return 'Instagram'
      case 'WEBSITE':
        return 'Website'
      case 'ZALO_OA':
        return 'Zalo'
      case 'ZALO_PERSONAL':
        return 'Zalo Cá nhân'
      default:
        return group
    }
  }
  /**
   * Xử lý sự kiện click ra ngoài select
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /**
   * Xử lý sự kiện chọn page
   */
  useEffect(() => {
    /**
     * @param STRING_PAGE_IDS_URL: string
     */
    const ID_STR = search_params.get('page_id')
    /**
     * Lưu lớp filter
     */
    setFilteredOptions(PAGE_LIST)
    /**
     * Nếu chuỗi rừng thì set mảng rừng
     */
    if (!ID_STR) {
      /**
       * Reset lớp selected
       */
      setListSelected([])
      /**
       * Cập nhật trạng thái bằng false
       */
      dispatch(setIsPageIncludesFb(false))
      return
    }
    /**
     * Trần chuyển string thanh mảng
     */
    const IDS = ID_STR.split(',')
    /**
     * Lớp dữ liệu theo page_id
     */
    const SELECTED = PAGE_LIST.filter(p => IDS.includes(p.page_id))
    /** Cập nhật list selected */
    setListSelected(SELECTED)
    /**
     *  Cập nhật trạng thái bằng true
     */
    const HAS_FB_MES = SELECTED.some(p => p.page_info?.type === 'FB_MESS')
    dispatch(setIsPageIncludesFb(HAS_FB_MES))
  }, [PAGE_LIST, PAGE_IDS])

  return {
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
  }
}

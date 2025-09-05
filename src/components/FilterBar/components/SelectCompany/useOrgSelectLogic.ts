import { setOrgId, setPageId, setUserRole } from '@/stores/appSlice'
import { useEffect, useRef, useState } from 'react'

import { OrganizationData } from '@/interfaces'
import { removeVietnameseTones } from '@/utils'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

export const useOrgSelectLogic = (options: OrganizationData[]) => {
  /**
   * Hàm dispatch
   */
  const dispatch = useDispatch()
  /**
   * Ref của select
   */
  const SELECT_REF = useRef<HTMLDivElement>(null)
  /**
   * Láy giá trị từ url
   */
  const [search_params, setSearchParams] = useSearchParams()
  /**
   * Láy giá trị tổ chức từ url
   */
  const DEFAULT_URL_ID = search_params.get('org_id')
  /** Trạng thái mở thanh select */
  const [is_open, setIsOpen] = useState(false)
  /**
   * Giá trị chọn trên select
   */
  const [selected_value, setSelectedValue] = useState<OrganizationData>({})
  /**
   * Danh sách lọc
   */
  const [filtered_options, setFilteredOptions] = useState<OrganizationData[]>(
    [],
  )
  /**
   *  Mở thanh select
   * @returns Mở thanh select
   */
  const handleToggle = () => setIsOpen(!is_open)

  /**
   *  Hàm xử lý sự kiện chọn tổ chức
   * @param data dữ liệu tổ chức
   */
  const handleOptionClick = (data: OrganizationData) => {
    /**
     * Ghi vào store
     */
    dispatch(setOrgId(data?.org_id))

    /** Reset danh sách page */
    dispatch(setPageId([]))
    /**
     * Ghi lại giá trị lên url
     */
    setSearchParams({
      ...Object.fromEntries([...search_params]),
      org_id: data?.org_id,
      page_id: '',
    })
    /**
     * Lưu role của bm trên store
     */
    dispatch(setUserRole(data?.current_ms?.ms_role))
    /** Lưu state */
    setSelectedValue(data)
    /** Tắt popup */
    setIsOpen(false)
  }

  /** Hàm xử lý sự kiện click ra ngoại select
   * @param event: MouseEvent
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
   *  Kiem tra xem item nay da duoc chon chua
   * @param item dữ liệu
   * @returns
   */
  const isSelected = (item: OrganizationData): boolean =>
    selected_value?.org_id === item.org_id

  /**
   *  Hàm xử lý khi người dùng nhập vào ô input
   * @param value
   */
  const handleSearch = (value: string) => {
    /**
     * Lọc danh sách dựa trên id hoặc name
     */
    const FILTERED = options.filter(option =>
      removeVietnameseTones(
        option?.org_info?.org_name.toLowerCase() || '',
      ).includes(removeVietnameseTones(value.toLowerCase())),
    )
    /**
     * Set lớp filter
     */
    setFilteredOptions(FILTERED)
  }
  /**
   * Khi options thay đổi
   * @param options
   */
  useEffect(() => {
    /**
     * Lưu lớp filter
     */
    setFilteredOptions(options)
    /**
     * Lưu giá trị chọn trên url
     */
    if (!options.length || !DEFAULT_URL_ID) return
    /**
     * Tìm ra phần tử cô id giống với phần tử khởi tạo
     */
    const DATA = options.find(item => item.org_id === DEFAULT_URL_ID)
    /**
     * Gán phần tử value được chọn
     */
    setSelectedValue(DATA || {})
    /**
     * Lưu role của bm trên store
     */
    dispatch(setUserRole(DATA?.current_ms?.ms_role))
  }, [options])
  /**
   * Sự kiện click ra ngoại select
   */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return {
    SELECT_REF,
    is_open,
    handleToggle,
    selected_value,
    handleOptionClick,
    handleSearch,
    filtered_options,
    isSelected,
  }
}

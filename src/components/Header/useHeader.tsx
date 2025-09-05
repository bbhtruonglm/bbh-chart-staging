import { apiGetPageInfo, apiGetPages, apiImage } from '@/api/fetchApi'
import {
  selectOrgId,
  selectPartnerInfo,
  selectUnreadNotification,
  selectUserInfo,
  selectUserRole,
  setLabelList,
  setPageList,
  setStaffList,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
// hooks/useHeaderLogic.ts
import { useEffect, useRef, useState } from 'react'

import { PageData } from '@/interfaces'
import { keys } from 'lodash'

export function useHeaderLogic() {
  /** Hàm dispatch */
  const dispatch = useDispatch()
  /** User info */
  const USER_INFO = useSelector(selectUserInfo)
  /** User role */
  const USER_ROLE = useSelector(selectUserRole)
  /** ID tổ chức */
  const ORG_ID = useSelector(selectOrgId)
  /** Thông tin partner */
  const PARTNER_INFO = useSelector(selectPartnerInfo)
  /**
   * Danh sách thống báo chưa xem
   */
  const UNREAD_NOTIFICATION = useSelector(selectUnreadNotification)

  /**
   * Lấy ID của nhân viên facebook
   */
  const USER_ID = USER_INFO?.user_id
  /**
   * Link avatar
   */
  const LINK_AVATAR = apiImage(`/media/s/${USER_ID}/user`)
  /**
   * Trạng thái mobile
   */
  const [is_mobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
  /** Trạng thái mở popover */
  const [is_popover_open, setIsPopoverOpen] = useState<boolean>(false)
  /**
   * Danh sách trang
   */
  const [pages, setPages] = useState<PageData[]>([])
  /**
   * Ref cua popover
   */
  const POPOVER_REF = useRef<HTMLDivElement>(null)
  /** Token từ localStorage */
  const TOKEN = localStorage.getItem('access_token') || ''
  /**
   *  Hàm mô tả popover
   * @returns
   */
  const togglePopover = () => setIsPopoverOpen(prev => !prev)
  /** Xử lý khi resize */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  /** Hàm click ngoài popover */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        POPOVER_REF.current &&
        !POPOVER_REF.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  /**
   * Xử lý khi thay đổi trạng thái mobile
   */
  useEffect(() => {
    if (is_mobile && ORG_ID) {
      fetchPagesAndStoreData()
    }
  }, [is_mobile, ORG_ID])

  /**
   *  Lay danh sach trang va luu vao redux
   * @returns
   */
  const fetchPagesAndStoreData = async () => {
    try {
      /**
       * Lấy danh sách trang
       */
      const RES = await apiGetPages({ body: { org_id: ORG_ID } })
      if (!RES) return
      /**
       * Lưu danh sách trang vào state
       */
      setPages(RES.data)
      /** Lưu danh sách trang vào redux */
      dispatch(setPageList(RES.data))
      /** Lấy ra danh sách ID Trang */
      const PAGE_IDS = RES.data.map((item: PageData) => item.page_id)
      /** Nếu không có trang nào thì return */
      if (PAGE_IDS.length === 0) return
      /**
       * Lấy thông tin của các trang
       */
      const RES_2 = await apiGetPageInfo({ body: { list_page_id: PAGE_IDS } })
      /**
       * Nếu có dữ liệu trả về thì lưu vào store
       */
      if (!RES_2) return
      /**
       * Xử lý danh sách người dùng
       */
      const ALL_STAFF_INFO = Object.assign(
        {},
        ...keys(RES_2.data).map(key => RES_2.data[key].staff_list),
      )
      /**
       * Xử lý danh sách label
       */
      const ALL_LABEL_INFO = Object.assign(
        {},
        ...keys(RES_2.data).map(key => RES_2.data[key].label_list),
      )
      /** Cập nhật danh sách người dùng và label */
      dispatch(setStaffList(ALL_STAFF_INFO))
      dispatch(setLabelList(ALL_LABEL_INFO))
    } catch (err) {
      console.error('Failed to fetch page data', err)
    }
  }

  return {
    USER_INFO,
    USER_ROLE,
    PARTNER_INFO,
    UNREAD_NOTIFICATION,
    TOKEN,
    LINK_AVATAR,
    is_mobile,
    is_popover_open,
    togglePopover,
    POPOVER_REF,
    pages,
  }
}

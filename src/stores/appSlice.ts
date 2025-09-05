import { Retion, Staff, User } from '@/interfaces'

import { Label } from '@/interfaces/label'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/stores'
import { createSlice } from '@reduxjs/toolkit'

/**
 * Dữ liệu của app
 */
export interface AppState {
  /** access_token dùng để auth khi call, api lấy từ url */
  access_token: string
  /** danh sách id của các page cần được thống kê  */
  page_id: string[]
  /** id của tổ chức cần thống kê */
  org_id: string
  /** khoảng thời gian lọc */
  filter_time: {
    /** ngày bắt đầu lọc */
    start_time: number
    /** ngày kết thúc lọc */
    end_time: number
  }
  /** thông tin của người dùng */
  user_info: User

  /** danh sách dữ liệu nhân viên lưu dạng object
   * key: id nhân viên
   */
  staff_list: {
    [key: string]: Staff
  }

  /** danh sách dữ liệu Nhãn
   * key: id nhãn
   */
  label_list: {
    [key: string]: Label
  }

  /** danh sách dữ liệu trang */
  page_list: {
    /**
     * id trang
     */
    page_id: string
    /**
     * thông tin trang
     */
    page_info: {
      /**
       * tên trang
       */
      name: string
    }
  }[]

  /** locale hiện tại */
  locale?: string
  /** Thông tin partner */
  partner_info: Retion
  /**
   * user role
   */
  user_role?: string

  /**
   * unread notification
   */
  unread_notification?: number
  /**
   * list notification
   */
  list_notification?: any[]
  /** page includes fb */
  is_page_includes_fb?: boolean
}
/**
 * Dữ liệu khởi tạo của app
 */
const INITIAL_STATE: AppState = {
  access_token: '',
  page_id: [],
  org_id: '',
  filter_time: {
    start_time: 0,
    end_time: 0,
  },
  user_info: {},
  staff_list: {},
  label_list: {},
  page_list: [],
  locale: 'vi',
  partner_info: {},
  user_role: '',
  unread_notification: 0,
  list_notification: [],
  is_page_includes_fb: false,
}
/**
 * Slice của app
 */
export const APP_SLICE = createSlice({
  name: 'app',
  initialState: INITIAL_STATE,
  reducers: {
    /** lưu access_token */
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload
    },
    /** lưu page_id */
    setPageId: (state, action: PayloadAction<string[]>) => {
      state.page_id = action.payload
    },
    /** lưu org_id */
    setOrgId: (state, action: PayloadAction<string>) => {
      state.org_id = action.payload
    },
    /** lưu thời gian lọc */
    setFilterTime: (state, action: PayloadAction<AppState['filter_time']>) => {
      state.filter_time = action.payload
    },
    /** lưu user_info */
    setUserInfo: (state, action: PayloadAction<AppState['user_info']>) => {
      state.user_info = action.payload
    },
    /** lưu partner_info */
    setPartnerInfo: (
      state,
      action: PayloadAction<AppState['partner_info']>,
    ) => {
      state.partner_info = action.payload
    },
    /** lưu dữ liệu nhân viên */
    setStaffList: (state, action: PayloadAction<AppState['staff_list']>) => {
      state.staff_list = action.payload
    },
    /** lưu dữ liệu Nhãn */
    setLabelList: (state, action: PayloadAction<AppState['label_list']>) => {
      state.label_list = action.payload
    },
    /** lưu dữ liệu Trang */
    setPageList: (state, action: PayloadAction<AppState['page_list']>) => {
      state.page_list = action.payload
    },
    /** lưu dữ liệu Trang */
    setLocale: (state, action: PayloadAction<AppState['locale']>) => {
      state.locale = action.payload
    } /** lưu dữ liệu user role */,
    setUserRole: (state, action: PayloadAction<AppState['user_role']>) => {
      state.user_role = action.payload
    },
    /** lưu dữ liệu số tin nhắn chưa đọc */
    setUnreadNotification: (
      state,
      action: PayloadAction<AppState['unread_notification']>,
    ) => {
      state.unread_notification = action.payload
    },
    /** lưu danh sách tin nhắn */
    setListNotification: (
      state,
      action: PayloadAction<AppState['list_notification']>,
    ) => {
      state.list_notification = action.payload
    },
    /** lưu dữ liệu page includes fb */
    setIsPageIncludesFb: (state, action: PayloadAction<boolean>) => {
      state.is_page_includes_fb = action.payload
    },
  },
})

/** Action creators are generated for each case reducer function */
export const {
  setAccessToken,
  setPageId,
  setOrgId,
  setFilterTime,
  setUserInfo,
  setStaffList,
  setLabelList,
  setPageList,
  setLocale,
  setPartnerInfo,
  setUserRole,
  setUnreadNotification,
  setListNotification,
  setIsPageIncludesFb,
} = APP_SLICE.actions

/** chọn đến access_token */
export const selectAccessToken = (state: RootState) => state.app.access_token

/** chọn đến page id */
export const selectPageId = (state: RootState) => state.app.page_id

/** chọn đến org id */
export const selectOrgId = (state: RootState) => state.app.org_id

/** chọn đến thời gian lọc */
export const selectFilterTime = (state: RootState) => state.app.filter_time

/** chọn đến thông tin người dùng */
export const selectUserInfo = (state: RootState) => state.app.user_info

/** chọn đến thông tin người dùng */
export const selectPartnerInfo = (state: RootState) => state.app.partner_info

/** chọn đầu dữ liệu nhân viên */
export const selectStaffList = (state: RootState) => state.app.staff_list

/** chọn đầu dữ liệu Nhãn */
export const selectLabelList = (state: RootState) => state.app.label_list

/** chọn đầu dữ liệu Page */
export const selectPageList = (state: RootState) => state.app.page_list

/** chọn đầu dữ liệu Locale */
export const selectLocale = (state: RootState) => state.app.locale
/** chọn đầu dữ liệu User role */
export const selectUserRole = (state: RootState) => state.app.user_role
/** chọn đầu dữ liệu số thông báo chưa đọc */
export const selectUnreadNotification = (state: RootState) =>
  state.app.unread_notification
/** chọn đầu dữ liệu danh sách thông báo */
export const selectListNotification = (state: RootState) =>
  state.app.list_notification

/** chọn đầu dữ liệu page includes fb */
export const selectIsPageIncludesFb = (state: RootState) =>
  state.app.is_page_includes_fb

export default APP_SLICE.reducer

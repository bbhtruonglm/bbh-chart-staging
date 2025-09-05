import { createSlice } from '@reduxjs/toolkit'
import { debounce } from 'lodash'
/**
 * Khởi tạo state
 */
const INITIAL_STATE = {
  /**
   * Thông báo
   */
  message: null,
  /** 'error' or 'success' */
  type: null,
}

/** Tạo slice quản lý thông báo */
const NOTIFY_SLICE = createSlice({
  name: 'notify',
  initialState: INITIAL_STATE,
  reducers: {
    /**
     *  Set thông báo
     * @param state  trạng thái hiện tại
     * @param action  hành động
     */
    setNotification: (state, action) => {
      /**
       * Gán message và type từ action
       */
      state.message = action.payload.message
      /**
       * Gán type từ action
       */
      state.type = action.payload.type
    },
    /**
     *  Xóa thông báo
     * @param state  trạng thái hiện tại
     */
    clearNotification: (state) => {
      /**
       * Xóa message và type
       */
      state.message = null
      /**
       * Xóa type
       */
      state.type = null
    },
  },
})
/**
 * Export các hàm và biến cần thiết
 */
export const { setNotification, clearNotification } = NOTIFY_SLICE.actions

/** Debounce toàn cục để đảm bảo chỉ có thông báo cuối cùng
 * được hiển thị trong thời gian ngắn
 * @param dispatch
 * @param message
 * @param type
 *
 */
const debouncedNotify = debounce((dispatch, message, type) => {
  /**
   * Gọi hàm setNotification
   */
  dispatch(setNotification({ message, type }))
  /** Thời gian debounce 300ms, có thể thay đổi */
}, 300)

/** Action creator để dispatch notify với debounce toàn cục */
export const notifyWithDebounce =
  (message, type = 'error') =>
  (dispatch) => {
    debouncedNotify(dispatch, message, type)
  }
/**
 * Export reducer
 */
export default NOTIFY_SLICE.reducer

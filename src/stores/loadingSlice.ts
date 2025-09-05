import { createSlice } from '@reduxjs/toolkit'
/**
 * Thông tin user
 */
const INITIAL_STATE = {
  /** Dùng để đếm số API đang chạy */
  loadingCounter: 0,
}
/**
 * Tên của slice
 */
const LOADING_SLICE = createSlice({
  name: 'loading',
  initialState: INITIAL_STATE,
  reducers: {
    /**
     *  Tăng counter khi có API call
     * @param state state của store
     */
    startLoading: (state) => {
      /** Mỗi khi có API call bắt đầu, tăng counter */
      state.loadingCounter += 1
    },
    /**
     *  Giảm counter khi kết thúc API call
     * @param state state của store
     */
    stopLoading: (state) => {
      if (state.loadingCounter > 0) {
        /** Mỗi khi API call kết thúc, giảm counter */
        state.loadingCounter -= 1
      }
    },
  },
})
/**
 * Export các hàm và biến cần thiết
 */
export const { startLoading, stopLoading } = LOADING_SLICE.actions

/** True khi có ít nhất một API call */
export const selectLoading = (state) => state.loading.loadingCounter > 0
/**
 *  Trả về số API đang chạy
 * @param state  state của store
 * @returns  số API đang chạy
 */
export const selectLoadingCounter = (state) => state.loading.loadingCounter
/**
 * Export reducer
 */
export default LOADING_SLICE.reducer

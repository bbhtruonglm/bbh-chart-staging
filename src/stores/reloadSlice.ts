import { createSlice } from '@reduxjs/toolkit'
/**
 * Khởi tạo slice quản lý reload
 */
const RELOAD_SLICE = createSlice({
  name: 'reload',
  initialState: {
    /** Mặc định là false */
    reload_flag: false,
    /**
     * Trigger reload
     */
    trigger_reload: false,
  },
  reducers: {
    /**
     *  Hàm bắt đầu reload
     * @param state state của store
     */
    startReload: (state) => {
      /** Khi nhấn nút, chuyển trạng thái thành true */
      state.reload_flag = true
    },
    /**
     * Hàm reset reload
     * @param state state của store
     */
    resetReload: (state) => {
      /** Sau khi API gọi xong, reset lại về false */
      state.trigger_reload = false
    },
    /**
     * Hàm set trigger reload
     * @param state state của store
     */
    setTriggerReload: (state) => {
      /**
       *  Khi nhấn nút, chuyển trạng thái thành true
       */
      state.trigger_reload = !state.trigger_reload
    },
  },
})
/**
 * Export các hàm và biến cần thiết
 */
export const { startReload, resetReload, setTriggerReload } =
  RELOAD_SLICE.actions

/** Selector để lấy trạng thái reloadFlag từ store */
export const selectReloadFlag = (state) => state.reload.reload_flag
/**
 *  Selector để lấy trạng thái triggerReload từ store
 * @param state  state của store
 * @returns  trạng thái triggerReload
 */
export const selectTriggerReload = (state) => state.reload.trigger_reload
/**
 * Export reducer
 */
export default RELOAD_SLICE.reducer

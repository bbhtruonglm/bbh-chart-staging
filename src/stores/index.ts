import appReducer from '@/stores/appSlice'
import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '@/stores/loadingSlice'
import notifyReducer from '@/stores/notifySlice'
import reloadReducer from '@/stores/reloadSlice'
/**
 * Tạo store với các reducer đã được cấu hình
 * Không được đôi tên store
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
    notify: notifyReducer,
    loading: loadingReducer,
    reload: reloadReducer,
  },
  /** Optional: Thêm middleware nếu bạn có cấu hình cụ thể */
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
})

/** Infer the `RootState` and `AppDispatch` types from the store itself */
export type RootState = ReturnType<typeof store.getState>
/** Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState} */
export type AppDispatch = typeof store.dispatch

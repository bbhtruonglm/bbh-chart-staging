import './App.css'
import './i18n'

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { Suspense, lazy, useContext, useEffect, useState } from 'react'
import {
  fetchApiNoti,
  getPartnerInfo,
  getUserInfo,
} from './services/fetchApiApp'
import {
  setAccessToken,
  setLocale,
  setOrgId,
  setPageId,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'

import AIAnalyticScreen from './pages/AIAnalytic/AIAnalyticScreen'
import { API_HOST } from './services/env'
import FilterBar from '@/components/FilterBar/FilterBar'
import GlobalLoadingIndicator from './components/LoadingIndicator/GlobalLoadingIndicator'
import { HOST } from './api/fetchApi'
import Header from '@/components/Header/Header'
import ModalInformation from './components/Modal/ModalInformation/ModalInformation'
import ModalNotification from './components/Modal/ModalNotification'
import { NetworkContext } from './components/NWProvider'
import { RootState } from './stores'
import Sidebar from '@/components/SideBar/Sidebar'
import { renderRoutes } from './utils'
import { t } from 'i18next'
import useNotify from './hooks/useNotify'

/** Lazy load components */
/**
 * Lazy load AdsScreen
 */
const AdsScreen = lazy(() => import('@/pages/Ads/AdsScreen'))
/**
 * Lazy load EmotionalScreen
 */
const EmotionalScreen = lazy(() => import('@/pages/Emotional/EmotionalScreen'))
/**
 * Lazy load NotFound
 */
const NotFound = lazy(() => import('@/pages/NotFound'))
/**
 * Lazy load OverviewScreen
 */
const OverviewScreen = lazy(() => import('@/pages/Overview/OverviewScreen'))
/**
 * Lazy load PageScreen
 */
const PageScreen = lazy(() => import('@/pages/Pages/PageScreen'))
/**
 * Lazy load StaffScreen
 */
const StaffScreen = lazy(() => import('@/pages/Staff/StaffScreen'))
/**
 * Lazy load TagScreen
 */
const TagScreen = lazy(() => import('@/pages/Tags/TagScreen'))

function App() {
  /**
   * query url của trang
   */
  const [search_params] = useSearchParams()
  /**
   * Trạng thái mở menu
   */
  const [on_open_menu, setOnOpenMenu] = useState(false)
  /**
   * Lấy notify được lưu trong store
   */
  const NOTIFY = useSelector((state: RootState) => state.notify)
  /**
   * Trạng thái Modal Thông tin
   */
  const [is_info_modal_open, setIsInfoModalOpen] = useState(false)
  /**
   * Trạng thái Modal Thông Báo
   */
  const [is_notification_modal_open, setIsNotificationModalOpen] =
    useState(false)
  /**
   * trạng thái online
   */
  const { is_online: IS_ONLINE, show_reconnect: SHOW_RECONNECT } =
    useContext(NetworkContext)

  /**
   * Sử dụng useNotify để trigger toast
   */
  useNotify(NOTIFY)
  /**
   * Navigate
   */
  const navigate = useNavigate()
  /**
   * Lấy access_token
   * access_token lấy từ URL hoặc trong localStorage
   * 24/9/24
   * CHECK LAI LUONG
   */
  const ACCESS_TOKEN =
    search_params.get('access_token') || localStorage.getItem('access_token')
  /**
   * Lấy Page_id từ URL
   */
  const PAGE_ID = search_params.get('page_id')
  /**
   * Lấy Org_id từ URL
   */
  const ORG_ID = search_params.get('org_id')
  /**
   * Lấy locale từ URL
   */
  const LOCALE = search_params.get('locale')
  /**
   * Lấy locale từ localStorage
   */
  const STORED_LOCALE = localStorage.getItem('locale')
  /**
   * Hàm dispacth hành động
   */
  const dispatch = useDispatch()

  /**
   * Cập nhật tiêu đề trang và favicon
   */
  useEffect(() => {
    /**
     * Hàm gọi api lấy thông tin đối tác
     */
    const fetchPartnerInfo = async () => {
      /**
       * Gọi hàm getPartnerInfo
       */
      const RES = await getPartnerInfo(dispatch)
      /**
       * Nếu có dữ liệu trả về thì cập nhật tiêu đề trang và favicon
       */
      if (RES) {
        /**
         * Cập nhật tiêu đề trang
         */
        document.title = `${RES.name}`
        /**
         * Cập nhật favicon
         */
        const FAVICON = document.getElementById('favicon') as HTMLLinkElement
        /**
         *  Nếu có thì cập nhật lại href
         */
        if (FAVICON) {
          /**
           * Cập nhật href
           */
          FAVICON.href = RES.logo.icon
        } else {
          /**
           * Nếu không có thì tạo mới
           */
          const NEW_FAVICON = document.createElement('link')
          /**
           * Set id
           */
          NEW_FAVICON.id = 'favicon'
          /**
           * Set rel
           */
          NEW_FAVICON.rel = 'icon'
          /**
           * Set href
           */
          NEW_FAVICON.href = RES.logo.icon
          /**
           * Thêm vào head
           */
          document.head.appendChild(NEW_FAVICON)
        }
      }
    }
    fetchPartnerInfo()
  }, [])

  /**
   * Lần đầu vào sẽ đọc dữ liệu ở url và lưu lại trong store
   */
  useEffect(() => {
    /**
     * Nếu không có access_token thì chuyển hướng sang trang oauth
     */
    if (!ACCESS_TOKEN || ACCESS_TOKEN === '') {
      /**
       * Lấy access_token từ localStorage
       */
      const STORED_TOKEN = localStorage.getItem('access_token')
      /**
       * Nếu không có access_token thì chuyển hướng sang trang oauth
       */
      if (!STORED_TOKEN) {
        /**
         * Chuyển hướng sang trang oauth
         */
        window.location.href = `${HOST['root_domain']}/chat/oauth/login`
      }
    }
    /**
     * Nếu có access_token thì lưu vào store và xóa access_token trong url
     */
    if (ACCESS_TOKEN) {
      /**
       * Lưu access_token vào store
       */
      dispatch(setAccessToken(ACCESS_TOKEN))
      /**
       * Xóa access_token trong url
       */
      localStorage.setItem('access_token', ACCESS_TOKEN)
      /**
       * Xóa access_token trong url
       */
      search_params.delete('access_token')
      /**
       * Chuyển hướng lại với url không có access_token
       */
      navigate(
        {
          pathname: window.location.pathname,
          search: search_params.toString(),
        },
        { replace: true },
      )
    }

    /**
     * Nếu có PAGE_ID thì lưu vào store
     */
    if (PAGE_ID) dispatch(setPageId(PAGE_ID.split(',')))
    /**
     * Nếu có ORG_ID thì lưu vào store
     */
    if (ORG_ID) {
      /**
       * Lưu org_id vào store
       */
      dispatch(setOrgId(ORG_ID))
      /**
       * Gọi hàm fetchApiNoti
       */
      fetchApiNoti(ORG_ID, dispatch)
    }
    /**
     * Nếu có LOCALE thì lưu vào store
     */
    if (LOCALE) dispatch(setLocale(LOCALE))
    /**
     * Nếu có STORED_LOCALE thì lưu vào store
     */
    getUserInfo(dispatch, navigate)
  }, [PAGE_ID, ORG_ID, LOCALE, ACCESS_TOKEN])

  /**
   * Hàm để đóng menu
   */
  const closeMenu = () => {
    /**
     * Set trạng thái mở menu về false
     */
    setOnOpenMenu(false)
  }

  return (
    <div>
      {!IS_ONLINE && (
        <div className="flex justify-center items-center fixed inset-0 bg-red-500 p-2 h-8 text-white text-sm z-50">
          {t('disconnected')}
        </div>
      )}
      {SHOW_RECONNECT && (
        <div className="flex justify-center items-center fixed inset-0 bg-green-500 p-2 h-8 text-white text-sm z-50">
          {t('reconnected')}
        </div>
      )}
      {ACCESS_TOKEN && (
        <div className="flex flex-col w-screen h-screen bg-white md:bg-bg-gradient md:p-3 md:gap-y-3">
          {on_open_menu && (
            <div
              className="fixed inset-0 bg-black opacity-15 z-40"
              onClick={closeMenu}
            ></div>
          )}
          <div className="flex-shrink-0">
            <Header
              handleOpenMenu={() => {
                setOnOpenMenu(true)
              }}
              handleOpenInfoModal={() => setIsInfoModalOpen(true)}
              handleOpenNotificationModal={() =>
                setIsNotificationModalOpen(true)
              }
            />
          </div>
          <div className="flex flex-grow min-h-0 w-full gap-x-3 mt-11 md:mt-0">
            <div
              className={`rounded-lg transform transition-transform duration-300 ease-in-out ${on_open_menu ? 'block fixed top-0 z-50 w-2/3 h-full' : 'hidden '} flex-shrink-0 md:w-56 rounded-lg md:block md:translate-x-0`}
            >
              <Sidebar onClose={closeMenu} />
            </div>
            <div className="flex flex-col flex-grow min-w-0 min-h-0 rounded-lg gap-y-3">
              <div className={`hidden md:block`}>
                <FilterBar />
              </div>
              <div className="flex w-full flex-grow min-h-0 rounded-lg">
                <GlobalLoadingIndicator />
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to={renderRoutes(`/dashboard`)} />}
                    />
                    <Route
                      path={renderRoutes(`/dashboard`)}
                      element={<OverviewScreen />}
                    />
                    <Route
                      path={renderRoutes(`/ai-analytic`)}
                      element={<AIAnalyticScreen />}
                    />
                    <Route
                      path={renderRoutes(`/page`)}
                      element={<PageScreen />}
                    />
                    <Route
                      path={renderRoutes(`/staff`)}
                      element={<StaffScreen />}
                    />
                    <Route
                      path={renderRoutes(`/ads`)}
                      element={<AdsScreen />}
                    />
                    <Route
                      path={renderRoutes(`/tags`)}
                      element={<TagScreen />}
                    />
                    <Route
                      path={renderRoutes(`/emotional`)}
                      element={<EmotionalScreen />}
                    />
                    <Route
                      path={renderRoutes(`/not-found`)}
                      element={<NotFound />}
                    />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>
          <ModalInformation
            is_open={is_info_modal_open}
            onClose={() => setIsInfoModalOpen(false)}
          />
          <ModalNotification
            is_open={is_notification_modal_open}
            onClose={() => {
              setIsNotificationModalOpen(false)
            }}
            onSubmit={() => {
              setIsNotificationModalOpen(false)
            }}
          />
        </div>
      )}
      {!ACCESS_TOKEN && (
        <div>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={renderRoutes(`/access_denied`)} />}
            />
            <Route
              path={renderRoutes(`/access_denied`)}
              element={<NotFound />}
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App

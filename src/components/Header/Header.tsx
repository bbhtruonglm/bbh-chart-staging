import { ArrowPathIcon, Bars3Icon } from '@heroicons/react/24/solid'
import { setTriggerReload, startReload } from '@/stores/reloadSlice'

import DividerY from '../Divider/DividerY'
import { HOST } from '@/api/fetchApi'
import IconTag from './IconTag'
import Select from '../FilterBar/components/Select/Select'
import SelectDate from '@/components/FilterBar/components/SelectDate'
import { renderPathName } from '@/utils'
import { t } from 'i18next'
import { useDispatch } from 'react-redux'
import { useHeaderLogic } from './useHeader'
import { useLocation } from 'react-router-dom'

/**
 * Interface của props của component
 */
interface IProps {
  /**
   * Mở menu
   * @param e giá trị boolean
   */
  handleOpenMenu: (e: boolean) => void
  /**
   * Mở modal thông tin
   * @param e giá trị boolean
   */
  handleOpenInfoModal: (e: boolean) => void
  /**
   * Mở modal thông báo
   * @param e giá trị boolean
   */
  handleOpenNotificationModal: (e: boolean) => void
}
function Header({
  handleOpenMenu,
  handleOpenInfoModal,
  handleOpenNotificationModal,
}: IProps) {
  const {
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
  } = useHeaderLogic()
  /** List Business Tags */
  const BUSINESS_TAGS = [
    {
      title: t('_business_setting'),
      path: HOST['business_config'],
      icon: 'company',
      new_tab: true,
    },
    {
      title: t('_manage_staff'),
      path: HOST['business_config'],
      icon: 'users',
      new_tab: true,
    },
    {
      title: t('_manage_upgrade_package'),
      path: HOST['business_upgrade_package'],
      icon: 'package',
      new_tab: true,
    },
    {
      title: t('_app_market'),
      path: HOST['business_app_market'],
      icon: 'app',
      new_tab: true,
    },
  ]
  /** list Personal Tags */
  const PERSONAL_TAGS = [
    {
      title: t('_info'),
      path: '#',
      icon: 'user',
      onClick: () => handleOpenInfoModal(true),
    },
    {
      title: t('_notification'),
      path: '#',
      icon: 'bell',
      onClick: () => handleOpenNotificationModal(true),
      notification_count: UNREAD_NOTIFICATION,
    },
    {
      title: t('_access_admin'),
      path: `${HOST['business_dashboard']}?locale=vn&token=${TOKEN}`,
      icon: 'dashboard',
      new_tab: true,
    },
    {
      title: t('_logout'),
      path: HOST['business_logout'],
      icon: 'logout',
      onClick: () => localStorage.clear(),
    },
  ]
  /** Hàm dispatch */
  const dispatch = useDispatch()
  /** Lấy vị trí */
  const LOCATION = useLocation()

  return (
    /** z-index của header (mobile) thấp hơn overlay và sidebar */
    <div className="fixed md:static z-30 flex w-full p-1 md:px-6 md:py-3 items-center justify-between rounded-lg bg-white">
      <div className="hidden md:flex justify-between items-center w-full">
        <div className="flex h-11 items-center">
          <div className="flex items-center gap-x-1">
            <div className="flex justify-center items-center">
              {/* <RetionLogo /> */}
              <img
                src={PARTNER_INFO?.logo?.full || ''}
                alt="logo"
                className="w-32 h-8"
                // onError={(e) => {
                //   const target = e.target as HTMLImageElement
                //   target.onerror = null // Prevent infinite loop if fallback image also fails
                //   target.src = '/images/LogoRetion.svg' // Path to fallback local image
                // }}
              />
            </div>
          </div>
        </div>
        {/* <div>
          <img
            src={LINK_AVATAR}
            className="w-9 h-9 rounded-full"
          />
        </div> */}
        <div
          className="relative cursor-pointer "
          onClick={togglePopover}
          ref={POPOVER_REF}
        >
          <div className="relative">
            <img
              src={LINK_AVATAR}
              className="w-9 h-9 rounded-full hover:brightness-90"
              alt="avatar"
              loading="lazy"
            />
            {UNREAD_NOTIFICATION > 0 && (
              <div className="absolute flex w-5 h-5 justify-center items-center rounded-full border border-white -top-1 -right-2 text-xs text-white bg-red-500 truncate">
                {UNREAD_NOTIFICATION}
              </div>
            )}
          </div>

          {is_popover_open && (
            <div className="">
              <div className="absolute rotate-45 border-8 border-transparent border-t-white border-l-white -bottom-6 translate-y-1 left-1/2 transform -translate-x-1/2 z-10"></div>
              <div className="absolute -right-6 mt-5 w-80  bg-white shadow-lg rounded-md p-2 z-40 ">
                {USER_ROLE === 'ADMIN' && (
                  <>
                    <div className="flex flex-col border-color-border gap-y-2">
                      <h4 className="ml-2 text-xs text-color-text-placeholder">
                        {t('_business_')}
                      </h4>
                      <div className="flex flex-col gap-y-2">
                        {BUSINESS_TAGS.map((item, idx) => (
                          <IconTag
                            key={idx}
                            title={item.title}
                            path={item.path}
                            icon={item.icon}
                            new_tab={item.new_tab}
                            onClose={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                    <DividerY />
                  </>
                )}
                <div className="flex flex-col border-color-border gap-y-2">
                  <h4 className="ml-2 text-xs text-color-text-placeholder">
                    {t('_personal')}
                  </h4>
                  <div className="flex flex-col gap-y-2">
                    {PERSONAL_TAGS.map((item, idx) => (
                      <IconTag
                        key={idx}
                        title={item.title}
                        path={item.path}
                        icon={item.icon}
                        new_tab={item.new_tab}
                        onClose={item.onClick || (() => {})}
                        notification_count={item.notification_count}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* mobile */}
      <div className="flex md:hidden w-full justify-between">
        <div
          className="flex items-center gap-2.5"
          onClick={() => handleOpenMenu(true)}
        >
          <div>
            <Bars3Icon className="size-6" />
          </div>
          {/* hàm renderPathName */}
          <h4 className="font-semibold truncate">
            {renderPathName(LOCATION.pathname)}
          </h4>
        </div>
        <div className="flex items-center gap-x-1">
          {/* Option chọn date */}
          <SelectDate
            options={[
              { key: t('today'), value: 'TODAY' },
              { key: t('yesterday'), value: 'YESTERDAY' },
              { key: t('last7Days'), value: 'LAST_7_DAYS' },
              { key: t('last30Days'), value: 'LAST_30_DAYS' },
              { key: t('thisMonth'), value: 'THIS_MONTH' },
              { key: t('lastMonth'), value: 'LAST_MONTH' },
              { key: t('last90Days'), value: 'LAST_90_DAYS' },
              { key: t('custom'), value: 'CUSTOM' },
            ]}
          />
          {/* Option chọn trang */}
          <Select options={pages} />
          {/* <Select2 options={pages} /> */}
          <div
            className="cursor-pointer p-1 flex border w-9 h-9 bg-white rounded-full text-sm items-center justify-center text-slate-700 truncate"
            onClick={() => {
              dispatch(startReload())
              dispatch(setTriggerReload())
            }}
            // onMouseEnter={e => handleMouseEnterNoTruncated(e, t('_refresh'))}
            // onMouseLeave={handleMouseLeave}
          >
            <div className="h-4 w-4 rounded-full flex items-center justify-center">
              <ArrowPathIcon className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

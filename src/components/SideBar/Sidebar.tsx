import { selectOrgId, selectPartnerInfo } from '@/stores/appSlice'
import { useEffect, useState } from 'react'

import IconTag from './components/IconTag'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

function Sidebar({ onClose }: { onClose: () => void }) {
  /** Import i18n */
  const { t } = useTranslation()

  /**
   * Danh sách menu
   */
  const MENU_LIST = [
    {
      title: t('overview'),
      path: 'dashboard',
      icon: 'Overview',
    },
    {
      title: t('page'),
      path: 'page',
      icon: 'Page',
    },
    {
      title: t('staff'),
      path: 'staff',
      icon: 'Staff',
    },
    // {
    //   title:t('online'),
    //   path: '/online',
    //   icon: 'Online',
    // },
    {
      title: t('ads'),
      path: 'ads',
      icon: 'ADS',
    },
    {
      title: t('tags'),
      path: 'tags',
      icon: 'Tags',
    },
    {
      title: t('emotional'),
      path: 'emotional',
      icon: 'Emotional',
    },
  ]

  /** Lấy thông tin partner */
  const PARTNER_INFO = useSelector(selectPartnerInfo)
  return (
    <div className="flex flex-col bg-white w-full h-full md:rounded-lg p-2 gap-y-3">
      <div className="flex md:hidden">
        <div className="flex items-center gap-x-1">
          <div className="flex justify-center items-center">
            <img
              src={PARTNER_INFO?.logo?.full || ''}
              alt="logo"
              className="w-24 h-7.5"
              // onError={(e) => {
              //   const target = e.target as HTMLImageElement
              //   target.onerror = null // Prevent infinite loop if fallback image also fails
              //   target.src = '/images/LogoRetion.svg' // Path to fallback local image
              // }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        {MENU_LIST.map(({ title, path, icon }, index: number) => (
          <div key={index}>
            <IconTag
              title={title}
              path={path}
              icon={icon}
              onClose={onClose}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar

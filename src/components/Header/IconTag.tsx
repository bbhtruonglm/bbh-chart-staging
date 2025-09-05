import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  Squares2X2Icon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid'

import DashboardIcon from '@/assets/icons/DashboardIcon'

interface IconTagProps {
  /** Tên hiển thị Path */
  title: string
  /** path */
  path: string
  /** icon */
  icon: string
  /** Đóng sidebar */
  onClose?: () => void
  /**
   * kiểu mở new tab
   */
  new_tab?: boolean

  /**
   * Số thông báo
   */
  notification_count?: number
}
function IconTag({
  title,
  path,
  icon,
  onClose,
  new_tab,
  notification_count,
}: IconTagProps) {
  return (
    <a
      href={path}
      className={
        'bg-white hover:bg-slate-100 flex h-10 items-center justify-between gap-x-2.5 px-2 p-1.5 rounded-sm cursor-pointer'
      }
      target={new_tab ? '_blank' : '_self'}
      onClick={onClose}
    >
      <div className="flex items-center gap-x-4">
        <div className="flex items-center justify-center bg-gray-100 h-8 w-8 rounded-full">
          {icon === 'company' && <BriefcaseIcon className="size-5" />}
          {icon === 'users' && <UsersIcon className="size-5" />}
          {icon === 'package' && <CheckBadgeIcon className="size-5" />}
          {icon === 'app' && <Squares2X2Icon className="size-5" />}
          {icon === 'user' && <UserIcon className="size-5" />}
          {icon === 'bell' && <BellIcon className="size-5" />}
          {icon === 'dashboard' && <DashboardIcon />}
          {icon === 'logout' && (
            <ArrowRightStartOnRectangleIcon className="size-5" />
          )}
        </div>
        <div>
          <h4 className="text-black text-sm font-medium hover:text-black">
            {title}
          </h4>
        </div>
      </div>
      {notification_count > 0 && (
        <div className="flex items-center justify-center bg-red-500 h-5 w-5 rounded-full">
          <h4 className="text-white text-xs font-medium">
            {notification_count}
          </h4>
        </div>
      )}
    </a>
  )
}

export default IconTag

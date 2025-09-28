import {
  ChartBarIcon,
  FireIcon,
  MegaphoneIcon,
  SparklesIcon,
  TagIcon,
  UsersIcon,
  WindowIcon,
} from '@heroicons/react/24/solid'
import { NavLink, useSearchParams } from 'react-router-dom'

import { Ads } from '@/assets/icons/Ads'
import { Emotional } from '@/assets/icons/Emotional'
import { Online } from '@/assets/icons/Online'
import { Tags } from '@/assets/icons/Tags'

/**
 * Interface IconTagProps
 */

interface IconTagProps {
  /**
   * Tiêu đề của icon
   */
  title: string
  /**
   * Đường dẫn của icon
   */
  path: string
  /**
   * Icon
   */
  icon: string

  /**
   * Hàm được gọi khi click vào icon
   * @returns void
   */
  onClose?: () => void
}
function IconTag({ title, path, icon, onClose }: IconTagProps) {
  /**
   * Lấy ra base url
   */
  const BASE_URL = import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL + '/'
    : '/'
  /**
   * Lấy ra search params
   */
  const [search_params] = useSearchParams()
  return (
    <NavLink
      to={BASE_URL + path + '?' + search_params.toString()}
      className={({ isActive }) =>
        isActive
          ? 'bg-gray-100 flex h-10 items-center gap-x-2.5 px-4 p-1 rounded-sm'
          : 'bg-white flex h-10 items-center gap-x-2.5 px-4 p-1 rounded-sm'
      }
      onClick={onClose}
    >
      <div className=" flex items-center justify-center bg-gray-100 h-8 w-8 rounded-full">
        {icon === 'Overview' && <ChartBarIcon className="size-5" />}
        {icon === 'Page' && <WindowIcon className="size-5" />}
        {icon === 'Staff' && <UsersIcon className="size-5" />}
        {icon === 'Online' && <Online />}
        {icon === 'ADS' && <MegaphoneIcon className="size-5" />}
        {icon === 'Tags' && <TagIcon className="size-5" />}
        {icon === 'Emotional' && <FireIcon className="size-5" />}
        {icon === 'AIAnalytic' && <SparklesIcon className="size-5" />}
      </div>
      <div>
        <h4 className="text-black text-sm font-medium hover:text-black">
          {title}
        </h4>
      </div>
    </NavLink>
  )
}

export default IconTag

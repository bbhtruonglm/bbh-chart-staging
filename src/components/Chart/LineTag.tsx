import {
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  PhoneArrowUpRightIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  SwatchIcon,
  TagIcon,
  UserCircleIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/solid'

import { ChatIcon } from '@/assets/icons/ChatIcon'
import { FaceQuestion } from '@/assets/icons/FaceQuestion'

/**
 * Line tag props
 */
interface LineTagProps {
  /**
   * Loại
   */
  type: string
  /**
   * Tiêu đề
   */
  title: string
  /**
   * Số lượng
   */
  count?: number | string
  /**
   * Chi tiết
   */
  detail?: boolean
  /**
   * Xử lý chi tiết
   * @param e sự kiện
   */
  handleDetail?: (e) => void
}
export const LineTag = ({
  type,
  title,
  count = 0,
  detail = false,
  handleDetail,
}: LineTagProps) => {
  return (
    <div
      className="relative group max-h-16 flex bg-slate-100 px-3 py-2 rounded-lg items-center gap-x-3 cursor-pointer "
      onClick={() => handleDetail && handleDetail(type)}
    >
      <div className="w-9 h-9 bg-slate-200 rounded-lg p-2">
        {type === 'old' && <UserCircleIcon className="size-5 text-blue-700" />}
        {type === 'client_return' && (
          <UserCircleIcon className="size-5 text-blue-700" />
        )}
        {type === 'new' && <UserPlusIcon className="size-5 text-blue-700" />}
        {type === 'client_unique' && (
          <UserPlusIcon className="size-5 text-blue-700" />
        )}
        {type === 'total_label' && <TagIcon className="size-5 text-blue-700" />}
        {type === 'active_label' && (
          <SwatchIcon className="size-5 text-blue-700" />
        )}
        {type === 'phone' && <PhoneIcon className="size-5 text-blue-700" />}
        {type === 'phone_ai_detect' && (
          <PhoneIcon className="size-5 text-blue-700" />
        )}
        {type === 'message' && (
          <ChatBubbleOvalLeftEllipsisIcon className="size-5 text-blue-700" />
        )}
        {type === 'message_client' && (
          <ChatBubbleOvalLeftEllipsisIcon className="size-5 text-blue-700" />
        )}
        {type === 'smile' && <FaceSmileIcon className="size-5 text-blue-700" />}
        {type === 'chat' && <ChatIcon />}
        {type === 'frown' && <FaceFrownIcon className="size-5 text-red-600" />}
        {type === 'question' && <FaceQuestion />}

        {type === 'staff_miss_call_in_hours' && (
          <PhoneArrowUpRightIcon className="size-5 text-blue-700" />
        )}
        {type === 'staff_miss_call_out_hours' && (
          <PhoneXMarkIcon className="size-5 text-blue-700" />
        )}
        {type === 'staff_miss_response_in_hours' && (
          <ChatBubbleLeftIcon className="size-5 text-blue-700" />
        )}
        {type === 'staff_miss_response_out_hours' && (
          <ChatBubbleOvalLeftIcon className="size-5 text-blue-700" />
        )}
        {type === 'ai_prompt_text' && (
          <DocumentTextIcon className="size-5 text-blue-700" />
        )}
        {type === 'ai_prompt_image' && (
          <PhotoIcon className="size-5 text-blue-700" />
        )}
        {type === 'ai_prompt_sound' && (
          <SpeakerWaveIcon className="size-5 text-blue-700" />
        )}
        {type === 'ai_prompt_video' && (
          <VideoCameraIcon className="size-5 text-blue-700" />
        )}
        {type === 'flow_active' && (
          <DocumentDuplicateIcon className="size-5 text-blue-700" />
        )}
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <h4 className="text-black text-xs custom-xs:text-xs md:text-sm font-medium">
            {title ? title : 'Không xác định'}
          </h4>
          {detail && (
            <div>
              <ArrowTopRightOnSquareIcon className="size-4 font-medium" />
            </div>
          )}
        </div>
        <h4
          className={`${type === 'smile' ? 'text-blue-700' : type === 'frown' ? 'text-[#DC2626]' : type === 'question' ? 'text-[#CA8A04]' : type === 'chat' ? 'text-black' : 'text-blue-700'}  text-xs custom-xs:text-sm md:text-base font-semibold`}
        >
          {count}
        </h4>
      </div>
    </div>
  )
}

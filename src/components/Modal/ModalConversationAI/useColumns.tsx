import {
  currency,
  formatDateTimeZones,
  renderAction,
  renderConversationTag,
  renderConversationType,
  renderEmotion,
  renderSuggest,
  renderTag,
  renderTypeSuggest,
} from '@/utils'
import { selectFilterTime, selectIsPageIncludesFb } from '@/stores/appSlice'
import { useEffect, useMemo, useState } from 'react'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { User } from '@/interfaces/table-column'
import { createColumnHelper } from '@tanstack/react-table'
import { getFormatDate } from '@/services/api_helper'
import { useSelector } from 'react-redux'
// import { IProColumns } from '@/components/Table/TableFiles/type-table'
import { useTooltip } from '@/components/Tooltip/useTooltip'
import { useTranslation } from 'react-i18next'

/** Setup các field cho header của 1 bảng */
export const useColumns = ({ modal_type, getNamePage, handleClick }) => {
  /**
   * Dùng để dịch ngôn ngữ
   */
  const { t } = useTranslation()
  /**
   * Xử lý khi resize
   */
  useEffect(() => {
    /**
     *  Hàm xử lý khi resize
     * @returns
     */
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    /**
     * Thêm sự kiện resize
     */
    window.addEventListener('resize', handleResize)
    /**
     * Xóa sự kiện resize
     */
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  /**
   * State lưu trạng thái hiển thị mobile
   */
  const [is_mobile, setIsMobile] = useState(window.innerWidth < 768)

  /** thời gian lọc */
  const FILTER_TIME = useSelector(selectFilterTime)

  /** tính toán period */
  const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time

  /** kiểu định dạng ngày tháng trong bảng dựa theo kiểu lọc */
  const FORMAT_TIME = getFormatDate(DISTANCE_TIME)

  /** Danh sách ID trang chưa page fb */
  const IS_PAGE_INCLUDES_FB = useSelector(selectIsPageIncludesFb)

  /** Với mỗi bảng sẽ setup type, và các field khác nhau */
  const COLUMN_HELPER = createColumnHelper<User | any>()
  /**
   *  Lấy tên của cột header
   * @param modal_type
   * @returns
   */
  const getEventColumnHeader = (modal_type: string) => {
    switch (modal_type) {
      case 'LINE_TAG':
        return t('_message')
      case 'EMOTIONAL_ANALYSIS':
      case 'EMOTIONAL_ANALYSIS_STAFF':
        return t('_emotional_analysis')
      case 'COMMON_ISSUES':
        return t('_issues')
      case 'ACTION_PLAN':
      case 'TYPE_ACTION_PLAN':
        return t('_action_plan')
      case 'AI_ANALYTIC':
        return t('ai_type')
      default:
        return t('_message')
    }
  }
  /**
   *  Lý dụng cơ sở dữ liệu trong bảng
   * @param modal_type
   * @param value
   * @returns
   */
  const renderEventCell = (modal_type: string, value: any) => {
    switch (modal_type) {
      case 'AI_ANALYTIC':
        return renderConversationType(value)
      default:
        return value
    }
  }

  /** Lấy các dữ liệu tooltip từ customHook */
  const {
    tooltip,
    handleMouseEnterNoTruncated,
    handleMouseEnter,
    handleMouseLeave,
  } = useTooltip()
  /**
   * Các cột của bảng
   */
  const COLUMNS = useMemo(
    () =>
      [
        COLUMN_HELPER.accessor('timestamp', {
          meta: {
            label: t('_time'),
          },
          header: () => t('_time'),
          cell: info =>
            formatDateTimeZones(info.getValue(), 'HH:mm dd/MM/yyyy'),

          size: 120,
        }),
        COLUMN_HELPER.accessor('page_id', {
          meta: {
            label: t('_page'),
          },
          header: () => t('_page'),
          cell: info => getNamePage(info.getValue()),
          size: 120,
        }),
        COLUMN_HELPER.accessor('event', {
          meta: {
            label: getEventColumnHeader(modal_type),
          },
          header: () => getEventColumnHeader(modal_type),
          cell: info => (
            <div
              onMouseEnter={(e: any) => {
                handleMouseEnter(e, t(info.getValue()))
              }}
              onMouseLeave={handleMouseLeave}
              className="truncate"
            >
              {renderEventCell(modal_type, info.getValue())}
            </div>
          ),
          size:
            modal_type === 'STAFF_LINE_TAG' || modal_type === 'AI_ANALYTIC'
              ? 100
              : 100,
        }),
        /** Tên khách hàng */
        COLUMN_HELPER.accessor('parsedClientName', {
          meta: {
            label: t('_client_name'),
          },
          header: () => t('_client_name'),
          cell: info => {
            /** Có data thì hiện tên/ không thì hiện id */
            const NAME = info.getValue()
              ? info.getValue()
              : info?.row?.original?.client_id

            return NAME || t('ai_translate')
          },
          size: 120,
        }),
        /** Type người gửi */
        COLUMN_HELPER.accessor('parsedMessageType', {
          meta: {
            label: t('_sent'),
          },
          header: () => t('_sent'),
          // Phân loại tin nhắn của page/khách hàng
          cell: info =>
            info.getValue() === 'client' ? t('_customer') : t('_page'),
          size: 120,
        }),
        /** Type người gửi */
        COLUMN_HELPER.accessor('totalTokenCount', {
          meta: {
            label: t('totalTokenCount'),
          },
          header: () => t('totalTokenCount'),
          // Phân loại tin nhắn của page/khách hàng
          cell: info => (
            <div className="flex flex-col gap-1">
              {currency(info.getValue())}
              {/* <div className="flex flex-col text-xs text-slate-500">
                <span>
                  • Candidates: {info?.row?.original?.candidatesTokenCount}
                </span>
                <span>• Prompt: {info?.row?.original?.promptTokenCount}</span>
                <span>
                  • Thought: {info?.row?.original?.thoughtsTokenCount}
                </span>
              </div> */}
            </div>
          ),
          size: 120,
        }),
        /** Nội dung tin nhắn */
        COLUMN_HELPER.accessor('aiAsking', {
          meta: {
            label: t('ai_asking_question'),
          },
          header: () => t('ai_asking_question'),
          cell: info => (
            <div
              className="max-w-60 truncate"
              onClick={e => e.stopPropagation()}
              onMouseEnter={e => handleMouseEnter(e, info.getValue())}
              onMouseLeave={handleMouseLeave}
            >
              {info.getValue() ? info.getValue().toString() : info.getValue()}
            </div>
          ),
          size: 240,
        }),
        /** Nội dung tin nhắn */
        COLUMN_HELPER.accessor('parsedText', {
          meta: {
            label: t('_content'),
          },
          header: () => t('_content'),
          cell: info => (
            <div
              className="max-w-60 truncate"
              onClick={e => e.stopPropagation()}
              onMouseEnter={e => handleMouseEnter(e, info.getValue())}
              onMouseLeave={handleMouseLeave}
            >
              {info.getValue() ? info.getValue().toString() : info.getValue()}
            </div>
          ),
          size: 240,
        }),
        /** Hành động */
        COLUMN_HELPER.accessor('action', {
          header: () => t('_action'),
          cell: info => (
            <div
              className={`line-clamp-1 gap-1 flex justify-between items-center text-left ${
                info.row.original.client_id
                  ? 'cursor-pointer hover:text-blue-700'
                  : ''
              } `}
              onClick={() => {
                handleClick(info)
              }}
            >
              {t('_view_detail')}
              <div>
                <ArrowTopRightOnSquareIcon className="size-4 font-medium" />
              </div>
            </div>
          ),

          size: 140,
        }),
      ].filter(Boolean),
    [FORMAT_TIME, is_mobile, IS_PAGE_INCLUDES_FB, modal_type],
  )

  return {
    COLUMNS,
    tooltip,
  }
}

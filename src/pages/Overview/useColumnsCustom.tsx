import { selectFilterTime, selectIsPageIncludesFb } from '@/stores/appSlice'
import { useEffect, useMemo, useState } from 'react'

import { Cog8ToothIcon } from '@heroicons/react/24/solid'
import HeaderWithTooltip from '@/components/Table/HeaderWithTooltip'
import { IProColumns } from '@/components/Table/TableFiles/type-table'
import { User } from '@/interfaces/table-column'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { formatWithCommas } from '@/utils'
import { getFormatDate } from '@/services/api_helper'
import { useSelector } from 'react-redux'
import { useTooltip } from '@/components/Tooltip/useTooltip'
import { useTranslation } from 'react-i18next'

export const useColumnsCustom = ({
  is_open_modal = false,
}: {
  is_open_modal?: boolean
}) => {
  /** Hook i18n: dùng để dịch văn bản theo ngôn ngữ */
  const { t } = useTranslation()

  /** State kiểm tra thiết bị hiện tại có phải là mobile không (dựa theo width < 768) */
  const [is_mobile, setIsMobile] = useState(window.innerWidth < 768)

  /** Lấy filter thời gian từ Redux store */
  const FILTER_TIME = useSelector(selectFilterTime)

  /** Tính khoảng cách thời gian được filter (miliseconds) */
  const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time

  /** Định dạng thời gian dựa trên khoảng cách thời gian */
  const FORMAT_TIME = getFormatDate(DISTANCE_TIME)

  /** Kiểm tra page hiện tại có bao gồm trang Facebook hay không (từ Redux) */
  const IS_PAGE_INCLUDES_FB = useSelector(selectIsPageIncludesFb)

  /** State hiển thị modal cài đặt (setting) */
  const [is_open_setting, setIsOpenSetting] = useState(false)

  /** Lắng nghe thay đổi kích thước cửa sổ để cập nhật lại trạng thái is_mobile */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)

    /** Thêm sự kiện resize khi component được mount */
    window.addEventListener('resize', handleResize)

    /** Cleanup: gỡ bỏ sự kiện khi component unmount */
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /**
   * Key dùng để lưu trữ danh sách các cột hiển thị vào localStorage
   */
  const COLUMN_STORAGE_KEY = 'overview_visible_columns'

  /**
   * State chứa danh sách các key của cột đang hiển thị
   * - Giá trị mặc định được lấy từ localStorage nếu có
   * - Nếu không có, mặc định là một mảng rỗng
   */
  const [visible_keys, setVisibleKeys] = useState<string[]>(() => {
    /**
     * Lấy dữ liệu đã lưu trong localStorage với key COLUMN_STORAGE_KEY
     */
    const STORED = localStorage.getItem(COLUMN_STORAGE_KEY)

    /**
     * Nếu tồn tại dữ liệu, parse từ JSON thành mảng string
     * Ngược lại, trả về mảng rỗng
     */
    return STORED ? JSON.parse(STORED) : []
  })

  /**
   * State chứa danh sách tạm thời các key cột hiển thị
   * - Dùng khi mở modal để thay đổi cấu hình cột
   * - Khi modal đóng mà không lưu, dữ liệu sẽ được reset lại
   */
  const [temp_visible_keys, setTempVisibleKeys] =
    useState<string[]>(visible_keys)

  /**
   * Hook useEffect theo dõi sự thay đổi của visible_keys và is_open_modal
   * - Nếu modal không mở (is_open_modal = false), thì reset lại temp_visible_keys
   *   để đồng bộ với visible_keys
   */
  useEffect(() => {
    /**
     * Khi modal không mở, cập nhật lại danh sách cột tạm thời theo cột thực tế đang hiển thị
     */
    if (!is_open_modal) {
      setTempVisibleKeys(visible_keys)
    }
  }, [visible_keys, is_open_modal])

  /**
   * Cập nhật danh sách các cột hiển thị chính thức
   * @param keys - Mảng các key tương ứng với các cột cần hiển thị
   */
  const updateVisibleColumns = (keys: string[]) => {
    /** Cập nhật state chính thức của cột hiển thị */
    setVisibleKeys(keys)

    /** Lưu vào localStorage để duy trì cấu hình khi reload trang */
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(keys))
  }

  /**
   * Cập nhật danh sách các cột hiển thị tạm thời (khi người dùng chỉnh trong modal)
   * @param keys - Mảng key tạm thời người dùng chọn
   */
  const updateVisibleColumnsState = (keys: string[]) => {
    /** Cập nhật state tạm thời của cột hiển thị */
    setTempVisibleKeys(keys)
  }

  /**
   * Hook tooltip hỗ trợ hiển thị nội dung đầy đủ khi bị cắt (truncated)
   * - `tooltip`: JSX nội dung tooltip được render bên ngoài
   * - `handleMouseLeave`: sự kiện để ẩn tooltip khi hover out
   * - `handleMouseEnterNoTruncated`: sự kiện để hiện tooltip nếu text bị cắt
   */
  const { tooltip, handleMouseLeave, handleMouseEnterNoTruncated } =
    useTooltip()

  /**
   * Lưu danh sách các cột tạm thời thành cột hiển thị chính thức
   * - Thường được gọi khi người dùng nhấn nút "Lưu" trong modal
   */
  const saveVisibleColumns = () => {
    /** Cập nhật state chính thức từ state tạm thời */
    setVisibleKeys(temp_visible_keys)

    /** Ghi lại cấu hình mới vào localStorage */
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(temp_visible_keys))
  }
  /** createColumnHelper */
  const COLUMN_HELPER = createColumnHelper<User | any>()
  /** COLUMNS_SETTING */
  const COLUMNS_SETTING = useMemo(() => {
    return [
      COLUMN_HELPER.accessor('setting', {
        header: () => (
          <div
            onClick={() => {
              setIsOpenSetting(true)
              handleMouseLeave()
            }}
            onMouseEnter={e =>
              handleMouseEnterNoTruncated(e, t('_setting_desc'))
            }
            onMouseLeave={handleMouseLeave}
          >
            <Cog8ToothIcon className="size-5" />
          </div>
        ),

        cell: () => <div></div>,
        size: 36,
      }),
    ]
  }, [is_mobile, FORMAT_TIME])
  /** COLUMNS_DATE */
  const COLUMNS_DATE = useMemo(() => {
    const COLUMN = [
      COLUMN_HELPER.accessor('date', {
        meta: {
          label: is_mobile ? t('_time') : t('_time_range'),
        },
        header: () => (
          <HeaderWithTooltip
            label={is_mobile ? t('_time') : t('_time_range')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_time_range_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1 w-20 md:w-36">
            {format(info.getValue(), FORMAT_TIME) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
    ]
    return COLUMN
  }, [is_mobile, FORMAT_TIME])
  /** ALL_COLUMNS */
  const ALL_COLUMNS: IProColumns<User | any> = useMemo(() => {
    const COLUMNS = [
      COLUMN_HELPER.accessor('ai_prompt_text', {
        meta: {
          label: t('ai_prompt_text'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('ai_prompt_text')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('ai_prompt_text_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),

        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 200,
      }),
      COLUMN_HELPER.accessor('ai_prompt_image', {
        meta: {
          label: t('ai_prompt_image'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('ai_prompt_image')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('ai_prompt_image_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),

        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 220,
      }),
      COLUMN_HELPER.accessor('ai_prompt_sound', {
        meta: {
          label: t('ai_prompt_sound'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('ai_prompt_sound')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('ai_prompt_sound_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),

        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 220,
      }),
      COLUMN_HELPER.accessor('ai_prompt_video', {
        meta: {
          label: t('ai_prompt_video'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('ai_prompt_video')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('ai_prompt_video_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),

        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 220,
      }),
      COLUMN_HELPER.accessor('flow_active', {
        meta: {
          label: t('_flow_active'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_flow_active')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_flow_active_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      IS_PAGE_INCLUDES_FB &&
        COLUMN_HELPER.accessor('comment_client', {
          meta: {
            label: t('_comment_client'),
          },
          header: () => (
            <HeaderWithTooltip
              label={t('_comment_client')}
              onHover={(e: any) =>
                handleMouseEnterNoTruncated(e, t('_comment_client_desc'))
              }
              onLeave={handleMouseLeave}
            />
          ),

          cell: info => (
            <div className="line-clamp-1">
              {formatWithCommas(info.getValue()) ?? '-'}
            </div>
          ),
          size: is_mobile ? 100 : 180,
        }),
      IS_PAGE_INCLUDES_FB &&
        COLUMN_HELPER.accessor('comment_page', {
          meta: {
            label: t('_comment_page'),
          },
          header: () => (
            <HeaderWithTooltip
              label={t('_comment_page')}
              onHover={(e: any) =>
                handleMouseEnterNoTruncated(e, t('_comment_page_desc'))
              }
              onLeave={handleMouseLeave}
            />
          ),
          cell: info => (
            <div className="line-clamp-1">
              {formatWithCommas(info.getValue()) ?? '-'}
            </div>
          ),
          size: is_mobile ? 100 : 150,
        }),
      IS_PAGE_INCLUDES_FB &&
        COLUMN_HELPER.accessor('comment_employee', {
          meta: {
            label: t('_comment_employee'),
          },
          header: () => (
            <HeaderWithTooltip
              label={t('_comment_employee')}
              onHover={(e: any) =>
                handleMouseEnterNoTruncated(e, t('_comment_employee_desc'))
              }
              onLeave={handleMouseLeave}
            />
          ),
          cell: info => (
            <div className="line-clamp-1">
              {formatWithCommas(info.getValue()) ?? '-'}
            </div>
          ),
          size: is_mobile ? 100 : 180,
        }),
      IS_PAGE_INCLUDES_FB &&
        COLUMN_HELPER.accessor('comment_private_message', {
          meta: {
            label: t('_comment_private_message'),
          },
          header: () => (
            <HeaderWithTooltip
              label={t('_comment_private_message')}
              onHover={(e: any) =>
                handleMouseEnterNoTruncated(
                  e,
                  t('_comment_private_message_desc'),
                )
              }
              onLeave={handleMouseLeave}
            />
          ),
          cell: info => (
            <div className="line-clamp-1">
              {formatWithCommas(info.getValue()) ?? '-'}
            </div>
          ),
          size: is_mobile ? 140 : 210,
        }),
      COLUMN_HELPER.accessor('message_client', {
        meta: {
          label: t('_message_client'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_message_client')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_message_client_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),

        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
      COLUMN_HELPER.accessor('message_page', {
        meta: {
          label: t('_message_page'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_message_page')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_message_page_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('message_employee', {
        meta: {
          label: t('_message_employee'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_message_employee')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_message_employee_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
      COLUMN_HELPER.accessor('staff_miss_call_in_hours', {
        meta: {
          label: t('staff_miss_call_in_hours_desc'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('staff_miss_call_in_hours')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('staff_miss_call_in_hours_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 220,
      }),
      COLUMN_HELPER.accessor('staff_miss_call_out_hours', {
        meta: {
          label: t('staff_miss_call_out_hours_desc'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('staff_miss_call_out_hours')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(
                e,
                t('staff_miss_call_out_hours_desc'),
              )
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 220,
      }),
      COLUMN_HELPER.accessor('staff_miss_response_in_hours', {
        meta: {
          label: t('staff_miss_response_in_hours_desc'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('staff_miss_response_in_hours')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(
                e,
                t('staff_miss_response_in_hours_desc'),
              )
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 240,
      }),
      COLUMN_HELPER.accessor('staff_miss_response_out_hours', {
        meta: {
          label: t('staff_miss_response_out_hours_desc'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('staff_miss_response_out_hours')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(
                e,
                t('staff_miss_response_out_hours_desc'),
              )
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 240,
      }),
      COLUMN_HELPER.accessor('phone_ai_detect', {
        meta: {
          label: t('_phone_ai_detect'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_phone_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_phone_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
      COLUMN_HELPER.accessor('address_ai_detect', {
        meta: {
          label: t('_address_ai_detect'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_address_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_address_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('email_ai_detect', {
        meta: {
          label: t('_email_ai_detect'),
        },

        header: () => (
          <HeaderWithTooltip
            label={t('_email_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_email_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('client_unique', {
        meta: {
          label: t('_client_unique'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_client_unique')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_client_unique_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('client_return', {
        meta: {
          label: t('_client_return'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_client_return')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_client_return_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('label_add', {
        meta: {
          label: t('_label_add'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_label_add')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_label_add_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('label_remove', {
        meta: {
          label: t('_label_remove'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_label_remove')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_label_remove_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('ad_reach', {
        meta: {
          label: t('_ad_reach'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_ad_reach')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_ad_reach_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 150 : 200,
      }),
      COLUMN_HELPER.accessor('slow_response', {
        meta: {
          label: t('_slow_response'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_slow_response')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_slow_response_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('ai_slow_response', {
        meta: {
          label: t('_ai_slow_response'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_ai_slow_response')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_ai_slow_response_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
      COLUMN_HELPER.accessor('client_positive', {
        meta: {
          label: t('_client_positive'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_client_positive')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_client_positive_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 150 : 220,
      }),
      COLUMN_HELPER.accessor('client_negative', {
        meta: {
          label: t('_client_negative'),
        },

        header: () => (
          <HeaderWithTooltip
            label={t('_client_negative')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_client_negative_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 150 : 280,
      }),
      COLUMN_HELPER.accessor('cta_schedule_ai_detect', {
        meta: {
          label: t('_schedule_ai_detect'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_schedule_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_schedule_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 150,
      }),
      COLUMN_HELPER.accessor('cta_order_ai_detect', {
        meta: {
          label: t('_order_ai_detect'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_order_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_order_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
      COLUMN_HELPER.accessor('cta_transaction_ai_detect', {
        meta: {
          label: t('_transaction_ai_detect'),
        },
        header: () => (
          <HeaderWithTooltip
            label={t('_transaction_ai_detect')}
            onHover={(e: any) =>
              handleMouseEnterNoTruncated(e, t('_transaction_ai_detect_desc'))
            }
            onLeave={handleMouseLeave}
          />
        ),
        cell: info => (
          <div className="line-clamp-1">
            {formatWithCommas(info.getValue()) ?? '-'}
          </div>
        ),
        size: is_mobile ? 100 : 180,
      }),
    ].filter(Boolean)

    return COLUMNS.map(col => ({
      ...col,
      accessorKey: col.accessorKey as any,
    }))
  }, [FORMAT_TIME, is_mobile, IS_PAGE_INCLUDES_FB])

  /**
   * useEffect để đồng bộ dữ liệu cột hiển thị từ localStorage
   * - Chạy khi `ALL_COLUMNS` thay đổi (ví dụ sau khi fetch dữ liệu cột từ backend)
   */
  useEffect(() => {
    /** Lấy dữ liệu cột đã lưu từ localStorage */
    const SAVED = localStorage.getItem(COLUMN_STORAGE_KEY)

    /** Lấy tất cả các key hợp lệ từ ALL_COLUMNS (loại bỏ undefined/null) */
    const ALL_KEYS = ALL_COLUMNS.map(col => col.accessorKey).filter(Boolean)

    /** Nếu đã có cấu hình cột được lưu trước đó */
    if (SAVED) {
      const PARSED = JSON.parse(SAVED)

      /** Kiểm tra dữ liệu đã lưu có hợp lệ không */
      if (Array.isArray(PARSED) && PARSED.length > 0) {
        /** Lọc ra các key hợp lệ có trong ALL_KEYS */
        const VALID_KEYS = PARSED.filter(key => ALL_KEYS.includes(key))

        /** Nếu có key hợp lệ thì dùng, ngược lại fallback về ALL_KEYS */
        setVisibleKeys(VALID_KEYS.length > 0 ? VALID_KEYS : ALL_KEYS)
        setTempVisibleKeys(VALID_KEYS.length > 0 ? VALID_KEYS : ALL_KEYS)

        /** Cập nhật lại localStorage với danh sách hợp lệ */
        localStorage.setItem(
          COLUMN_STORAGE_KEY,
          JSON.stringify(VALID_KEYS.length > 0 ? VALID_KEYS : ALL_KEYS),
        )
      } else {
        /** Nếu mảng không hợp lệ, fallback về tất cả cột */
        setVisibleKeys(ALL_KEYS)
        setTempVisibleKeys(ALL_KEYS)
        localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(ALL_KEYS))
      }
    } else {
      /** Nếu chưa từng lưu, khởi tạo bằng tất cả cột */
      setVisibleKeys(ALL_KEYS)
      setTempVisibleKeys(ALL_KEYS)
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(ALL_KEYS))
    }
  }, [ALL_COLUMNS])

  /**
   * useMemo để tính toán danh sách cột hiển thị thực tế dựa trên visible_keys
   * - Nếu visible_keys rỗng → fallback về ALL_COLUMNS
   * - Dùng useMemo để tránh render lại không cần thiết
   */
  const VISIBLE_COLUMNS = useMemo(() => {
    if (visible_keys.length === 0) return ALL_COLUMNS

    /** Tìm từng cột theo thứ tự visible_keys */
    return visible_keys
      .map(key => ALL_COLUMNS.find(col => col.accessorKey === key))
      .filter(Boolean) as any // Ép kiểu tránh lỗi khi có undefined
  }, [ALL_COLUMNS, visible_keys])

  return {
    VISIBLE_COLUMNS,
    ALL_COLUMNS,
    visible_keys,
    updateVisibleColumns,
    is_open_setting,
    setIsOpenSetting,
    COLUMNS_SETTING,
    updateVisibleColumnsState,
    saveVisibleColumns,
    temp_visible_keys,
    COLUMNS_DATE,
    tooltip,
  }
}

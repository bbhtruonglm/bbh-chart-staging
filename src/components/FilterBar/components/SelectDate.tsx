import 'react-datepicker/dist/react-datepicker.css'

import React, { useEffect, useRef, useState } from 'react'
import {
  endOfMonth,
  endOfToday,
  endOfYesterday,
  format,
  setHours,
  setMinutes,
  setSeconds,
  startOfMonth,
  startOfToday,
  startOfYesterday,
  subMonths,
} from 'date-fns'

import { DatePickerWithRange } from './DateRangePicker'
import { Down } from '@/assets/icons/Down'
import { Subtract } from '@/assets/icons/Subtract'
import { setFilterTime } from '@/stores/appSlice'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * SelectProps interface
 */
interface SelectProps {
  /**
   * Các option của select
   */
  options: {
    /**
     * Key của option
     */
    key: string
    /**
     * Value của option
     */
    value: string
  }[]
}

const Select: React.FC<SelectProps> = ({ options }) => {
  /** Import i18n */
  const { t, i18n } = useTranslation()
  /** Là ngôn ngữ hiện tại */
  const CURRENT_LANGUAGE = i18n.language

  /** Ngày hôm nay */
  const TODAY = new Date()

  /** ngày các hiện tại tháng 1 trước */
  const LAST_MONTH_DATE = subMonths(TODAY, 1)

  /** timestamp của 1 ngày */
  const TIMESTAMP_ONE_DAY = 24 * 60 * 60 * 1000
  /** Hàm dispatch */
  const dispatch = useDispatch()
  /** query url */
  const [searchParams, setSearchParams] = useSearchParams()
  /** Lấy thông tin thời gian từ URL : Thời gian bắt đầu */
  const START_DATE = searchParams.get('from')
  /** Lưu thông tin thời gian từ URL : Thời gian kết thúc */
  const END_DATE = searchParams.get('to')
  /** lưu loại thời gian đã chọn từ URL: Loại thời gian */
  const TYPE_DATE = searchParams.get('type_date')
  /**
   * State lưu giá trị được chọn
   */
  const [is_open, setIsOpen] = useState(false)
  /**
   * State lưu giá trị được chọn
   */
  const [selected_value, setSelectedValue] = useState<{
    key: string
    value: string
  }>({ key: null, value: null })

  /** Reference Select */
  const SELECT_REF = useRef<HTMLDivElement>(null)

  /** Hàm xử lý trả về 00:00:00 start_date và 23:59:59 end_date
   * @param date: Date
   * @param type: string
   */
  const renderDateStartEnd = (date: Date, type = 'start') => {
    /**
     * Nếu type = start => trả về 00:00:00
     */
    if (type === 'start') {
      /** tháng 9 = 8 vì index tháng bắt đầu từ 0 */
      const START_DATE = new Date(date)
      /**
       * Ngày bắt đầu (00:00:00 20/9/2024)
       */
      const START_OF_DAY = setHours(setMinutes(setSeconds(START_DATE, 0), 0), 0)
      /**
       * Trả về ngày bắt đầu
       */
      return START_OF_DAY
    } else {
      /**
       * Nếu type = end => trả về 23:59:59
       */
      const END_DATE = new Date(date)
      /**
       * Ngày kết thúc (23:59:59 20/9/2024)
       */
      const END_OF_DAY = setHours(setMinutes(setSeconds(END_DATE, 59), 59), 23)
      /**
       * Trả về ngày kết thúc
       */
      return END_OF_DAY
    }
  }

  /** lưu dữ liệu ngày tùy chỉnh khi chọn */
  const [date_range, setDateRange] = useState([null, null])
  /** lấy thông tin thời gian từ URL : Thời gian bắt đầu */
  const [start_date, end_date] = date_range

  /** Mở thanh select */
  const handleToggle = () => {
    /**
     * Nếu đang mở thì đóng, ngược lại
     */
    setIsOpen(!is_open)
  }
  useEffect(() => {
    /** Nếu không có thì mặc định là ngày hôm nay */
    if (!START_DATE && !END_DATE && !TYPE_DATE) {
      /** mặc định là lọc theo hôm nay */
      dispatch(
        setFilterTime({
          start_time: startOfToday().getTime(),
          end_time: endOfToday().getTime(),
        }),
        /**
         * Ghi lại giá trị lên url
         */
        setSelectedValue({ key: t('today'), value: 'TODAY' }),
      )
      return
    }
    /** Type = CUSTOM => Custom gán vào store và return, tránh lỗi logic sau */
    if (TYPE_DATE === 'CUSTOM') {
      /**
       * Gán giá trị vào store
       */
      setSelectedValue({ key: t('custom'), value: 'CUSTOM' })
      /**
       * Gán giá trị vào store
       */
      setDateRange([new Date(Number(START_DATE)), new Date(Number(END_DATE))])
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: Number(START_DATE),
          end_time: Number(END_DATE),
        }),
      )
      /**
       * return
       */
      return
    }

    /** Object params */
    const PARAMS_OBJECT = Object.fromEntries([...searchParams])
    /** TH không phải custom=>  Xoá tham số from, to */
    delete PARAMS_OBJECT.from
    /**
     * Xoá tham số to
     */
    delete PARAMS_OBJECT.to
    /**
     * Xoá tham số type_date
     */
    setSearchParams({
      ...PARAMS_OBJECT,
    })

    /**
     * Xử lý logic khi chọn ngày Hôm nay
     */
    if (TYPE_DATE === 'TODAY') {
      /**
       * Type = TODAY => Today
       */
      setSelectedValue({ key: t('today'), value: 'TODAY' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfToday().getTime(),
          end_time: endOfToday().getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = YESTERDAY => Yesterday */
    if (TYPE_DATE === 'YESTERDAY') {
      /**
       * Type = YESTERDAY => Yesterday
       */
      setSelectedValue({ key: t('yesterday'), value: 'YESTERDAY' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfYesterday().getTime(),
          end_time: endOfYesterday().getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = LAST_7_DAYS => Last 7 days */
    if (TYPE_DATE === 'LAST_7_DAYS') {
      /**
       * Type = LAST_7_DAYS => Last 7 days
       */
      setSelectedValue({ key: t('last7Days'), value: 'LAST_7_DAYS' })
      console.log(
        startOfToday().getTime() - 7 * TIMESTAMP_ONE_DAY,
        endOfToday().getTime(),
      )
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfToday().getTime() - 7 * TIMESTAMP_ONE_DAY,
          end_time: endOfToday().getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = LAST_30_DAYS => Last 30 days */
    if (TYPE_DATE === 'LAST_30_DAYS') {
      /**
       * Type = LAST_30_DAYS => Last 30 days
       */
      setSelectedValue({ key: t('last30Days'), value: 'LAST_30_DAYS' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfToday().getTime() - 30 * TIMESTAMP_ONE_DAY,
          end_time: endOfToday().getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = LAST_MONTH => Last month */
    if (TYPE_DATE === 'LAST_MONTH') {
      /**
       * Type = LAST_MONTH => Last month
       */
      setSelectedValue({ key: t('lastMonth'), value: 'LAST_MONTH' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfMonth(LAST_MONTH_DATE).getTime(),
          end_time: endOfMonth(LAST_MONTH_DATE).getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = THIS_MONTH => This month */
    if (TYPE_DATE === 'THIS_MONTH') {
      /**
       * Type = THIS_MONTH => This month
       */
      setSelectedValue({ key: t('thisMonth'), value: 'THIS_MONTH' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfMonth(TODAY).getTime(),
          end_time: endOfMonth(TODAY).getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }

    /** Type = LAST_90_DAYS => Last 90 days */
    if (TYPE_DATE === 'LAST_90_DAYS') {
      /**
       * Type = LAST_90_DAYS => Last 90 days
       */
      setSelectedValue({ key: t('last90Days'), value: 'LAST_90_DAYS' })
      /**
       * Gán giá trị vào store
       */
      dispatch(
        setFilterTime({
          start_time: startOfToday().getTime() - 90 * TIMESTAMP_ONE_DAY,
          end_time: endOfToday().getTime(),
        }),
      )
      /**
       * Ghi lại giá trị lên url
       */
      setSearchParams({
        ...PARAMS_OBJECT,
      })
    }
  }, [TYPE_DATE, START_DATE, END_DATE, CURRENT_LANGUAGE])

  /** thời gian hiển thị của thời gian tùy chọn
   * @param full_year: boolean
   * @returns string
   */
  const CUSTOM_TIME = (full_year = true) => {
    /**
     * Nếu có thời gian bắt đầu và thời gian kết thúc
     */
    return start_date && end_date
      ? format(start_date, full_year ? 'dd/MM/yyy' : 'dd/MM/yy') +
          ' - ' +
          format(end_date, full_year ? 'dd/MM/yyy' : 'dd/MM/yy')
      : t('custom')
  }

  /** hàm xử lý khi chọn option
   * @param value: { key: string, value: string }
   * @returns void
   */
  const handleOptionClick = (value: { key: string; value: string }) => {
    /** remove range date custom */
    setDateRange([null, null])

    /** Tạo object params từ url  */
    const PARAMS_OBJECT = Object.fromEntries([...searchParams])
    /** Xoá tham số from, to */
    delete PARAMS_OBJECT.from
    /** Xoá tham số to */
    delete PARAMS_OBJECT.to
    /** Xoá tham số type_date */
    switch (value.value) {
      case 'TODAY':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: startOfToday().getTime(),
        //     end_time: endOfToday().getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'TODAY',
        })
        break
      case 'YESTERDAY':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: startOfYesterday().getTime(),
        //     end_time: endOfYesterday().getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'YESTERDAY',
        })
        break
      case 'LAST_7_DAYS':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: startOfToday().getTime() - 7 * TIMESTAMP_ONE_DAY,
        //     end_time: endOfToday().getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'LAST_7_DAYS',
        })
        break
      case 'LAST_30_DAYS':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: TODAY.getTime() - 30 * TIMESTAMP_ONE_DAY,
        //     end_time: endOfToday().getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'LAST_30_DAYS',
        })
        break
      case 'LAST_90_DAYS':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: TODAY.getTime() - 90 * TIMESTAMP_ONE_DAY,
        //     end_time: endOfToday().getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'LAST_90_DAYS',
        })
        break
      case 'THIS_MONTH':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: startOfMonth(TODAY).getTime(),
        //     end_time: endOfMonth(TODAY).getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'THIS_MONTH',
        })
        break
      case 'LAST_MONTH':
        /**
         * Lưu giá trị vào store
         */
        // dispatch(
        //   setFilterTime({
        //     start_time: startOfMonth(LAST_MONTH_DATE).getTime(),
        //     end_time: endOfMonth(LAST_MONTH_DATE).getTime(),
        //   }),
        // )
        /** ghi lại giá trị lên url */
        setSearchParams({
          ...PARAMS_OBJECT,
          type_date: 'LAST_MONTH',
        })
        break
      default:
        break
    }
    /** set giá trị đã chọn */
    setSelectedValue(value)
    /** đóng select */
    setIsOpen(false)
  }
  /** Hàm xử lý khi click ra ngoài select
   * @param event: MouseEvent
   */
  const handleClickOutside = (event: MouseEvent) => {
    /**
     * Nếu click ra ngoài select và không phải đang chọn ngày tùy chỉnh
     */
    if (
      SELECT_REF.current &&
      !SELECT_REF.current.contains(event.target as Node) &&
      !is_selecting_date_range
    ) {
      /** đóng select */
      setIsOpen(false)
    }
  }
  /** kiểm tra xem có phải option đang được chọn không
   * @param option: { key: string, value: string }
   */
  const isSelected = option => {
    /**
     * Nếu key và value của option bằng với key và value của giá trị đã chọn
     */
    return (
      option.key === selected_value.key && option.value === selected_value.value
    )
  }

  /** hàm xử lý khi chọn ngày tùy chọn
   * @param update: Date[]
   */
  function handleChangeCustomTime(update: Date[]) {
    /**
     * Nếu có thời gian bắt đầu và thời gian kết thúc
     */
    if (update[1]) {
      /**
       * Lưu giá trị vào store
       */
      // dispatch(
      //   setFilterTime({
      //     /** Xử lý chuyển start_time về 00:00:00 */
      //     start_time: renderDateStartEnd(update[0], 'start').getTime(),
      //     /** xử lý chuyển end_time về 23:59:59, */
      //     end_time: renderDateStartEnd(update[1], 'end').getTime(),
      //   }),
      // )
      /** ghi lại giá trị lên url */
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        type_date: 'CUSTOM',
        from: renderDateStartEnd(update[0], 'start').getTime().toString(),
        to: renderDateStartEnd(update[1], 'end').getTime().toString(),
      })
    }
    /**
     * set giá trị đã chọn
     */
    setDateRange(update)
  }
  /** State check có data được chọn chưa */
  const [is_selecting_date_range, setIsSelectingDateRange] = useState(false)

  /** hàm xử lý khi bấm ra ngoài select */
  useEffect(() => {
    /**
     * Nếu có click ra ngoài select thì gọi hàm handleClickOutside
     */
    document.addEventListener('mousedown', handleClickOutside)
    /**
     * Cleanup
     */
    return () => {
      /**
       * Nếu không có click ra ngoài select thì xóa sự kiện handleClickOutside
       */
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={SELECT_REF}
      className="relative h-9 md:min-w-44"
    >
      <button
        className="flex h-full items-center justify-between w-full px-2 md:px-3 py-2 border rounded-lg bg-white text-left text-sm"
        onClick={handleToggle}
      >
        {selected_value?.value ? (
          /** Nếu có giá trị được chọn */
          <p className="line-clamp-1 items-center text-slate-700">
            {selected_value.value === 'CUSTOM'
              ? /** Nếu giá trị là 'CUSTOM' */
                window.innerWidth < 768
                ? /** Nếu chiều rộng cửa sổ nhỏ hơn 768px, hiển thị thời gian tùy chỉnh với định dạng ngắn */
                  CUSTOM_TIME(false)
                : /** Nếu chiều rộng cửa sổ lớn hơn hoặc bằng 768px, hiển thị thời gian tùy chỉnh với định dạng đầy đủ */
                  CUSTOM_TIME()
              : /** Nếu không phải 'CUSTOM', hiển thị khóa của giá trị đã chọn */
                selected_value.key}
          </p>
        ) : (
          /** Nếu không có giá trị được chọn, hiển thị văn bản 'select_time' */
          <p className="text-slate-700 font-normal">{t('select_time')}</p>
        )}
        <div className="flex-shrink-0 hidden md:flex">
          <Down />
        </div>
      </button>
      {is_open && (
        <div>
          <div className="absolute border-8 border-transparent border-b-white bottom-0 translate-y-2 right-[30%] z-10"></div>
          <div className="absolute min-w-52  mt-2 bg-white shadow-lg z-30 rounded-lg right-0">
            <div className="flex flex-col gap-y-2 p-2">
              {options.map((option, index) =>
                option.value !== 'CUSTOM' ? (
                  <div
                    key={index}
                    className={``}
                  >
                    <div
                      key={index}
                      className={`flex items-center justify-between hover:bg-gray-100 rounded-lg py-2 px-1 ${isSelected(option) && 'bg-gray-100'}`}
                      onClick={() => handleOptionClick(option)}
                    >
                      <div
                        className={`flex gap-x-3 px-2 items-center cursor-pointer gap-y-2 rounded-lg right-0`}
                      >
                        <p className="text-sm font-medium truncate">
                          {t(option.key)}
                        </p>
                      </div>
                      {isSelected(option) && (
                        <div className="flex-shrink-0">
                          <Subtract />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={index}>
                    <div
                      key={index}
                      className="hidden md:flex relative w-full border-t pt-2 top-0"
                      /** Prevent click event from propagating */
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <div className="w-full">
                        <DatePickerWithRange
                          initial_from={start_date}
                          initial_to={end_date}
                          onDateSelect={update => {
                            setDateRange(update as [Date | null, Date | null])
                            handleChangeCustomTime(update as Date[])
                            setIsSelectingDateRange(false)
                            setIsOpen(false)
                          }}
                          placeholder={t('custom')}
                          className="relative"
                        />
                      </div>
                    </div>
                    <div
                      key={index + 1}
                      className="flex md:hidden relative w-full border-t pt-2 top-0"
                      /** Prevent click event from propagating */
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <div className="w-full">
                        <DatePickerWithRange
                          initial_from={start_date}
                          initial_to={end_date}
                          onDateSelect={update => {
                            setDateRange(update as [Date | null, Date | null])
                            handleChangeCustomTime(update as Date[])
                            setIsSelectingDateRange(false)
                            setIsOpen(false)
                          }}
                          placeholder={t('custom')}
                          className="relative"
                          number_of_calenders={1}
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Select

'use client'

import * as React from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { t } from 'i18next'

/**
 * DatePickerWithRangeProps interface
 */
interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Giá trị đầu vào dạng Date hoặc timestamp */
  initial_from?: Date | number | null
  /** Giá trị đầu vào dạng Date hoặc timestamp */
  initial_to?: Date | number | null
  /** Hàm xử lý khi người dùng chọn ngày
   * @param dates [Date | number | null, Date | number | null]
   */
  onDateSelect: (dates: [Date | number | null, Date | number | null]) => void
  /** Placeholder khi chọn ngày */
  placeholder?: string
  /** Số  calender hiển thị */
  number_of_calenders?: number
}

export function DatePickerWithRange({
  className,
  initial_from,
  initial_to,
  onDateSelect,
  placeholder = t('_select_date'),
  number_of_calenders = 2,
}: DatePickerWithRangeProps) {
  /** Nếu đầu vào là timestamp, chuyển thành Date, nếu không giữ nguyên */
  const INITIAL_DATE_RANGE: DateRange | undefined = {
    from: initial_from ? new Date(initial_from) : null,
    to: initial_to ? new Date(initial_to) : null,
  }
  /** State chứa ngày được chọn */
  const [date, setDate] = React.useState<DateRange | undefined>(
    INITIAL_DATE_RANGE,
  )
  /**
   *  Mở popover
   * */
  const [is_popover_open, setIsPopoverOpen] = React.useState(false)

  /** Hàm xử lý khi người dùng chọn ngày
   * @param selected ngày được chọn
   *
   */
  const handleSelect = (selected: DateRange | undefined) => {
    /**
     * Nếu có ngày được chọn
     */
    if (selected) {
      /**
       * Chuyển ngày được chọn thành timestamp
       */
      const FROM = selected.from ? new Date(selected.from) : null
      /**
       * Chuyển ngày được chọn thành timestamp
       */
      const TO = selected.to ? new Date(selected.to) : null

      /** Set data select */
      onDateSelect([FROM ? FROM.getTime() : null, TO ? TO.getTime() : null])
    }
  }
  /** Hàm trigger mở popover
   * @param open trạng thái mở popover
   */
  const handlePopoverOpenChange = (open: boolean) => {
    /**
     * Set trạng thái mở popover
     */
    setIsPopoverOpen(open)
  }

  return (
    <div className={cn('grid', className)}>
      <Popover
        open={is_popover_open}
        onOpenChange={handlePopoverOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline_no_border'}
            className={cn(
              'w-full justify-start text-left font-medium text-sm h-9 ',
              !date && 'text-muted-foreground',
            )}
          >
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} -{' '}
                  {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={number_of_calenders}
            disabled={{ after: new Date() }}
          />
          <div className="flex text-sm p-2 justify-end gap-x-4">
            <div
              className="flex border rounded-md py-1 px-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                // setDate(INITIAL_DATE_RANGE)
                setIsPopoverOpen(false)
              }}
            >
              {t('_cancel')}
            </div>
            <div
              className="flex border rounded-md py-1 px-2 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
              onClick={() => {
                handleSelect(date)
                setIsPopoverOpen(false)
              }}
            >
              {t('_apply')}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

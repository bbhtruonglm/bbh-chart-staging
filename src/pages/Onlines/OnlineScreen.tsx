import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { selectFilterTime, selectOrgId, selectPageId } from '@/stores/appSlice'

import { TableComponent } from '@/components/Table/TableComponent'
import { getPeriod } from '@/services/api_helper'
import { keys } from 'lodash'
import { toTable } from '@/api/fetchApi'
import { useSelector } from 'react-redux'

function OnlineScreen() {
  /** id của tổ chức */
  const ORG_ID = useSelector(selectOrgId)

  /** danh sách id các trang */
  const PAGE_ID = useSelector(selectPageId)

  /** thời gian lọc */
  const FILTER_TIME = useSelector(selectFilterTime)
  /**
   * Dữ liệu online
   */
  const [data_online, setDataOnline] = useState({})
  /** Gọi dữ liệu bảng */
  const fetchTable = async () => {
    /** tính toán period */
    const DISTANCE_TIME = FILTER_TIME.end_time - FILTER_TIME.start_time
    /**
     *  Lấy period từ khoảng thời gian
     */
    const PERIOD = getPeriod(DISTANCE_TIME)

    /** Khai báo body */
    const BODY = {
      start_date: FILTER_TIME.start_time,
      end_date: FILTER_TIME.end_time,
      period: PERIOD,
      col: 'staff_id',
      event: ['duration'],
    }
    try {
      /** Call api */
      const RESULT = await toTable({
        end_point: 'app/analytic/to_table',
        body: BODY,
      })
      /**
       * Set data online
       */
      setDataOnline(RESULT.data)
    } catch (error) {
      /**
       * Log error
       */
      console.log(error)
    } finally {
      console.log('finally')
    }
  }

  /** khi mà id tổ chức và thời gian lọc thay đổi thì call api */
  useEffect(() => {
    /**
     * Nếu không có tổ chức hoặc không có trang hoặc không có thời gian lọc thì set data online rỗng
     */
    if (!ORG_ID || !PAGE_ID?.length || !FILTER_TIME.end_time) {
      /**
       * Set data online rỗng
       */
      setDataOnline({})
      /**
       * Return
       */
      return
    }
    /** Nếu có org_id call api */
    fetchTable()
  }, [ORG_ID, PAGE_ID, FILTER_TIME])

  /** Khai báo bảng data */
  const DATA: Record<
    string,
    Record<string, { name: string; online_value: number }>
  > = {
    '2024-08-16 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 6,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-17 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-18 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-19 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-20 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-21 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-22 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-23 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-24 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-25 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-26 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-27 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-28 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
    '2024-08-29 23:00:00': {
      ai_prompt_sound: {
        name: 'Trần Thế Anh',
        online_value: 7,
      },
      flow_active: {
        name: 'Nguyễn Văn Hiệp',
        online_value: 3,
      },
      ai_prompt_image: {
        name: 'Phan Văn Bảo',
        online_value: 7,
      },
      ai_prompt_text: {
        name: 'Nguyễn Quốc Hùng',
        online_value: 7,
      },
    },
  }

  // convert data đúng kiểu dữ liệu bảng
  const TABLE_DATA = keys(DATA)?.map((date) => {
    /**
     * Khai báo ROW
     */
    const ROW = { date } as Record<string, string | number>
    /**
     * Lặp qua các key trong data_ads
     */
    keys(DATA[date]).forEach((key) => {
      ROW[key] = DATA[date][key].online_value
    })
    /**
     * Trả về ROW
     */
    return ROW
  })

  /** khai báo column */
  const COLUMN_HELPER = {
    accessor: (accessorKey: any, config: any) => ({
      accessorKey,
      ...config,
    }),
  }
  /**
   * Các cột của bảng
   */
  const COLUMNS = [
    COLUMN_HELPER.accessor('date', {
      header: () => 'Khoảng thời gian',

      //@ts-ignore
      cell: (info) => {
        const rawDate = info.getValue()
        const date = new Date(rawDate)
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        return (
          <div className="line-clamp-1">
            {formattedDate !== '0' ? formattedDate : '-'}
          </div>
        )
      },
      // footer: () => 'Tổng',
      size: 180,
    }),

    /** config để hiển thị tên nhân viên ở header */
    ...keys(DATA[keys(DATA)[0]])?.map((key) =>
      COLUMN_HELPER.accessor(key, {
        header: () => `${DATA[keys(DATA)[0]][key]?.name}`,
        cell: (info: {
          getValue: () =>
            | string
            | number
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<unknown>>
            | Iterable<ReactNode>
            | null
            | undefined
        }) => (
          <div className="">
            {info.getValue() !== '0' ? info.getValue() : '-'}
          </div>
        ),
        footer: () => '-',
        size: 180,
      }),
    ),
  ]
  return (
    <div className="flex flex-col gap-y-3 bg-transparent w-full h-full">
      <TableComponent
        data={TABLE_DATA}
        columns={COLUMNS ?? []}
      />
    </div>
  )
}

export default OnlineScreen

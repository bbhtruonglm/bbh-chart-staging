import Overview from '@/pages/Tags/Overview'
import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import { t } from 'i18next'
import { useColumns } from './useColumns'
import { useTagScreen } from './useTagScreen'

interface EventData {
  /**
   * Số lượng sự kiện
   */
  event_count: string
  /**
   * Tổng giá trị
   */
  total_value: number
}

/** Định nghĩa kiểu dữ liệu cho detail rawdata */
interface DataStructure {
  /**
   * Dữ liệu chi tiết
   * @param key: string
   * @param event_name: string
   */
  [key: string]: {
    [event_name: string]: EventData
  }
}

function TagScreen() {
  /** Lấy dữ liệu bảng */
  const { TABLE_DATA, data_tag, DATA_CHART, LABELS_CHART } = useTagScreen()
  /** Dữ liệu cót bảng */
  const { COLUMNS } = useColumns()

  return (
    <div className="flex flex-col w-full flex-grow min-h-0 overflow-y-auto scrollbar-webkit scrollbar-thin">
      <div className="flex flex-col gap-y-5 md:gap-y-3 w-full flex-grow">
        {/* Tổng quan */}
        <Overview
          data_tag={data_tag}
          series={DATA_CHART}
          labels={LABELS_CHART}
        />

        {/* Bảng thống kê */}
        <div className="overflow-auto flex-grow h-172 md:h-80">
          {/* Logic dùng 2 data, nhưng màn này sử dụng chung COLUMNS */}
          <TableComponent
            data={TABLE_DATA || []}
            columns={COLUMNS || []}
            title={t('tag_analysis')}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default TagScreen

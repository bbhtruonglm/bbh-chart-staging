import { ExportExcelButton } from '../ExportExcel/ExportExcel'
import { IProColumns } from './TableFiles/type-table'
import { TableBase } from './TableFiles/TableBase'
import { TableCellsIcon } from '@heroicons/react/24/solid'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

/**
 * Interface TableProps
 */
interface TableProps<T> {
  /** Danh sách dữ liệu */
  data: T[]
  /** Các cấu hình bảng */
  columns: IProColumns<T> | any
  /** Trạng thái fixed last columns */
  is_sticky_last_column?: boolean
  /** string */
  title?: string
}

/** Bảng thống kê */
export const TableComponent = <T,>({
  data,
  columns,
  is_sticky_last_column = false,
  title = t('table_analytics'),
}: TableProps<T>) => {
  return (
    <div className="flex w-full rounded-lg p-3 gap-x-3 h-full bg-white">
      <div className="flex-shrink-0 hidden md:block">
        <TableCellsIcon className="size-5 " />
      </div>

      <div className="flex w-full flex-grow min-w-0 flex-col h-full gap-y-2">
        <div className="flex gap-x-2.5 items-center w-full justify-between">
          <div>
            <div className="flex-shrink-0 block md:hidden">
              <TableCellsIcon className="size-5 " />
            </div>
            <h4 className="text-sm font-semibold">{t('table_analytics')}</h4>
          </div>
          <ExportExcelButton
            fileName={title}
            columns={columns}
            data={data}
          />
        </div>
        <div className={`flex flex-col min-h-0 flex-grow-0`}>
          {/* PC table */}
          <TableBase
            key={columns.join(',')} // <- thêm key để ép re-render
            data={data}
            columns={columns}
            is_sticky_last_column={is_sticky_last_column}
          />
        </div>
      </div>
    </div>
  )
}

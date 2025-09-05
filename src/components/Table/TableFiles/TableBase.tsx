import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { formatWithCommas, getWidthSize } from '@/utils'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { IProColumns } from './type-table'
import { useTranslation } from 'react-i18next'

/**
 * Interface TableProps
 */
interface TableProps<T> {
  /** Danh sách du lieu */
  data: T[]
  /**Danh sách cột hiển thị dữ liệu */
  columns: IProColumns<T>
  /**Hàm xử lý icon
   * @returns void
   */
  onIconClick?: () => void
  /** Hien thi icon */
  show_icon?: boolean
  /** Fixed last column */
  is_sticky_last_column?: boolean
}
export const TableBase = <T,>({
  data,
  columns,
  onIconClick,
  show_icon = false,
  is_sticky_last_column = false,
}: TableProps<T>) => {
  /** Import i18n */
  const { t } = useTranslation()

  /** Tạo bộ dữ liệu bảng */
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  })

  /** Tính toán Tổng các cột
   * @param column_id string
   * @returns number | string
   */
  const getColumnTotal = (column_id: string) => {
    /** Lấy giá trị trong cột */
    const VALUES = getRowModel().rows.map(row => row.getValue(column_id))

    /** Chuyển đổi tất cả giá trị thành số nếu có thể */
    const NUMERIC_VALUE = VALUES.map(value => {
      /**
       * Chuyển đổi giá trị thành số nếu có thể
       */
      const NUMBER_VALUE =
        typeof value === 'number' ? value : parseFloat(value as string)
      return !isNaN(NUMBER_VALUE) ? NUMBER_VALUE : null
    }).filter(value => value !== null) as number[]
    /**
     * Tính tổng giá trị
     */
    return NUMERIC_VALUE.length > 0
      ? formatWithCommas(NUMERIC_VALUE.reduce((sum, value) => sum + value, 0))
      : '-'
  }

  return (
    <div className="flex h-full">
      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full table-fixed border-collapse rounded-lg">
          <thead>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index: number) => (
                  <th
                    key={header.id}
                    className={`relative border-0 top-0 sticky px-2 py-2 h-10 bg-slate-100 text-sm ${
                      index === 0
                        ? 'sticky left-0 z-20 bg-slate-200 text-left font-semibold rounded-tl-lg'
                        : is_sticky_last_column &&
                            index === headerGroup.headers.length - 1
                          ? 'sticky right-0 z-20 bg-slate-200 text-right font-semibold rounded-tr-lg'
                          : 'text-right font-medium'
                    }`}
                    // className={`relative border-0 bg-slate-100 px-2 py-2 h-10 sticky left-0 top-0 text-sm ${
                    //   index === 0
                    //     ? `font-semibold border-t rounded-tl-lg border-l bg-slate-200 text-left z-20 w-40 `
                    //     : 'font-medium border-t z-10 text-right'
                    // }`}
                    style={{
                      width: getWidthSize(
                        index,
                        header.getContext().header.id,
                        header.column.getSize(),
                      ),
                    }}
                    //chỉ vị trí cột 0 mới được click
                    onClick={() => {
                      if (index === 0) {
                        if (onIconClick) {
                          onIconClick()
                        }
                      }
                    }}
                  >
                    <div
                      className={`flex h-full items-center group cursor-pointer ${
                        index === 0 && show_icon
                          ? 'justify-between text-black hover:text-blue-600'
                          : index === 0
                            ? 'justify-start'
                            : 'justify-end'
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {index === 0 && show_icon && (
                        <span className=" cursor-pointer">
                          <ArrowTopRightOnSquareIcon className="size-4 font-medium" />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 border-b border-gray-200 text-center text-gray-500"
                >
                  {t('no_data')}
                </td>
              </tr>
            ) : (
              getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`border-x-0 border-y border-gray-300 px-2 py-2 h-9 text-sm font-medium ${
                        index === 0
                          ? 'sticky left-0 bg-slate-50 z-10 text-left'
                          : is_sticky_last_column &&
                              index === row.getVisibleCells().length - 1
                            ? 'sticky right-0 bg-slate-50 z-10 text-right'
                            : 'text-right'
                      }`}
                      style={{
                        width: cell.column.getSize()
                          ? cell.column.getSize()
                          : '120px',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            {data.length === 0 ? (
              <></>
            ) : (
              <tr className="font-semibold text-sm sticky bottom-0 z-20 overflow-hidden">
                <td
                  className="border-0 px-4 py-2 sticky left-0 z-20 rounded-bl-lg bg-slate-200"
                  style={{ width: '180px' }}
                >
                  {t('total')}
                </td>
                {getHeaderGroups()[0]
                  .headers.slice(1)
                  .map((header, index) => {
                    /** Check xem cô phải phần tử cố cuối */
                    const IS_LAST =
                      index === getHeaderGroups()[0].headers.length - 2
                    return (
                      <td
                        key={header.id}
                        className={`border-0 px-2 py-2 bg-slate-100 text-right ${
                          is_sticky_last_column && IS_LAST
                            ? 'sticky right-0 z-20 rounded-br-lg bg-slate-200'
                            : ''
                        }`}
                        style={{ width: header.column.getSize() }}
                      >
                        {header.column.id === 'percentage'
                          ? '100%'
                          : header.column.id
                            ? getColumnTotal(header.column.id)
                            : '-'}
                      </td>
                    )
                  })}
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  )
}

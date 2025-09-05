import TooltipTable, { TooltipState } from './ToolTipTable'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useEffect, useRef, useState } from 'react'

import { IProColumns } from './type-table'
import { t } from 'i18next'

/**
 * Interface TableProps
 */
interface TableProps<T> {
  /**
   * Dữ liệu bảng
   */
  data: T[]
  /**
   * Các cột bảng
   */
  columns: IProColumns<T> | any
  /**
   * Trạng thái loading
   */
  loading?: boolean
  /**
   * Trang hiện tại
   */
  current_page?: number
}
export const TableBaseWhite = <T,>({
  data,
  columns,
  loading,
  current_page,
}: TableProps<T>) => {
  /**
   * Ref lưu trữ cell
   */
  const CELL_REFS = useRef([])

  /** Tạo bộ dữ liệu bảng */
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  })
  /** Ref để cuộn về đầu bảng */
  const TABLE_REF = useRef(null)

  /** Cuộn về đầu bảng khi pageIndex thay đổi */
  useEffect(() => {
    /**
     * Nếu không phải trang đầu tiên thì không cuộn
     */
    if (TABLE_REF.current) {
      /**
       * Cuộn về đầu bảng
       */
      TABLE_REF.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading])
  return (
    <div className="flex h-full">
      <div className="relative overflow-x-auto rounded-lg">
        <table
          className="w-full table-fixed border-collapse rounded-lg"
          ref={TABLE_REF}
        >
          <thead>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index: number) => (
                  <th
                    key={header.id}
                    className={`relative border-0 bg-white px-2 py-2 h-10 text-left sticky left-0 top-0 text-xs font-semibold ${
                      index === 0
                        ? 'font-semibold rounded-tl-lg border-l z-40 w-40'
                        : 'font-medium z-30'
                    }`}
                    style={{
                      width: header.column.getSize()
                        ? header.column.getSize()
                        : '180px',
                    }}
                  >
                    <div className="flex h-full group cursor-pointer text-center items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
              getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className={`border-x-0 border-y border-gray-300 px-2 py-2 h-9 text-sm ${cell.column.id === 'event' || cell.column.id === 'parsedMessageType' || cell.column.id === 'parsedClientName' ? ' font-medium' : ''} ${
                        cellIndex === 0 ? 'sticky left-0 bg-white z-10' : ''
                      }`}
                      style={{
                        width: cell.column.getSize()
                          ? cell.column.getSize()
                          : '180px',
                      }}
                    >
                      {/* Giới hạn hiển thị 1 dòng trong bảng với dấu "..." */}
                      <div
                        ref={el =>
                          (CELL_REFS.current[
                            rowIndex * row.getVisibleCells().length + cellIndex
                          ] = el)
                        } // Assign ref to each cell for checking overflow
                        className="truncate"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

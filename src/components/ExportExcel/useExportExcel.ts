// utils/useExportExcel.ts
import * as XLSX from 'xlsx'

import { saveAs } from 'file-saver'

/**
 * Props cho hàm exportToExcel
 */
interface ExportExcelProps<T> {
  /** Tên file xuất ra, mặc định là "data_export" */
  fileName?: string

  /**
   * Danh sách các cột cần xuất ra
   */
  columns: {
    /** Khóa để lấy dữ liệu trong từng row */
    accessorKey?: string

    /** Nhãn hiển thị chính */
    label?: string

    /** Metadata bổ sung, có thể chứa label phụ */
    meta?: {
      /** Label phụ, ưu tiên nếu có */
      label?: string
    }
  }[]

  /** Dữ liệu dạng mảng object */
  data: T[]
}

/**
 * Hàm xuất dữ liệu ra file Excel (.xlsx)
 *
 * @param fileName - Tên file xuất ra
 * @param columns - Danh sách cột, gồm accessorKey, label, meta.label
 * @param data - Dữ liệu đầu vào dạng mảng object
 */
export function exportToExcel<T>({
  fileName = 'data_export',
  columns,
  data,
}: ExportExcelProps<T>) {
  /**
   * 1. Lấy headers từ label hoặc accessorKey
   * - Ưu tiên: label > meta.label > accessorKey > ''
   */
  const HEADERS = columns.map(
    col => col.label ?? col.meta?.label ?? col.accessorKey ?? '',
  )

  /**
   * 2. Format data theo thứ tự columns
   * - Với mỗi row trong data, duyệt qua columns để lấy giá trị theo accessorKey
   * - Nếu không có dữ liệu thì trả về chuỗi rỗng ''
   */
  const FORMATTED_DATA = data.map(row => {
    return columns.map(col => {
      const KEY = col.accessorKey
      return KEY ? ((row as any)[KEY] ?? '') : ''
    })
  })

  /**
   * 3. Tạo worksheet từ headers + dữ liệu
   */
  const WORKSHEET_DATA = [HEADERS, ...FORMATTED_DATA]
  const WORKSHEET = XLSX.utils.aoa_to_sheet(WORKSHEET_DATA)

  /**
   * 4. Tạo workbook và append worksheet vào
   */
  const WORKBOOK = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(WORKBOOK, WORKSHEET, 'Sheet1')

  /**
   * 5. Xuất file Excel (.xlsx)
   */
  const EXCEL_BUFFER = XLSX.write(WORKBOOK, {
    bookType: 'xlsx',
    type: 'array',
  })

  /** Tạo blob cho file Excel */
  const BLOB = new Blob([EXCEL_BUFFER], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })

  /** Gọi saveAs để tải file về */
  saveAs(BLOB, `${fileName}.xlsx`)
}

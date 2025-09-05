import * as XLSX from 'xlsx'

import { formatExcelData } from './formatExcelData'
import { parseData } from './parseData'
import { saveAs } from 'file-saver'

/** interface cho cột xuất Excel */
export interface ExportColumn {
  /** Khóa truy cập dữ liệu */
  accessorKey?: string
  /** Nhãn hiển thị cho cột */
  label?: string

  /** Thông tin bổ sung cho cột */
  meta?: {
    /** Nhãn hiển thị cho cột */
    label?: string
  }
}

interface ExportExcelProps<T> {
  /** Tên file xuất */
  fileName?: string

  /** Các cột dữ liệu */
  columns: ExportColumn[]

  /** Dữ liệu xuất */
  data: T[]
}

export function exportToExcel<T>({
  fileName = 'data_export',
  columns,
  data,
}: ExportExcelProps<T>) {
  /** Xử lý data */
  const PARSED_DATA = parseData<T>(data, 'data')

  /** 1. Format data và headers dựa trên columns */
  const { HEADERS, FORMATTED_DATA } = formatExcelData<T>({
    columns: columns as any,
    data: PARSED_DATA,
  })
  /** 2. Ghép header + data */
  const WORKSHEET_DATA = [HEADERS, ...FORMATTED_DATA]
  /** Tạo worksheet từ dữ liệu */
  const WORKSHEET = XLSX.utils.aoa_to_sheet(WORKSHEET_DATA)

  /** 3. Tạo workbook */
  const WORKBOOK = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(WORKBOOK, WORKSHEET, 'Sheet1')

  /** 4. Xuất file Excel */
  const EXCEL_BUFFER = XLSX.write(WORKBOOK, { bookType: 'xlsx', type: 'array' })
  /** Tạo blob từ buffer */
  const BLOB = new Blob([EXCEL_BUFFER], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })

  saveAs(BLOB, `${fileName}.xlsx`)
}

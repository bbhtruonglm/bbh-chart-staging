import { ColumnDef } from '@tanstack/react-table'

interface FormatExcelDataProps<T> {
  /** Các cột dữ liệu */
  columns: ColumnDef<T, any>[]
  /** Dữ liệu */
  data: T[]
}

export function formatExcelData<T>({ columns, data }: FormatExcelDataProps<T>) {
  /** Lọc bỏ các cột không có accessorKey hoặc accessorKey = 'action' */
  const EXPORT_TABLE_COLS = columns.filter(
    (col): col is ColumnDef<T, any> & { accessorKey: string } =>
      'accessorKey' in col && col.accessorKey !== 'action' && !!col.accessorKey,
  )

  /** Lấy tiêu đề cột: ưu tiên meta.label, fallback về header hoặc accessorKey */
  const HEADERS = EXPORT_TABLE_COLS.map(
    col =>
      (col.meta as { label?: string } | undefined)?.label ??
      (typeof col.header === 'string' ? col.header : (col.accessorKey ?? '')),
  )

  /** Hàm helper: xử lý lấy giá trị thực từ các giá trị phức tạp */
  const extractValue = (value: any): string => {
    if (value == null) return ''

    /** Xử lý trường hợp giá trị là object kiểu JSX (ví dụ: { props: { children: "..." } }) */
    if (
      typeof value === 'object' &&
      'props' in value &&
      'children' in value.props
    ) {
      return extractValue(value.props.children)
    }

    /** Xử lý trường hợp giá trị là mảng (ví dụ: children có thể là 1 mảng phần tử) */
    if (Array.isArray(value)) {
      return value.map(extractValue).filter(Boolean).join(', ')
    }

    /** Xử lý giá trị đơn giản (string, number, boolean) */
    return String(value)
  }

  /** Xây dựng dữ liệu Excel dựa trên cell renderer của từng cột */
  const FORMATTED_DATA = data.map(row =>
    /** Map các cột để lấy giá trị tương ứng */
    EXPORT_TABLE_COLS.map(col => {
      const KEY = col.accessorKey as keyof T

      /** Nếu có cell renderer thì dùng để định dạng giá trị */
      if (col.cell && typeof col.cell === 'function') {
        try {
          /** TanStack Table cell yêu cầu một đối tượng "info", tạo fake info để truyền vào */
          const CELL_VALUE = col.cell({
            getValue: () => row[KEY] ?? '',
            row: { original: row },
          } as any)

          /** Trích xuất giá trị thực từ kết quả render cell */
          return extractValue(CELL_VALUE)
        } catch (error) {
          console.warn(`Lỗi khi render cell cho cột ${col.accessorKey}:`, error)
          /** Nếu lỗi khi render thì fallback về giá trị raw */
          return extractValue(row[KEY])
        }
      }

      /** Mặc định: trả về giá trị raw */
      return extractValue(row[KEY])
    }),
  )

  return {
    HEADERS,
    FORMATTED_DATA,
  }
}

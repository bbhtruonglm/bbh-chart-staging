import { exportToExcel } from './useExportExcel'
import { t } from 'i18next'

/** interface  */
interface ExportExcelButtonProps<T> {
  /** Tên file xuất  */
  fileName?: string

  /** Các cột dữ liệu */
  columns: any[]
  /** Dữ liệu */
  data: T[]
}

export function ExportExcelButton<T>({
  fileName = 'report',
  columns,
  data,
}: ExportExcelButtonProps<T>) {
  /** Hàm xử lý xuất file Excel */
  const handleExport = () => {
    exportToExcel({
      fileName,
      columns,
      data,
    })
  }

  return (
    <button
      onClick={handleExport}
      className="text-sm text-green-600 hover:underline"
    >
      {t('export_excel')}
    </button>
  )
}

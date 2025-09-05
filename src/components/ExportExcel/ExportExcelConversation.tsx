import Loading from '../Loading'
// components/ExportExcelButton.tsx
import { fetchApi } from '@/utils/fetchApi'
import { t } from 'i18next'
import { useDispatch } from 'react-redux'
import { useExportExcelConversation } from './useExportExcelConversation'

interface ExportExcelButtonProps {
  /** Các cột dữ liệu */
  columns: any[]
  /** Dữ liệu xuất */
  body: Record<string, any>
  /** Endpoint API */
  endpoint: string

  /** Tên file xuất */
  fileName?: string
}

export function ExportExcelConversation({
  columns,
  body,
  endpoint,
  fileName = 'data_export',
}: ExportExcelButtonProps) {
  /** Hàm dispatch */
  const dispatch = useDispatch()
  /** Khởi tạo hook xuất Excel */
  const { handleExport, loading } = useExportExcelConversation({
    dispatch,
    fetchFunction: fetchApi,
    columns,
    body,
    endpoint,
    fileName,
  })

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex gap-x-2 px-4 py-2 text-sm cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? t('exporting') : t('export_excel')}
      <span>{loading && <Loading />}</span>
    </button>
  )
}

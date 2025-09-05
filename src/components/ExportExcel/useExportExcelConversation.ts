import { exportToExcel } from '@/utils/exportExcel'
import { fetchApi } from '@/utils/fetchApi'
// hooks/useExportExcel.ts
import { useState } from 'react'

interface UseExportExcelProps {
  /** Hàm dispatch */
  dispatch: any
  /** Hàm gọi API */
  fetchFunction: typeof fetchApi
  /** Các cột dữ liệu */
  columns: any[]
  /** Dữ liệu xuất */
  body: Record<string, any>
  /** Endpoint API */
  endpoint: string

  /** Tên file xuất */
  fileName?: string
}

export function useExportExcelConversation<T>({
  dispatch,
  fetchFunction,
  columns,
  body,
  endpoint,
  fileName = 'data_export',
}: UseExportExcelProps) {
  /** Trạng thái loading */
  const [loading, setLoading] = useState(false)

  /** Hàm xử lý xuất Excel */
  const handleExport = async () => {
    try {
      /** Bắt đầu trạng thái loading */
      setLoading(true)
      /** Lấy dữ liệu từ API */
      const DATA = await fetchFunction<T[]>({
        dispatch,
        type: 'readEvent',
        body,
        endpoint,
        preventLoading: true,
      })
      /** Export dữ liệu */
      exportToExcel({
        fileName,
        columns,
        data: DATA,
      })
    } catch (error) {
      console.error('Export Excel error:', error)
    } finally {
      /** Kết thúc trạng thái loading */
      setLoading(false)
    }
  }

  return { handleExport, loading }
}

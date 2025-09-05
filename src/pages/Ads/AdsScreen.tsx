import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import { t } from 'i18next'
import { useAdsScreen } from './useAdsScreen'
import { useColumns } from '@/pages/Ads/useColumns'

function AdsScreen() {
  /** Lấy dữ liệu bảng */
  const { TABLE_DATA } = useAdsScreen()
  /** Dữ liệu cót bảng */
  const { COLUMNS } = useColumns()

  return (
    <div className="flex flex-col bg-transparent flex-grow min-h-0 w-full overflow-y-auto scrollbar-webkit scrollbar-thin">
      <TableComponent
        data={TABLE_DATA}
        columns={COLUMNS || []}
        title={t('ads_analysis')}
      />
      <ToastContainer />
    </div>
  )
}

export default AdsScreen

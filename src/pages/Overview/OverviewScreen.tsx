import 'react-toastify/dist/ReactToastify.css'

import ModalOpenSetting from '@/components/Modal/ModalOpenSetting'
import Overview from '@/pages/Overview/Section/Overview'
import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import ToolTipCustom from '@/components/Tooltip/ToolTipCustom'
import { t } from 'i18next'
import { useColumnsCustom } from './useColumnsCustom'
import { useMemo } from 'react'
import { useOverview } from './useOverview'

function OverviewScreen() {
  /** Lấy dữ liệu tổng quan */
  const { SUMMARY_DATA, SERIES_DATA, CATEGORIES, TABLE_DATA } = useOverview()
  /** Lấy dữ liệu cơ bản từ useColumns */
  const {
    VISIBLE_COLUMNS,
    ALL_COLUMNS,
    is_open_setting,
    setIsOpenSetting,
    COLUMNS_SETTING,
    COLUMNS_DATE,
    temp_visible_keys,
    visible_keys,
    updateVisibleColumnsState,
    saveVisibleColumns,
    tooltip,
  } = useColumnsCustom({
    is_open_modal: false,
  })
  /** Gop cơ bản với cơ bản */
  const TOTAL_COLUMNS = useMemo(() => {
    return [...COLUMNS_DATE, ...VISIBLE_COLUMNS, ...COLUMNS_SETTING]
  }, [VISIBLE_COLUMNS, COLUMNS_SETTING, COLUMNS_DATE])

  return (
    <div className="flex flex-col w-full flex-grow min-h-0 overflow-y-auto scrollbar-webkit scrollbar-thin">
      <div className="flex flex-col gap-y-5 md:gap-y-3 w-full flex-grow">
        <Overview
          data_tag={SUMMARY_DATA}
          series_data={SERIES_DATA}
          categories_data={CATEGORIES}
        />
        <div className="overflow-auto flex-grow h-172 md:h-80">
          <TableComponent
            data={TABLE_DATA}
            columns={TOTAL_COLUMNS}
            is_sticky_last_column
            title={t('overview_analysis')}
          />
        </div>
      </div>
      <ToastContainer />
      <ModalOpenSetting
        is_open={is_open_setting}
        onClose={() => setIsOpenSetting(false)}
        visibleColumns={VISIBLE_COLUMNS}
        allColumns={ALL_COLUMNS}
        tempVisibleKeys={temp_visible_keys}
        updateVisibleColumnsState={updateVisibleColumnsState}
        saveVisibleColumns={saveVisibleColumns}
        visible_keys={visible_keys}
      />
      {/* Tooltip */}

      <ToolTipCustom
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
    </div>
  )
}

export default OverviewScreen

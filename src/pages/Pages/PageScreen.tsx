import ModalOpenSetting from '@/components/Modal/ModalOpenSetting'
import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import ToolTipCustom from '@/components/Tooltip/ToolTipCustom'
import { t } from 'i18next'
import { useColumns } from './useColumns'
import { useMemo } from 'react'
import { usePageScreen } from './usePageScreen'

function PageScreen() {
  /** Dữ liệu bảng */
  const { TABLE_DATA } = usePageScreen()
  /** lấy dữ liệu cót bảng */
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
  } = useColumns({
    is_open_modal: false,
  })
  /** Gop cơ bản với cơ bản */
  const TOTAL_COLUMNS = useMemo(() => {
    return [...COLUMNS_DATE, ...VISIBLE_COLUMNS, ...COLUMNS_SETTING]
  }, [VISIBLE_COLUMNS, COLUMNS_SETTING, COLUMNS_DATE])

  return (
    <div className="flex flex-col bg-transparent w-full flex-grow min-h-0 overflow-y-auto scrollbar-webkit scrollbar-thin">
      <TableComponent
        data={TABLE_DATA}
        columns={TOTAL_COLUMNS || []}
        is_sticky_last_column
        title={t('page_analysis')}
      />
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

export default PageScreen

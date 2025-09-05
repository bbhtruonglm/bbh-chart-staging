import { useMemo, useState } from 'react'

import Modal from '@/components/Modal/ModalConversation/Modal'
import ModalOpenSetting from '@/components/Modal/ModalOpenSetting'
import Overview from './Overview/Overview'
import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import ToolTipCustom from '@/components/Tooltip/ToolTipCustom'
import { t } from 'i18next'
import { useColumns } from './useColumns'
import { useStaffScreen } from './useStaffScreen'

function StaffScreen() {
  /** Dữ liệu bảng */
  const { TABLE_DATA } = useStaffScreen()
  /** lấy dữ liệu cót bảng */
  const {
    VISIBLE_COLUMNS,
    ALL_COLUMNS,
    is_open_setting,
    setIsOpenSetting,
    COLUMNS_SETTING,
    COLUMNS_STAFF,
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
    return [...COLUMNS_STAFF, ...VISIBLE_COLUMNS, ...COLUMNS_SETTING]
  }, [VISIBLE_COLUMNS, COLUMNS_SETTING, COLUMNS_STAFF])
  /**
   * State quản lý việc mở modal
   */
  const [is_open_modal, setIsOpenModal] = useState(false)
  /**
   * State quản lý việc hiển thị loại modal
   */
  const [modal_type, setModalType] = useState('')
  /**
   * State quản lý body của modal
   */
  const [body, setBody] = useState({})
  return (
    <div className="flex flex-col bg-transparent w-full flex-grow min-h-0 overflow-y-auto scrollbar-webkit scrollbar-thin gap-3">
      <div className="flex xl:h-64">
        <Overview
          handleDetail={() => {
            setIsOpenModal(true)
            setModalType('STAFF_LINE_TAG')
          }}
          setBody={value => setBody(value)}
        />
      </div>
      <TableComponent
        data={TABLE_DATA}
        columns={TOTAL_COLUMNS || []}
        is_sticky_last_column
        title={t('staff_analysis')}
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
      <Modal
        is_open={is_open_modal}
        onClose={() => {
          setIsOpenModal(false)
          setModalType('')
        }}
        modal_type={modal_type}
        body={body}
      />
    </div>
  )
}

export default StaffScreen

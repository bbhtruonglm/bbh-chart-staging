import 'react-toastify/dist/ReactToastify.css'

import { useMemo, useState } from 'react'

import Modal from '@/components/Modal/ModalConversationAI/Modal'
import ModalOpenSetting from '@/components/Modal/ModalOpenSetting'
import Overview from './Section/Overview'
import { TableComponent } from '@/components/Table/TableComponent'
import { ToastContainer } from 'react-toastify'
import ToolTipCustom from '@/components/Tooltip/ToolTipCustom'
import { t } from 'i18next'
import { useAIAnalytic } from './useAIAnalytic'
import { useColumns } from './useColumns'

function AIAnalyticScreen() {
  /** Lấy dữ liệu tổng quan */
  const { SUMMARY_DATA, SERIES_DATA, CATEGORIES, TABLE_DATA } = useAIAnalytic()
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
  } = useColumns({
    is_open_modal: false,
  })
  /** Gop cơ bản với cơ bản */
  const TOTAL_COLUMNS = useMemo(() => {
    return [...COLUMNS_DATE, ...VISIBLE_COLUMNS, ...COLUMNS_SETTING]
  }, [VISIBLE_COLUMNS, COLUMNS_SETTING, COLUMNS_DATE])
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
    <div className="flex flex-col w-full flex-grow min-h-0 overflow-y-auto scrollbar-webkit scrollbar-thin">
      <div className="flex flex-col gap-y-5 md:gap-y-3 w-full flex-grow">
        <Overview
          data_tag={SUMMARY_DATA}
          series_data={SERIES_DATA}
          categories_data={CATEGORIES}
          handleDetail={() => {
            setIsOpenModal(true)
            setModalType('AI_ANALYTIC')
          }}
          setBody={value => setBody(value)}
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

export default AIAnalyticScreen

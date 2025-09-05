import { ExportExcelButton } from '@/components/ExportExcel/ExportExcel'
import { ExportExcelConversation } from '@/components/ExportExcel/ExportExcelConversation'
import Loading from '../../Loading'
import Pagination from '../../Table/TableFiles/Pagination'
import { TableBaseWhite } from '../../Table/TableFiles/TableBaseWhite'
import ToolTipCustom from '@/components/Tooltip/ToolTipCustom'
import { t } from 'i18next'
import { useColumns } from './useColumns'
import { useModal } from './useModal'

const Modal = ({ is_open, onClose, modal_type, body }) => {
  /**
   * Nếu modal không mở thì trả về null
   */
  if (!is_open) return null
  /** Lấy data từ useModal */
  const {
    loading,
    current_page,
    items_per_page,
    is_next_page,
    PARSED_DATA,
    handleClick,
    getNamePage,
    handlePageChange,
    handlePerPageChange,
    handleClickOutside,
  } = useModal({ is_open, body, onClose })
  /**  Lay danh sach COLUMN */
  const { COLUMNS, tooltip } = useColumns({
    modal_type,
    getNamePage,
    handleClick,
  })

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 px-3 py-16 md:py-10  md:px-32"
      onClick={handleClickOutside}
    >
      <div className="flex flex-col bg-white rounded-lg w-full h-full p-2">
        <div className="flex justify-between p-2 border-b flex-shrink-0 items-center">
          <h2 className="text-base font-semibold">{t('detail_list')}</h2>
          <div className="flex gap-x-2 items-center">
            {/* <ExportExcelButton
              fileName={t('conversation_list')}
              columns={COLUMNS}
              data={PARSED_DATA}
            /> */}
            <ExportExcelConversation
              columns={COLUMNS}
              body={body}
              endpoint="app/analytic/read_event"
              fileName={t('conversation_list')}
            />
            <div
              onClick={onClose}
              className="bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded hover:bg-slate-200 cursor-pointer"
            >
              {t('_close')}
            </div>
          </div>
        </div>
        <div className="flex flex-grow min-h-0 rounded-md p-2 ">
          <div className="flex w-full flex-grow min-h-0 flex-col border rounded-md">
            <div className="flex flex-col rounded-md min-h-0 w-full flex-grow">
              <TableBaseWhite
                columns={COLUMNS}
                data={PARSED_DATA}
                loading={loading}
                current_page={current_page}
              />
            </div>

            <div
              className={`flex-shrink-0 flex ${loading ? 'justify-between' : 'justify-between'} items-center`}
            >
              <div></div>
              {loading && <Loading />}

              <Pagination
                /** Trang hiện tại */
                current_page_parent={current_page}
                /** Số lượng hiển thị trên trang */
                items_per_page={items_per_page}
                /** Hàm đổi trang */
                onPageChange={handlePageChange}
                /** Hàm đổi số lượng hiển thị trên trang */
                onPerPageChange={handlePerPageChange}
                /** check có còn data để bấm next không */
                is_next_page={is_next_page}
                /** Loading */
                is_loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <ToolTipCustom
        content={tooltip.content}
        visible={tooltip.visible}
        position={tooltip.position}
      />
    </div>
  )
}

export default Modal

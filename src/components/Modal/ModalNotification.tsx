import {
  selectListNotification,
  selectOrgId,
  selectUnreadNotification,
  setListNotification,
  setUnreadNotification,
} from '@/stores/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import Close from '@/assets/icons/Close'
import Loading from '../Loading'
import { apiCommon } from '@/api/fetchApi'
import { formatDateTime } from '@/utils'
import { t } from 'i18next'

/**
 * Interface của props của component
 */
interface IProps {
  /**
   * Trạng thái mở modal
   */
  is_open: boolean
  /**
   * Hàm đóng modal
   */
  onClose: () => void
  /**
   * Hàm submit
   */
  onSubmit: () => void
}
/**
 * Component ModalNotification: Hiển thị thông báo dạng modal
 * @param {boolean} is_open - Trạng thái mở/đóng modal
 * @param {Function} onClose - Hàm đóng modal
 * @param {Function} onSubmit - Hàm xử lý khi submit
 */
const ModalNotification = ({ is_open, onClose, onSubmit }: IProps) => {
  /**
   * Nếu modal không mở, không hiển thị gì cả
   */
  if (!is_open) return null
  /**
   * State lưu trữ thông báo được chọn
   */
  const [noti_selected, setNotiSelected] = useState<any>(null)

  /**
   * Theo dõi sự thay đổi của biến `is_open`.
   * Nếu `is_open` là `true`, thêm lớp `no-scroll` vào thẻ body để ngăn cuộn.
   * Nếu `is_open` là `false`, loại bỏ lớp `no-scroll`.
   */
  useEffect(() => {
    /**
     * Thêm lớp `no-scroll` vào thẻ body khi component được mount và `is_open` là `true`.
     */
    if (is_open) {
      /**
       * Thêm lớp `no-scroll` vào thẻ body.
       */
      document.body.classList.add('no-scroll')
      /**
       * Xóa lớp `no-scroll` khi component bị unmount hoặc khi `is_open` thay đổi.
       */
    } else {
      /**
       * Xóa lớp `no-scroll` khi component bị unmount hoặc khi `is_open` thay đổi.
       */
      document.body.classList.remove('no-scroll')
    }

    /** Xóa lớp `no-scroll` khi component bị unmount hoặc khi `is_open` thay đổi */
    return () => {
      /**
       * Xóa lớp `no-scroll` khi component bị unmount hoặc khi `is_open` thay đổi.
       */
      document.body.classList.remove('no-scroll')
    }
  }, [is_open])

  /**
   * Lắng nghe sự kiện bấm phím `Escape` để đóng modal.
   */
  useEffect(() => {
    /**
     *  Hàm xử lý khi bấm phím
     * @param event Sự kiện bàn phím
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      /**
       * Nếu bấm phím `Escape`, đóng modal.
       */
      if (event.key === 'Escape') {
        /**
         * Đóng modal
         */
        onClose()
      }
    }
    /**
     * Thêm sự kiện lắng nghe bàn phím
     */
    document.addEventListener('keydown', handleKeyDown)
    /**
     * Xóa sự kiện lắng nghe bàn phím khi component bị unmount
     */
    return () => {
      /**
       * Xóa sự kiện lắng nghe bàn phím khi component bị unmount
       */
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /**
   * Hàm xử lý khi click ra ngoài modal.
   * Nếu click trúng vùng ngoài modal, đóng modal.
   * @param e Sự kiện click chuột
   */
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    /**
     * Nếu click ra ngoài modal, đóng modal.
     */
    if (e.target === e.currentTarget) {
      /**
       * Đóng modal
       */
      onClose()
    }
  }
  /**
   * Trạng thái loading khi đánh dấu tất cả thông báo là đã đọc.
   */
  const [loading, setLoading] = useState(false)

  /** Lấy thông tin từ Redux store */
  const ORG_ID = useSelector(selectOrgId) // ID của tổ chức
  /**  Số lượng thông báo chưa đọc */
  const NOTIFICATION_COUNT = useSelector(selectUnreadNotification)
  /** Danh sách thông báo */
  const LIST_NOTIFICATION = useSelector(selectListNotification)
  /** Hàm dispatch để cập nhật Redux */
  const dispatch = useDispatch()

  /**
   * Đánh dấu một thông báo là đã đọc.
   * @param noti_id ID của thông báo
   */
  const readNoti = async (noti_id: string) => {
    try {
      /**
       * Gọi API đánh dấu thông báo đã đọc.
       */
      const RES = await apiCommon({
        end_point: 'app/noti/read_noti',
        body: { noti_id, org_id: ORG_ID },
        service_type: 'billing',
      })

      /** Cập nhật trạng thái thông báo trong danh sách */
      const UPDATED_NOTIFICATIONS = LIST_NOTIFICATION.map((noti) =>
        noti.noti_id === noti_id
          ? { ...noti, ...RES.data, is_read: true }
          : noti,
      )

      /** Cập nhật danh sách thông báo trong Redux */
      dispatch(setListNotification(UPDATED_NOTIFICATIONS))

      /** Giảm số lượng thông báo chưa đọc */
      const UNREAD_COUNT = NOTIFICATION_COUNT - 1
      /**
       * Cập nhật số lượng thông báo chưa đọc trong Redux
       */
      dispatch(setUnreadNotification(UNREAD_COUNT))
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo:', error)
    }
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc.
   */
  const handleReadAll = async () => {
    /** Hiển thị trạng thái loading */
    setLoading(true)
    try {
      /**
       * Lọc ra danh sách thông báo chưa đọc
       */
      const UNREAD = LIST_NOTIFICATION.filter((noti) => !noti.is_read)

      /** Gọi API cho tất cả thông báo chưa đọc (chạy song song) */
      const RESULT = await Promise.all(
        UNREAD.map((noti) =>
          apiCommon({
            end_point: 'app/noti/read_noti',
            body: { noti_id: noti.noti_id, org_id: ORG_ID },
            service_type: 'billing',
          }),
        ),
      )

      /** Cập nhật danh sách thông báo dựa trên phản hồi từ API */
      const UPDATED_NOTIFICATIONS = LIST_NOTIFICATION.map((noti) => {
        /**
         * Tìm thông báo trong danh sách phản hồi từ API
         */
        const RESPONSE = RESULT.find(
          (res) => res?.data?.noti_id === noti.noti_id,
        )
        /**
         * Nếu tìm thấy thông báo, cập nhật thông báo trong danh sách
         */
        return RESPONSE ? { ...noti, ...RESPONSE.data } : noti
      })

      /** Cập nhật Redux */
      dispatch(setListNotification(UPDATED_NOTIFICATIONS))
      /** Đặt số lượng thông báo chưa đọc về 0 */
      dispatch(setUnreadNotification(0))
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả thông báo:', error)
    } finally {
      /** Tắt trạng thái loading */
      setLoading(false)
    }
  }

  /** Sử dụng useMemo để tối ưu hóa việc render danh sách thông báo */
  const MEMOIZED_NOTIFICATIONS = useMemo(
    () => LIST_NOTIFICATION,
    [LIST_NOTIFICATION],
  )

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-0"
      onClick={handleClickOutside}
    >
      <div className="flex flex-col bg-bg-gradient shadow-lg md:rounded-lg h-full md:h-4/5 w-4/5 p-2">
        <div className="flex justify-between flex-shrink-0 items-center px-3">
          <h2 className="text-lg font-medium">{t('_notification')}</h2>
          <div
            onClick={onClose}
            className=" text-slate-700 text-sm font-medium p-2 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <Close />
          </div>
        </div>
        <div className="flex flex-grow min-h-0 rounded-md">
          <div className="flex w-full flex-grow min-h-0 flex-col rounded-md">
            <div className="flex flex-col rounded-md min-h-0 w-full mt-2 flex-grow justify-between gap-y-2">
              <div className="grid grid-cols-2 w-full overflow-hidden md:h-full justify-between items-center gap-x-2 bg-white p-4 gap-2 rounded-md">
                <div className="flex w-full h-full gap-y-2 overflow-y-auto">
                  <div className="flex flex-col gap-y-2 flex-grow min-h-0 h-full overflow-y-auto scrollbar-webkit scrollbar-thin rounded-lg ">
                    {/* List tin nhắn */}
                    {MEMOIZED_NOTIFICATIONS?.map((item, index) => {
                      return (
                        <div
                          className={`border rounded-lg py-3 px-4 hover:bg-slate-100 cursor-pointer ${
                            item?.is_read ? '' : 'bg-slate-200'
                          } ${
                            item?._id === noti_selected?._id
                              ? 'border-blue-700'
                              : ''
                          }`}
                          onClick={() => {
                            setNotiSelected(item)
                            if (item?.is_read === undefined || !item?.is_read) {
                              readNoti(item?.noti_id)
                            }
                          }}
                          key={item._id}
                        >
                          <div className="flex flex-col gap-x-3 h-11">
                            <div className="flex  justify-between items-center">
                              <h4 className="truncate text-left text-sm font-medium">
                                {item?.noti_title}
                              </h4>
                              {!item?.is_read && (
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2.5 justify-between">
                              <h4 className="min-w-0 truncate">
                                {item?.noti_content}
                              </h4>
                              <h4 className="flex-shrink-0">
                                {formatDateTime(item?.createdAt)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Chi tiêt tin nhắn */}
                <div className="overflow-hidden h-full border rounded-lg">
                  {!noti_selected ? (
                    <div className="text-sm text-slate-500 text-center mt-4">
                      {t('_please_select_notification')}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-2 p-4 h-full overflow-y-auto">
                      <div className="bg-slate-100 text-xs py-1 px-2 rounded flex-shrink-0 flex justify-between">
                        <h4 className="font-medium">
                          {noti_selected?.noti_title}
                        </h4>
                        <p className="">
                          {formatDateTime(noti_selected?.createdAt)}
                        </p>
                      </div>
                      <div className=" overflow-y-auto scrollbar-webkit scrollbar-thin">
                        <p
                          className="min-h-0 overflow-y-auto text-sm break-words whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: noti_selected?.noti_content,
                          }}
                        ></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 focus:outline-none cursor-pointer"
                  onClick={onClose}
                >
                  {t('_close')}
                </button>
                <button
                  className={` px-4 py-2 text-sm min-w-28 font-medium  rounded-md text-white border-blue-700 border bg-blue-700 hover:bg-blue-800 cursor-pointer`}
                  onClick={() => {
                    handleReadAll()
                  }}
                  disabled={loading}
                >
                  {loading ? <Loading color_white /> : t('_read_all')}
                </button>
              </div>
            </div>

            <div
              className={`flex-shrink-0 flex ${
                loading ? 'justify-between' : 'justify-between'
              } items-center`}
            >
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalNotification

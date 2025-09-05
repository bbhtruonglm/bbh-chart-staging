import { selectPageId, selectUserInfo } from '@/stores/appSlice'

import Close from '@/assets/icons/Close'
import Item from '../components/Input/Item'
import ItemSelectNoToggle from '../components/Input/ItemSelectNoToggle'
import ToolTipCustom from '../../Tooltip/ToolTipCustom'
import { apiImage } from '@/api/fetchApi'
import { copyToClipboard } from '@/utils'
import { useLanguage } from './useLanguage'
import { useModalEffects } from './useModalEffect'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useTooltip } from '../../Tooltip/useTooltip'
import { useTranslation } from 'react-i18next'
import { useUserSettings } from './useUserSettings'

/**
 * Interface của props của component
 */
interface IProps {
  /**
   * Trạng thái mở modal
   */
  is_open?: boolean
  /**
   * Hàm đóng modal
   */
  onClose?: () => void
}

const ModalInformation = ({ is_open, onClose }: IProps) => {
  /**
   * Nếu không mở modal thì trả về null
   */
  if (!is_open) return null
  /** Dịch ngôn ngữ */
  const { t } = useTranslation()
  /** THông tin người dùng */
  const USER_INFO = useSelector(selectUserInfo)
  /** Tooltip */
  const { tooltip } = useTooltip()
  /** Cài đặt người dùng */
  const { settings, updateSetting } = useUserSettings()
  /** Ngôn ngữ hiện tại */
  const { locale, changeLanguage } = useLanguage()
  /**
   * Lấy ID của nhân viên facebook
   */
  const USER_ID = USER_INFO?.user_id
  /**
   * Link avatar
   */
  const LINK_AVATAR = apiImage(`/media/s/${USER_ID}/user`)

  useModalEffects(is_open, onClose)
  /**
   * State lưu trữ thông báo
   */
  const [send_message, setSendMessage] = useState(false)

  /** Mock Ngôn ngữ */
  const WEB_LANGUAGES = [
    { key: 'Tiếng Việt', value: 'vi' },
    { key: 'English', value: 'en' },
    { key: 'ไทย', value: 'th' },
    { key: '中文', value: 'zh' },
    { key: '日本語', value: 'ja' },
    {
      key: '한국어',
      value: 'ko',
    },
  ]
  /** Mock data TAG */
  const DATA_TAG = [
    { key: t('_icon_tooltip'), value: 'ICON_TOOLTIP' },
    { key: t('_icon'), value: 'ICON' },
    { key: t('_full'), value: 'FULL' },
  ]

  /** Hàm xử lý click ra ngoài modal
   * @param e - Sự kiện click
   */
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    /**
     * Nếu click ra ngoài modal thì đóng modal
     */
    if (e.target === e.currentTarget) {
      /**
       * Đóng modal
       */
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 px-0"
      onClick={handleClickOutside}
    >
      <div className="flex flex-col bg-white md:rounded-lg w-full md:w-1/2 min-w-96 h-full md:h-fit p-3 md:px-5 md:py-2 shadow-lg">
        <div className="flex justify-between py-2 border-b flex-shrink-0 items-center ">
          <div></div>
          <h2 className="text-lg font-semibold">{t('_information')}</h2>
          <div
            onClick={onClose}
            className=" text-slate-700 text-sm font-medium p-2 rounded-full hover:bg-slate-200 cursor-pointer"
          >
            <Close />
          </div>
        </div>
        <div className="flex flex-grow min-h-0 rounded-md">
          <div className="flex w-full flex-grow min-h-0 flex-col rounded-md">
            <div className="flex flex-col h-full overflow-x-auto">
              {/* Tài khoản */}
              <div className="flex flex-col border-b py-5 gap-2">
                <h4 className="text-sm font-semibold text-slate-500">
                  {t('_account')}
                </h4>
                <div className="flex gap-3">
                  <img
                    src={LINK_AVATAR}
                    alt=""
                    className="w-11 h-11 mask-rounded-oval"
                  />

                  <div>
                    <h4 className="text-sm font-semibold truncate">
                      {USER_INFO?.full_name}
                    </h4>
                    <p
                      onClick={() => {
                        copyToClipboard(USER_INFO?.user_id)
                      }}
                      className="text-sm font-medium text-slate-500 truncate cursor-copy"
                    >
                      {USER_INFO?.user_id}
                    </p>
                  </div>
                </div>
              </div>
              {/* Thiết lập chung */}
              <div className="flex flex-col py-5 gap-2">
                <h4 className="text-sm font-semibold text-slate-500">
                  {t('_general_setting')}
                </h4>
                <div className="flex flex-col gap-3 py-1.5">
                  <Item
                    title={t('_send_notification')}
                    desc={t('_desc_send_notification')}
                    type="bell"
                    option="toggle"
                    value_toggle={send_message}
                    onChangeToggle={e => {
                      // handleUpdate('is_auto_assign_staff', e)
                      setSendMessage(e)
                    }}
                  />
                </div>
                <div className="flex w-full gap-3 py-1.5">
                  <ItemSelectNoToggle
                    title={t('_language_setting')}
                    desc={t('_desc_language_setting')}
                    type="translate"
                    option="select-no-toggle"
                    label_select="Tự động"
                    data_select={WEB_LANGUAGES}
                    value_selected={locale}
                    onSelected={e => {
                      /** Lưu ngôn ngữ mặc định */
                      changeLanguage(e as string)
                    }}
                  />
                </div>
              </div>
              {/* Thiết lập hội thoại */}
              <div className="flex flex-col py-5 gap-2">
                <h4 className="text-sm font-semibold text-slate-500">
                  {t('_conversation_setting')}
                </h4>
                <div className="flex flex-col gap-3 py-1.5">
                  <Item
                    title={t('_rewrite_information')}
                    desc={t('_desc_rewrite_information')}
                    type="setting"
                    option="toggle"
                    value_toggle={settings?.is_enable_personal_setting}
                    onChangeToggle={e => {
                      /** Lưu chế độ ghi đè thông tin */
                      updateSetting('is_enable_personal_setting', e)
                    }}
                  />
                  {settings?.is_enable_personal_setting && (
                    <Item
                      title={t('_show_page_avatar')}
                      desc={t('_desc_show_page_avatar')}
                      type="user"
                      option="toggle"
                      value_toggle={settings?.is_hide_page_avatar}
                      onChangeToggle={e => {
                        /** Lưu chế độ hiển thị avatar */
                        updateSetting('is_hide_page_avatar', e)
                      }}
                    />
                  )}
                  {settings?.is_enable_personal_setting && (
                    <ItemSelectNoToggle
                      title={t('_display_label_mode')}
                      desc={t('_desc_display_label_mode')}
                      type="translate"
                      option="select-no-toggle"
                      label_select="Tự động"
                      data_select={DATA_TAG}
                      value_selected={settings?.display_label_type}
                      onSelected={e => {
                        /** Lưu chế độ hiển thị nhãn */
                        updateSetting('display_label_type', e)
                      }}
                    />
                  )}
                </div>
              </div>
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

export default ModalInformation

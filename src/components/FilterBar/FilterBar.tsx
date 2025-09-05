import { OrganizationData, PageData } from '@/interfaces'
import {
  apiGetOrganizations,
  apiGetPageInfo,
  apiGetPages,
} from '@/api/fetchApi'
import {
  selectAccessToken,
  selectOrgId,
  setLabelList,
  setPageList,
  setStaffList,
} from '@/stores/appSlice'
import { setTriggerReload, startReload } from '@/stores/reloadSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import IconRefresh from '@/assets/icons/IconRefresh'
import Select from '@/components/FilterBar/components/Select/Select'
import SelectCompany from '@/components/FilterBar/components/SelectCompany/SelectCompany'
import SelectDate from '@/components/FilterBar/components/SelectDate'
import ToolTipCustom from '../Table/TableFiles/TooltipCustom'
import { keys } from 'lodash'
import { useTooltip } from '../Tooltip/useTooltip'
import { useTranslation } from 'react-i18next'

function FilterBar() {
  /**
   * Lấy dữ liệu ngôn ngữ từ customHook
   */
  const { t } = useTranslation()

  /** Lấy các dữ liệu tooltip từ customHook */
  const {
    tooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseEnterNoTruncated,
  } = useTooltip()

  /** hàm dispatch sự kiện của store */
  const dispatch = useDispatch()

  /** danh sách tổ chức */
  const [organizations, setOrganizations] = useState<OrganizationData[]>([])

  /**
   * State lưu trạng thái hiển thị mobile
   */
  const [is_pc, setIsMobile] = useState(window.innerWidth >= 768)
  /**
   * Xử lý khi resize
   */
  useEffect(() => {
    /**
     *  Hàm xử lý khi resize
     * @returns
     */
    const handleResize = () => setIsMobile(window.innerWidth >= 768)
    /**
     * Thêm sự kiện resize
     */
    window.addEventListener('resize', handleResize)
    /**
     * Xóa sự kiện resize
     */
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  /**
   * Access token từ store
   */
  const ACCESS_TOKEN = useSelector(selectAccessToken)

  /** danh sách trang */
  const [pages, setPages] = useState<PageData[]>([])

  /** id tổ chức */
  const ORG_ID = useSelector(selectOrgId)

  /** lấy danh sách tổ chức */
  async function getOrganizations() {
    try {
      /**
       * Lấy danh sách tổ chức
       */
      const RES = await apiGetOrganizations({})
      /**
       * Nếu có dữ liệu thì set vào state
       */
      if (RES) setOrganizations(RES.data)
    } catch (error) {
      console.log(error)
    }
  }

  /** lấy danh sách các trang */
  async function getPages() {
    try {
      /** lấy danh sách các trang */
      const RES = await apiGetPages({
        body: {
          org_id: ORG_ID,
        },
      })
      /**
       * Nếu có dữ liệu thì set vào state
       */
      if (RES) setPages(RES.data)

      /** mảng các id của trang */
      const PAGE_ID = RES.data.map((item: PageData) => item.page_id)
      /**
       * Nếu không có trang nào thì return
       */
      if (PAGE_ID.length === 0) return
      /**
       * Lấy thông tin của các trang
       */
      dispatch(setPageList(RES.data))

      /**
       * Lấy thông tin của các trang
       */
      const RES2 = await apiGetPageInfo({
        body: {
          list_page_id: PAGE_ID,
        },
      })
      /**
       * Nếu không có dữ liệu thì return
       */
      if (!RES2) return

      /**
       * Tạo ra 1 object chứa thông tin của nhân viên
       */
      let list_staff_info = {}

      /**
       * Lặp qua các trang lấy ra thông tin nhân viên của các trang cho vào 1 object
       */
      keys(RES2.data).forEach(key => {
        /**
         * Gán thông tin nhân viên vào object
         */
        list_staff_info = { ...list_staff_info, ...RES2.data[key].staff_list }
      })

      /**
       * Tạo ra 1 object chứa thông tin của nhãn
       */
      let list_label_info = {}

      /**
       * Lặp qua các trang lấy ra thông tin nhãn của các trang cho vào 1 object
       */
      keys(RES2.data).forEach(key => {
        /**
         * Gán thông tin nhãn vào object
         */
        list_label_info = { ...list_label_info, ...RES2.data[key].label_list }
      })

      /**
       * Lưu thông tin nhân viên và nhãn vào store
       */
      dispatch(setStaffList(list_staff_info))
      /**
       * Lưu thông tin nhãn vào store
       */
      dispatch(setLabelList(list_label_info))
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Lấy thông tin của tổ chức và trang khi component được render
   */
  useEffect(() => {
    /** lấy danh sách tổ chức */
    if (ACCESS_TOKEN) {
      getOrganizations()
    }
  }, [ACCESS_TOKEN])

  /**
   * Lấy danh sách trang khi tổ chức thay đổi
   */
  useEffect(() => {
    /**
     * Nếu tổ chức không tồn tại thì return
     * Chỉ lấy danh sách trang khi ở màn hình lớn hơn 768px
     */
    if (is_pc && ORG_ID) getPages()
  }, [is_pc, ORG_ID])

  return (
    <div className="flex flex-col md:flex-row justify-between gap-y-3 md:gap-x-3">
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-shrink">
          <SelectCompany options={organizations} />
        </div>
        <div className="flex-shrink">
          <Select options={pages} />
        </div>
      </div>
      <div className="flex-shrink flex items-center gap-2">
        <SelectDate
          options={[
            { key: t('today'), value: 'TODAY' },
            { key: t('yesterday'), value: 'YESTERDAY' },
            { key: t('last7Days'), value: 'LAST_7_DAYS' },
            { key: t('last30Days'), value: 'LAST_30_DAYS' },
            { key: t('thisMonth'), value: 'THIS_MONTH' },
            { key: t('lastMonth'), value: 'LAST_MONTH' },
            { key: t('last90Days'), value: 'LAST_90_DAYS' },
            { key: t('custom'), value: 'CUSTOM' },
          ]}
        />
        <div
          className="cursor-pointer p-1 flex border w-9 h-9 bg-white rounded-full text-sm items-center justify-center text-slate-700 truncate"
          onClick={() => {
            dispatch(startReload())
            dispatch(setTriggerReload())
          }}
          onMouseEnter={e => handleMouseEnterNoTruncated(e, t('_refresh'))}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-4 w-4 rounded-full flex items-center justify-center">
            <IconRefresh />
          </div>
        </div>
        {/* Render Tooltip */}
        <ToolTipCustom
          content={tooltip.content}
          visible={tooltip.visible}
          position={tooltip.position}
        />
      </div>
    </div>
  )
}

export default FilterBar

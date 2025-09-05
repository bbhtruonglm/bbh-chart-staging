import { apiCommon, apiGetInfoPartner, apiGetInfoUser } from '@/api/fetchApi'
import {
  setListNotification,
  setPartnerInfo,
  setUnreadNotification,
  setUserInfo,
} from '@/stores/appSlice'

/**
 * Lấy thông tin đối tác
 */
export const getPartnerInfo = async (dispatch: any) => {
  try {
    /**
     * Gọi api lấy thông tin đối tác
     */
    const RES = await apiGetInfoPartner({})
    /**
     * Nếu có dữ liệu trả về thì lưu vào store
     */
    if (RES.data) {
      /**
       * Lưu thông tin đối tác vào store
       */
      dispatch(setPartnerInfo(RES.data))

      console.log(RES, 'RES.data')
      /**
       * Trả về dữ liệu
       */
      return RES.data
    }
  } catch {}
}

/**
 * Lấy thông tin app
 */
export const fetchApiNoti = async (org_id: string, dispatch: any) => {
  // dispatch(startLoading())
  try {
    /**
     * Gọi api lấy thông báo
     */
    const RES = await apiCommon({
      end_point: 'app/noti/get_noti',
      body: {
        org_id: org_id,
      },
      service_type: 'billing',
    })
    /**
     * Nếu có dữ liệu trả về thì lưu vào store
     */
    if (RES?.code === 200) {
      console.log(RES, 'RES')
      /**
       * Lọc ra thông báo chưa đọc
       */
      const NOTI = RES.data.filter(item => !item.is_read)

      /**
       * Lưu số thông báo chưa đọc vào store
       */
      dispatch(setUnreadNotification(NOTI?.length))
      /**
       * Lưu thông báo vào store
       */
      dispatch(setListNotification(RES.data))
    }
  } catch (e) {
    console.log(e)
  } finally {
    // dispatch(stopLoading())
  }
}

/**
 * Hàm gọi api lấy thông tin của người dùng
 */
export async function getUserInfo(dispatch: any, navigate: any) {
  try {
    /**
     * Gọi api lấy thông tin người dùng
     */
    const RES = await apiGetInfoUser({})
    /**
     * Nếu có dữ liệu trả về thì lưu vào store
     */
    if (RES.data) {
      /**
       * Lưu thông tin người dùng vào store
       */
      dispatch(setUserInfo(RES.data))
    }
  } catch (error) {
    /**
     * Nếu không có quyền truy cập thì chuyển hướng sang trang access_denied
     */
    navigate('/access_denied')
  }
}

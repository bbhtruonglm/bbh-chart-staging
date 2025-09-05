import { startLoading, stopLoading } from '@/stores/loadingSlice'

import { API_HOST } from '@/services/env'
import { ENV } from '@/services'
import { request } from '@/api/request'
import { resetReload } from '@/stores/reloadSlice'
import { store } from '@/stores'

/** Đường dẫn host */
export const HOST: { [index: string]: string } =
  /**
   * Lấy host từ biến môi trường
   */
  API_HOST[import.meta.env.VITE_APP_ENV || 'development'] || ENV

/** đầu vào của api */
interface InputRequestApi {
  /** điểm cuối api */
  end_point?: string
  /** dữ liệu gửi đi */
  body?: any

  /** serviceType */
  service_type?: string
}

/** hàm lấy access_token */
function getAccessToken() {
  /** query url */
  // const URL_PARAMS = new URLSearchParams(window?.location?.search)

  // lấy access_token
  // const ACCESS_TOKEN = URL_PARAMS.get('access_token')
  /** Lấy Access Token từ localStorage */
  const ACCESS_TOKEN = localStorage.getItem('access_token')
  /**
   * Nếu không có access_token thì chuyển hướng về trang login
   */
  return ACCESS_TOKEN
}

/** api chung cho các api liên quan đến thống kê
 * @param end_point: điểm cuối api
 * @param body: dữ liệu gửi đi
 */
async function apiAnalytic({ end_point, body }: InputRequestApi) {
  /**
   * Gọi API
   */
  const DATA = await request({
    uri: `${HOST['analytic']}/${end_point}`,
    method: 'POST',
    headers:
      /** lần đầu thì lấy trực tiếp từ url từ lần sau lấy từ store */
      {
        Authorization: store?.getState()?.app?.access_token || getAccessToken(),
      },
    body: {
      ...body,
      /** lấy trạng thái cache trong store (true khi ấn trigger trên filter) */
      is_refresh_cache: store?.getState()?.reload?.reload_flag || false,
      page_id: store?.getState()?.app?.page_id,
      start_date: store?.getState()?.app?.filter_time?.start_time,
      end_date: store?.getState()?.app?.filter_time?.end_time,
    },
  })
  // dispatch(resetReload())
  /**
   * Trả về dữ liệu
   */
  return DATA
}

/** api chung cho các api liên quan đến tổ chức
 * @param end_point: điểm cuối api
 * @param body: dữ liệu gửi đi
 */
async function apiBilling({ end_point, body }: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    const DATA = await request({
      uri: `${HOST['billing']}/${end_point}`,
      method: 'POST',
      headers: {
        Authorization: store?.getState()?.app?.access_token || getAccessToken(),
      },
      body,
    })
    /**
     * Trả về dữ liệu
     */
    return DATA
  } catch (e) {
    throw e
  }
}
/** api chung cho các api liên quan đến lấy ảnh
 * @param end_point: điểm cuối api
 */
export function apiImage(end_point: any) {
  /**
   * Trả về đường dẫn ảnh
   */
  const URI = `${HOST['image']}${end_point}`
  /**
   * Trả về dữ liệu
   */
  return URI
}

/** api chung cho các api liên quan đến các trang
 * @param end_point: điểm cuối api
 * @param body: dữ liệu gửi đi
 * @return dữ liệu trả về
 */
async function apiService({ end_point, body }: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    const DATA = await request({
      uri: `${HOST['service']}/${end_point}`,
      method: 'POST',
      headers: {
        Authorization: store?.getState()?.app?.access_token || getAccessToken(),
      },
      body,
    })
    /**
     *  Trả về dữ liệu
     */
    return DATA
  } catch (e) {
    throw e
  }
}

/** ===== THỐNG KÊ ===== */
/** api lấy dữ liệu thống kê ra bảng
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function toTable(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    const RESULT = await apiAnalytic({
      ...params,
      end_point: 'app/analytic/to_table',
    })
    /*
     * Trả về dữ liệu
     */
    return RESULT
  } catch (e) {
    console.error('Lỗi khi gọi API:', e)
    /**
     * Ném lỗi
     */
    throw e
  }
}
/** * THỐNG KÊ */
/** api lấy dữ liệu thống kê ra bảng trong modal
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function readEvent(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    const RESULT = await apiAnalytic({
      ...params,
      end_point: 'app/analytic/read_event',
    })
    /**
     * Trả về dữ liệu
     */
    return RESULT
  } catch (e) {
    console.error('Lỗi khi gọi API:', e)
    /**
     * Ném lỗi
     */
    throw e
  }
}

/** api lấy dữ liệu thống kê ra bảng
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function countEvent(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiAnalytic({
      ...params,
      end_point: 'app/analytic/count_event',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}

/** ===== * TỔ CHỨC ===== */
/** api lấy danh sách các tổ chức
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function apiGetOrganizations(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiBilling({
      ...params,
      end_point: 'app/organization/read_org',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}

/** api lấy danh sách các page theo id tổ chức
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function apiGetPages(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiBilling({
      ...params,
      end_point: 'app/owner_ship/read_page',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}

/** ===== * PAGE ===== */
/** api lấy đầy đủ thông tin của các page
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function apiGetPageInfo(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiService({
      ...params,
      end_point: 'app/page/get_page_info_to_chat',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}
/** lấy thông tin user
 *  @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function apiGetInfoUser(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiService({
      ...params,
      end_point: 'app/chatbot_user/read_me_chatbot_user',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}
/** Lấy thông tin partner
 * @param params: đầu vào của api
 * @return dữ liệu trả về
 */
export async function apiGetInfoPartner(params: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    return await apiService({
      ...params,
      end_point: 'public/partner/read_partner',
    })
  } catch (e) {
    /**
     * Ném lỗi
     */
    throw e
  }
}
/** Hàm  try catch function xử lý chung
 * @param dispatch: dispatch của redux
 * @param type: loại api
 * @param body: dữ liệu gửi đi
 * @param end_point: điểm cuối api
 * @param handleNotify: hàm xử lý thông báo
 * @param prevent_loading: trạng thái loading
 * @return dữ liệu trả về
 */
export async function fetchFunction(
  dispatch,
  type,
  body,
  end_point,
  handleNotify,
  prevent_loading = false,
) {
  try {
    /** Bắt đầu trạng thái loading */
    if (!prevent_loading) {
      /**
       * Bắt đầu trạng thái loading
       */
      dispatch(startLoading())
    }
    /** Call api */
    const RESULT =
      type === 'toTable'
        ? await toTable({
            end_point,
            body,
          })
        : type === 'countEvent'
          ? await countEvent({
              end_point,
              body,
            })
          : await readEvent({
              end_point,
              body,
            })
    /**
     *  Trả về dữ liệu
     */
    return RESULT.data
  } catch (error) {
    /**
     * Xử lý thông báo
     */
    handleNotify(error)
  } finally {
    console.log('finally')
    /**
     * Reset trạng thái reload
     */
    dispatch(resetReload())
    /** Dừng trạng thái loading khi api hoàn thành */
    if (!prevent_loading) {
      /**
       * Dừng trạng thái loading
       */
      dispatch(stopLoading())
    }
  }
}
/** Hàm dùng chung để gọi API
 * @param end_point: điểm cuối api
 * @param body: dữ liệu gửi đi
 * @param serviceType: loại dịch vụ
 * @return dữ liệu trả về
 */
export async function apiCommon({
  end_point,
  body,
  service_type = 'billing',
}: InputRequestApi) {
  try {
    /**
     * Gọi API
     */
    const URI = `${HOST[service_type]}/${end_point}`

    /** Nếu là dịch vụ ảnh thì chỉ trả về đường dẫn URI */
    if (service_type === 'image') {
      /**
       * Trả về dữ liệu
       */
      return URI
    }
    /**
     * Trả về dữ liệu
     */
    const DATA = await request({
      uri: URI,
      method: 'POST',
      headers: {
        Authorization: store?.getState()?.app?.access_token || getAccessToken(),
      },
      body,
    })
    /**
     * Trả về dữ liệu
     */
    return DATA
  } catch (e) {
    console.error(`Lỗi khi gọi API ${service_type}:`, e)
    /**
     * Ném lỗi
     */
    throw e
  }
}

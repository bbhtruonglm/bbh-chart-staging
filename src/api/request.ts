import { get } from 'lodash'
/** Khai báo interface */
interface IParams {
  /** đường dẫn của api */
  uri: string
  /** phương thức call api */
  method: string
  /** nội dung body */
  body?: any
  /** nội dung headers */
  headers?: any
}
/** Call api với endpoint, method, body */
export async function request({ uri, method, body, headers }: IParams) {
  try {
    /**
     * Gọi API
     */
    const RESPONSE = await fetch(uri, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    /**
     * Trả về dữ liệu
     */
    const DATA = await RESPONSE.json()

    /** data trả về lỗi thì throw data */
    if (DATA?.code !== 200) throw DATA.mean
    /**
     * Trả về dữ liệu
     */
    return DATA
  } catch (e) {
    throw (
      get(e, 'response.data.context_error.message') ||
      get(e, 'response.data.message') ||
      get(e, 'response.data') ||
      get(e, 'message') ||
      e
    )
  }
}

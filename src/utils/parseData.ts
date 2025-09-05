// utils/parseData.ts
export function parseData<T extends Record<string, any>>(
  data: T[],
  jsonField = 'data',
) {
  /** Parse trường JSON trong data */
  return data.map(item => {
    /** Khởi tạo biến parsed */
    let parsed = {}
    try {
      /** Parse trường JSON */
      parsed = JSON.parse(item[jsonField] || '{}')
    } catch {
      parsed = {}
    }
    /** Gán giá trị cho các trường đã parse */
    return {
      ...item,
      parsedClientName: (parsed as any).client_name ?? '',
      parsedMessageType: (parsed as any).message_type ?? '',
      parsedText: (parsed as any).text ?? '',
    }
  })
}

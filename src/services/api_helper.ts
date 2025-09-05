import { millisecondsInDay } from 'date-fns/constants'

/** hàm lấy field perid mỗi khi call api
 * @param distance_time: number
 */
export function getPeriod(distance_time: number): string {
  /** nếu trong ngày */
  if (distance_time < millisecondsInDay) {
    /**
     * trả về giờ
     */
    return 'HOUR'
  }

  /** nếu dưới 1 tháng */
  if (
    distance_time >= millisecondsInDay &&
    distance_time < millisecondsInDay * 31
  ) {
    /**
     * trả về ngày
     */
    return 'DAY'
  }

  /** trên 30 ngày */
  if (
    distance_time >= millisecondsInDay * 31 &&
    distance_time < millisecondsInDay * 365
  ) {
    /**
     * trả về tháng
     */
    return 'MONTH'
  }

  /** trên 1 năm */
  if (distance_time >= millisecondsInDay * 365) {
    /**
     * trả về năm
     */
    return 'YEAR'
  }

  return ''
}

/** hàm lấy định dạng của thời gian trong các bảng
 * @param distance_time: number
 */
export function getFormatDate(distance_time: number): string {
  /**
   * Lấy period từ hàm getPeriod
   */
  const PERIOD = getPeriod(distance_time)
  /**
   * Trả về format theo period
   */
  switch (PERIOD) {
    case 'HOUR':
      return 'HH:mm'
    case 'DAY':
      return 'dd/MM/yyyy'
    case 'MONTH':
      return 'MM/yyyy'
    case 'YEAR':
      return 'yyyy'
    default:
      return 'dd/MM/yyyy'
  }
}

import Loading from '../Loading'
import { selectLoading } from '@/stores/loadingSlice'
import { useSelector } from 'react-redux'

const GlobalLoadingIndicator = () => {
  /**
   * Lấy trạng thái loading từ store
   */
  const LOADING = useSelector(selectLoading)

  return LOADING ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <Loading size="lg" />
    </div>
  ) : null
}

export default GlobalLoadingIndicator

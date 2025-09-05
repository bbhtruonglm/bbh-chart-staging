import 'react-toastify/dist/ReactToastify.css'

import { EmotionalAnalysis } from './components/EmotionalAnalysis/EmotionalAnalysis'
import { EmotionalAnalysisStaff } from './components/EmotionalAnalysisStaff/EmotionalAnalysisStaff'
import Modal from '@/components/Modal/ModalConversation/Modal'
import Overview from './components/Overview/Overview'
import { ToastContainer } from 'react-toastify'
import { useState } from 'react'

function EmotionalScreen() {
  /**
   * State quản lý việc mở modal
   */
  const [is_open_modal, setIsOpenModal] = useState(false)
  /**
   * State quản lý việc hiển thị loại modal
   */
  const [modal_type, setModalType] = useState('')
  /**
   * State quản lý body của modal
   */
  const [body, setBody] = useState({})

  return (
    <div className="flex flex-col flex-grow overflow-y-auto scrollbar-webkit scrollbar-thin">
      <div className="flex flex-col flex-grow gap-y-3">
        <div className="flex xl:h-64">
          <Overview
            handleDetail={() => {
              setIsOpenModal(true)
              setModalType('LINE_TAG')
            }}
            setBody={value => setBody(value)}
          />
        </div>
        <div className="flex lg:h-144">
          <EmotionalAnalysis
            handleDetail={() => {
              setIsOpenModal(true)
              setModalType('EMOTIONAL_ANALYSIS')
            }}
            setBody={value => setBody(value)}
          />
        </div>
        <div className="flex lg:h-96">
          <EmotionalAnalysisStaff
            handleDetail={() => {
              setIsOpenModal(true)
              setModalType('EMOTIONAL_ANALYSIS_STAFF')
            }}
            setBody={value => setBody(value)}
          />
        </div>
        {/* <div className="flex lg:h-172">
          <CommonIssues
            handleDetail={(e) => {
              setIsOpenModal(true)
              setModalType('COMMON_ISSUES')
            }}
            setBody={(value) => setBody(value)}
          />
        </div> */}
        {/* <div className="flex lg:h-155">
          <ActionPlan
            handleDetail={(e) => {
              setIsOpenModal(true)
              if (e === 'type_action') {
                setModalType('TYPE_ACTION_PLAN')
              } else {
                setModalType('ACTION_PLAN')
              }
            }}
            setBody={(value) => setBody(value)}
          />
        </div> */}
      </div>
      <ToastContainer />
      <Modal
        is_open={is_open_modal}
        onClose={() => {
          setIsOpenModal(false)
          setModalType('')
        }}
        modal_type={modal_type}
        body={body}
      />
    </div>
  )
}

export default EmotionalScreen

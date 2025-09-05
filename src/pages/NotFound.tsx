import { t } from 'i18next'

function NotFound() {
  return (
    <div className="flex w-full h-full items-center justify-center py-10 flex-col">
      <img src="https://analytic-chatbox.botbanhang.vn/assets/403-92c74af3.svg" />
      <h3 className="font-medium text-2xl p-10 md:p-0">{t('access_denied')}</h3>
      <p className="text-gray-500 p-10 md:p-0">
        {t('access_denied_description')}
      </p>
    </div>
  )
}

export default NotFound

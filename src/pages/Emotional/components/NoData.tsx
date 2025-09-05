import { TableCellsIcon } from '@heroicons/react/24/solid'
import { t } from 'i18next'
function NoData({ title }) {
  return (
    <div className="flex w-full rounded-lg p-3 gap-x-3 h-full bg-white">
      <div className="flex-shrink-0">
        <TableCellsIcon className="size-5" />
      </div>
      <div className="flex w-full flex-grow min-w-0 flex-col h-full gap-y-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <div className="flex w-full flex-col lg:flex-row flex-grow min-w-0 min-h-0">
          <div className={`flex flex-col w-full lg:w-full`}>
            <div className="flex w-full justify-center items-center h-28">
              {t('no_data')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoData

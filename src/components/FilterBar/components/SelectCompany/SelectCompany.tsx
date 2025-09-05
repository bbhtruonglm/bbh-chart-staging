import { Down } from '@/assets/icons/Down'
import { Logo } from '@/assets/icons/Logo'
import { OrganizationData } from '@/interfaces'
import React from 'react'
import { Subtract } from '@/assets/icons/Subtract'
import { useOrgSelectLogic } from './useOrgSelectLogic'
import { useTranslation } from 'react-i18next'

interface SelectProps {
  /**
   * Danh sách option
   */
  options: OrganizationData[]
}

const Select: React.FC<SelectProps> = ({ options }) => {
  /** i18n */
  const { t } = useTranslation()
  /**
   * Gọi hooks
   */
  const {
    SELECT_REF,
    is_open,
    handleToggle,
    selected_value,
    handleOptionClick,
    handleSearch,
    filtered_options,
    isSelected,
  } = useOrgSelectLogic(options)

  return (
    <div
      ref={SELECT_REF}
      className="relative h-9 cursor-pointer"
    >
      <button
        className="group flex relative h-full items-center justify-between w-full px-3 py-2 border rounded-lg bg-white text-left line-clamp-1"
        onClick={handleToggle}
      >
        {selected_value?.org_id ? (
          <p className="line-clamp-1 text-sm">
            {selected_value?.org_info?.org_name}
          </p>
        ) : (
          <p className="text-slate-700 font-normal text-sm">
            {t('select_company')}
          </p>
        )}
        <Down />
        {selected_value?.org_id && (
          <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 w-full p-2 bg-slate-500 text-white text-center text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-[999999999]">
            {selected_value?.org_info?.org_name}
          </div>
        )}
      </button>

      {is_open && (
        <div>
          <div className="absolute border-8 border-transparent border-b-white bottom-0 translate-y-2 right-[20%] z-10" />
          <div className="absolute w-full md:min-w-64 max-h-72 mt-2 bg-white shadow-lg z-[9999999] rounded-lg overflow-y-auto scrollbar-webkit scrollbar-thin">
            <div className="flex flex-col p-2 gap-y-2 h-full">
              <input
                className="w-full bg-slate-100 p-2 rounded-lg text-sm"
                placeholder={t('search_for_company')}
                onChange={e => handleSearch(e.target.value)}
              />
              <div className="flex flex-col gap-y-2">
                {filtered_options.map(option => (
                  <div
                    key={option?._id}
                    className={`flex items-center justify-between gap-x-2 hover:bg-gray-200 rounded-lg p-2 ${
                      isSelected(option) && 'bg-gray-100'
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div className="flex gap-x-3 items-center">
                      {option?.org_info?.org_avatar ? (
                        <img
                          src={option.org_info.org_avatar}
                          alt="logo"
                          className="w-8 h-8"
                        />
                      ) : (
                        <div className="w-8 h-8">
                          <Logo />
                        </div>
                      )}
                      <p className="text-sm font-medium line-clamp-1">
                        {option?.org_info?.org_name}
                      </p>
                    </div>
                    {isSelected(option) && <Subtract />}
                  </div>
                ))}
              </div>
              {filtered_options.length === 0 && (
                <div className="flex p-2 justify-center items-center text-sm text-slate-500">
                  {t('no_data_found')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Select

'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

export const FILTER_CONFIGS = [
  { key: 'participationDepths', de: 'Beteiligungstiefe', en: 'Participation Depth' },
  { key: 'projectPhases', de: 'Projektphase', en: 'Project Phase' },
  { key: 'goals', de: 'Ziele', en: 'Goals' },
  { key: 'formats', de: 'Format', en: 'Format' },
  { key: 'durations', de: 'Zeitrahmen', en: 'Duration' },
  { key: 'targetGroups', de: 'Zielgruppe', en: 'Target Group' },
  { key: 'groupSizes', de: 'Gruppengröße', en: 'Group Size' },
  { key: 'characteristics', de: 'Merkmale', en: 'Characteristics' },
] as const

export type FilterKey = (typeof FILTER_CONFIGS)[number]['key']
export type FilterState = Record<FilterKey, string>

export const EMPTY_FILTERS: FilterState = {
  characteristics: '',
  durations: '',
  formats: '',
  goals: '',
  groupSizes: '',
  participationDepths: '',
  projectPhases: '',
  targetGroups: '',
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableOptions: Record<FilterKey, string[]>
  allOptions: Record<FilterKey, string[]>
  filterIcons?: Record<string, string | undefined>
}

export default function MethodFilters({ filters, onChange, availableOptions, allOptions, filterIcons }: Props) {
  const t = useTranslations('filter')
  const locale = useLocale()
  const [openKeys, setOpenKeys] = useState<Set<FilterKey>>(new Set())

  const hasAnyActive = Object.values(filters).some(Boolean)

  function toggleAccordion(key: FilterKey) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleOption(key: FilterKey, value: string) {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value })
  }

  return (
    <div className="bg-white border border-[#d8d9ff] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#d8d9ff]">
        <span className="text-sm font-medium text-gray-500">{t('label')}</span>
        {hasAnyActive && (
          <button
            onClick={() => onChange({ ...EMPTY_FILTERS })}
            className="text-xs text-[#a0a2e8] hover:text-[#7879c5] transition-colors"
          >
            {t('reset')}
          </button>
        )}
      </div>

      <div className="divide-y divide-[#d8d9ff]">
        {FILTER_CONFIGS.map(({ key, de, en }) => {
          const label = locale === 'de' ? de : en
          const options = allOptions[key]
          const isEmpty = options.length === 0
          const isOpen = openKeys.has(key)
          const activeValue = filters[key]

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => !isEmpty && toggleAccordion(key)}
                disabled={isEmpty}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isEmpty
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-[#f5f5ff] cursor-pointer'
                }`}
              >
                <span className="flex items-center gap-2">
                  {filterIcons?.[key] && (
                    <img src={filterIcons[key]} alt="" aria-hidden className="w-4 h-4 object-contain" />
                  )}
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  {activeValue && (
                    <span className="w-2 h-2 rounded-full bg-[#a0a2e8] inline-block" />
                  )}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {options.map((opt) => {
                    const isActive = activeValue === opt
                    const isAvailable = availableOptions[key].includes(opt)

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => isAvailable || isActive ? toggleOption(key, opt) : undefined}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          isActive
                            ? 'bg-[#a0a2e8] text-white border-[#a0a2e8]'
                            : isAvailable
                              ? 'bg-white text-gray-700 border-[#d8d9ff] hover:border-[#a0a2e8] hover:text-[#7879c5]'
                              : 'bg-white text-gray-300 border-gray-100 cursor-default'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

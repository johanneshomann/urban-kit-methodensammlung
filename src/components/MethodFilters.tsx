'use client'

import { useTranslations, useLocale } from 'next-intl'

export const FILTER_CONFIGS = [
  { key: 'characteristics', de: 'Merkmale', en: 'Characteristics' },
  { key: 'durations', de: 'Zeitrahmen', en: 'Duration' },
  { key: 'formats', de: 'Format', en: 'Format' },
  { key: 'goals', de: 'Ziele', en: 'Goals' },
  { key: 'groupSizes', de: 'Gruppengröße', en: 'Group Size' },
  { key: 'participationDepths', de: 'Beteiligungstiefe', en: 'Participation Depth' },
  { key: 'projectPhases', de: 'Projektphase', en: 'Project Phase' },
  { key: 'targetGroups', de: 'Zielgruppe', en: 'Target Group' },
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
  // For each filter key: all known options + which are "available" given other active filters
  availableOptions: Record<FilterKey, string[]>
  allOptions: Record<FilterKey, string[]>
}

export default function MethodFilters({ filters, onChange, availableOptions, allOptions }: Props) {
  const t = useTranslations('filter')
  const locale = useLocale()

  const hasAnyActive = Object.values(filters).some(Boolean)

  function set(key: FilterKey, value: string) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white border border-[#d8d9ff] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {FILTER_CONFIGS.map(({ key, de, en }) => {
          const label = locale === 'de' ? de : en
          const options = allOptions[key]
          if (options.length === 0) return null

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">{label}</label>
              <select
                value={filters[key]}
                onChange={(e) => set(key, e.target.value)}
                className="text-sm border border-[#d8d9ff] rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#a0a2e8] w-full"
              >
                <option value="">{t('all')}</option>
                {options.map((opt) => {
                  const isAvailable = availableOptions[key].includes(opt)
                  return (
                    <option
                      key={opt}
                      value={opt}
                      disabled={!isAvailable && filters[key] !== opt}
                      style={!isAvailable && filters[key] !== opt ? { color: '#bbb' } : undefined}
                    >
                      {opt}
                    </option>
                  )
                })}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

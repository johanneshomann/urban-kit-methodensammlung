'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'
import { FILTER_CONFIGS, EMPTY_FILTERS, type FilterKey, type FilterState } from '@/lib/filterConfig'
import type { CategoryItem, FilterItem } from '@/types'
import { getLocalizedName } from '@/lib/localize'
export type { FilterKey, FilterState } from '@/lib/filterConfig'
export { FILTER_CONFIGS, EMPTY_FILTERS }

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableOptions: Record<FilterKey, string[]>
  allOptions: Record<FilterKey, string[]>
  filterIcons?: Record<string, string | undefined>
  allFilterItems?: Record<FilterKey, FilterItem[]>
  allCategoryItems?: Partial<Record<FilterKey, CategoryItem[]>>
  activeFilterKeys?: Set<FilterKey>
}

function getCategoryId(category: CategoryItem | string | null | undefined): string | null {
  if (!category) return null
  if (typeof category === 'string') return category
  return category.id
}

function OptionButton({
  label,
  isActive,
  isAvailable,
  onClick,
}: {
  label: string
  isActive: boolean
  isAvailable: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={isAvailable || isActive ? onClick : undefined}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        isActive
          ? 'bg-[#a0a2e8] text-white border-[#a0a2e8]'
          : isAvailable
            ? 'bg-white text-gray-700 border-[#d8d9ff] hover:border-[#a0a2e8] hover:text-[#7879c5]'
            : 'bg-white text-gray-300 border-gray-100 cursor-default'
      }`}
    >
      {label}
    </button>
  )
}

export default function MethodFilters({ filters, onChange, availableOptions, allOptions, filterIcons, allFilterItems, allCategoryItems, activeFilterKeys }: Props) {
  const locale = useLocale()
  const [openKeys, setOpenKeys] = useState<Set<FilterKey>>(new Set())

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
      <div className="divide-y divide-[#d8d9ff]">
        {FILTER_CONFIGS.filter(({ key }) => !activeFilterKeys || activeFilterKeys.has(key)).map(({ key, de, en }) => {
          const label = locale === 'de' ? de : en
          const options = allOptions[key]
          const isEmpty = options.length === 0
          const isOpen = openKeys.has(key)
          const activeValue = filters[key]
          const items = allFilterItems?.[key] ?? []
          const categories = allCategoryItems?.[key]

          if (isEmpty) return null

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggleAccordion(key)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#f5f5ff] cursor-pointer"
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
                <div className="px-4 pb-4">
                  {categories && categories.length > 0 ? (
                    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
                      {categories.map((cat) => {
                        const catLabel = locale === 'de' ? cat.nameDe : cat.nameEn
                        const catItems = items.filter((item) => getCategoryId(item.category) === cat.id)
                        return (
                          <div key={cat.id} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                              {catLabel}
                            </span>
                            <div className="flex flex-col gap-1">
                              {catItems.map((item) => {
                                const name = getLocalizedName(item, locale)
                                if (!name) return null
                                const isActive = activeValue === name
                                const isAvailable = availableOptions[key].includes(name)
                                return (
                                  <OptionButton
                                    key={item.id}
                                    label={name}
                                    isActive={isActive}
                                    isAvailable={isAvailable}
                                    onClick={() => toggleOption(key, name)}
                                  />
                                )
                              })}
                              {catItems.length === 0 && (
                                <span className="text-xs text-gray-300 italic">—</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const isActive = activeValue === opt
                        const isAvailable = availableOptions[key].includes(opt)
                        return (
                          <OptionButton
                            key={opt}
                            label={opt}
                            isActive={isActive}
                            isAvailable={isAvailable}
                            onClick={() => toggleOption(key, opt)}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

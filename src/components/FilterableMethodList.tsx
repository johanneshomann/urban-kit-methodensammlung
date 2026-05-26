'use client'

import type { CategoryItem, FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import MethodCard from './MethodCard'
import MethodFilters from './MethodFilters'
import { EMPTY_FILTERS, FILTER_CONFIGS, type FilterKey, type FilterState } from '@/lib/filterConfig'

type Props = {
  methods: Methode[]
  filterIcons?: Record<string, string | undefined>
  allFilterItems?: Record<FilterKey, FilterItem[]>
  allCategoryItems?: Partial<Record<FilterKey, CategoryItem[]>>
  activeFilterKeys?: Set<FilterKey>
}

function getItems(method: Methode, key: FilterKey): FilterItem[] {
  const raw = method[key]
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is FilterItem => typeof x === 'object' && x !== null)
}

function getNames(method: Methode, key: FilterKey, locale: string): string[] {
  return getItems(method, key).map((item) => getLocalizedName(item, locale)).filter(Boolean)
}

export default function FilterableMethodList({ methods, filterIcons, allFilterItems, allCategoryItems, activeFilterKeys }: Props) {
  const t = useTranslations('methods')
  const tFilter = useTranslations('filter')
  const locale = useLocale()
  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_FILTERS })

  const activeConfigs = useMemo(
    () => (activeFilterKeys ? FILTER_CONFIGS.filter((c) => activeFilterKeys.has(c.key)) : FILTER_CONFIGS),
    [activeFilterKeys],
  )

  const allOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of activeConfigs) {
      if (allFilterItems?.[key]) {
        result[key] = allFilterItems[key]
          .map((item) => getLocalizedName(item, locale))
          .filter(Boolean)
          .sort()
      } else {
        const names = new Set<string>()
        for (const m of methods) {
          for (const n of getNames(m, key, locale)) names.add(n)
        }
        result[key] = [...names].sort()
      }
    }
    return result
  }, [methods, allFilterItems, locale, activeConfigs])

  const filtered = useMemo(() => {
    return methods.filter((m) => {
      return activeConfigs.every(({ key }) => {
        const selected = filters[key]
        if (!selected) return true
        return getNames(m, key, locale).includes(selected)
      })
    })
  }, [methods, filters, locale, activeConfigs])

  const availableOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of activeConfigs) {
      const otherFilters = activeConfigs.filter((c) => c.key !== key)
      const subset = methods.filter((m) =>
        otherFilters.every(({ key: k }) => {
          const selected = filters[k]
          if (!selected) return true
          return getNames(m, k, locale).includes(selected)
        }),
      )
      const names = new Set<string>()
      for (const m of subset) {
        for (const n of getNames(m, key, locale)) names.add(n)
      }
      result[key] = [...names]
    }
    return result
  }, [methods, filters, locale, activeConfigs])

  const hasAnyActive = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">{tFilter('label')}</span>
          {hasAnyActive && (
            <button
              onClick={() => setFilters({ ...EMPTY_FILTERS })}
              className="text-xs text-[#a0a2e8] hover:text-[#7879c5] transition-colors"
            >
              {tFilter('reset')}
            </button>
          )}
        </div>
        <MethodFilters
          filters={filters}
          onChange={setFilters}
          allOptions={allOptions}
          availableOptions={availableOptions}
          filterIcons={filterIcons}
          allFilterItems={allFilterItems}
          allCategoryItems={allCategoryItems}
          activeFilterKeys={activeFilterKeys}
        />
      </div>

      <p className="text-sm text-gray-500">
        {filtered.length === 1 ? t('foundOne') : t('foundMany', { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">{t('notFound')}</p>
          <p className="text-sm mt-1">{t('adjustFilters')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <MethodCard key={m.id} method={m} />
          ))}
        </div>
      )}
    </div>
  )
}

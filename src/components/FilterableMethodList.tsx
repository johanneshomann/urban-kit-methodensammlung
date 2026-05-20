'use client'

import type { FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import MethodCard from './MethodCard'
import MethodFilters, { EMPTY_FILTERS, FILTER_CONFIGS, type FilterKey, type FilterState } from './MethodFilters'

type Props = {
  methods: Methode[]
}

function getItems(method: Methode, key: FilterKey): FilterItem[] {
  const raw = method[key]
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is FilterItem => typeof x === 'object' && x !== null)
}

function getNames(method: Methode, key: FilterKey, locale: string): string[] {
  return getItems(method, key).map((item) => getLocalizedName(item, locale)).filter(Boolean)
}

export default function FilterableMethodList({ methods }: Props) {
  const t = useTranslations('methods')
  const locale = useLocale()
  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_FILTERS })

  // All options per filter key (from all methods)
  const allOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of FILTER_CONFIGS) {
      const names = new Set<string>()
      for (const m of methods) {
        for (const n of getNames(m, key, locale)) names.add(n)
      }
      result[key] = [...names].sort()
    }
    return result
  }, [methods, locale])

  // Methods matching all active filters (AND logic)
  const filtered = useMemo(() => {
    return methods.filter((m) => {
      return FILTER_CONFIGS.every(({ key }) => {
        const selected = filters[key]
        if (!selected) return true
        return getNames(m, key, locale).includes(selected)
      })
    })
  }, [methods, filters, locale])

  // Available options per key: which options exist in methods that match all OTHER active filters
  const availableOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of FILTER_CONFIGS) {
      const otherFilters = FILTER_CONFIGS.filter((c) => c.key !== key)
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
  }, [methods, filters, locale])

  return (
    <div className="flex flex-col gap-6">
      <MethodFilters
        filters={filters}
        onChange={setFilters}
        allOptions={allOptions}
        availableOptions={availableOptions}
      />

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

'use client'

import type { Methode, Tag } from '@/types'
import { useMemo, useState } from 'react'
import MethodCard from './MethodCard'
import TagFilter from './TagFilter'

type Props = {
  methods: Methode[]
}

export default function FilterableMethodList({ methods }: Props) {
  const [filters, setFilters] = useState({ tag: '' })

  const availableTags = useMemo(() => {
    const names = new Set<string>()
    for (const m of methods) {
      if (Array.isArray(m.tags)) {
        for (const t of m.tags) {
          if (typeof t === 'object' && t !== null) names.add((t as Tag).name)
        }
      }
    }
    return [...names].sort()
  }, [methods])

  const filtered = useMemo(() => {
    return methods.filter((m) => {
      if (filters.tag) {
        const tagNames = (m.tags ?? []).map((t) =>
          typeof t === 'object' ? (t as Tag).name : '',
        )
        if (!tagNames.includes(filters.tag)) return false
      }
      return true
    })
  }, [methods, filters])

  return (
    <div className="flex flex-col gap-6">
      <TagFilter filters={filters} onChange={setFilters} availableTags={availableTags} />

      <p className="text-sm text-gray-500">
        {filtered.length} Methode{filtered.length !== 1 ? 'n' : ''} gefunden
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Keine Methoden gefunden.</p>
          <p className="text-sm mt-1">Filter anpassen oder zurücksetzen.</p>
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

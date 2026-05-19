'use client'

import type { Characteristic, Methode } from '@/types'
import { useMemo, useState } from 'react'
import CharacteristicFilter from './CharacteristicFilter'
import MethodCard from './MethodCard'

type Props = {
  methods: Methode[]
}

export default function FilterableMethodList({ methods }: Props) {
  const [filters, setFilters] = useState({ characteristic: '' })

  const availableCharacteristics = useMemo(() => {
    const names = new Set<string>()
    for (const m of methods) {
      if (Array.isArray(m.characteristics)) {
        for (const c of m.characteristics) {
          if (typeof c === 'object' && c !== null) names.add((c as Characteristic).name)
        }
      }
    }
    return [...names].sort()
  }, [methods])

  const filtered = useMemo(() => {
    return methods.filter((m) => {
      if (filters.characteristic) {
        const names = (m.characteristics ?? []).map((c) =>
          typeof c === 'object' ? (c as Characteristic).name : '',
        )
        if (!names.includes(filters.characteristic)) return false
      }
      return true
    })
  }, [methods, filters])

  return (
    <div className="flex flex-col gap-6">
      <CharacteristicFilter
        filters={filters}
        onChange={setFilters}
        availableCharacteristics={availableCharacteristics}
      />

      <p className="text-sm text-gray-500">
        {filtered.length} method{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No methods found.</p>
          <p className="text-sm mt-1">Adjust filters or reset.</p>
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

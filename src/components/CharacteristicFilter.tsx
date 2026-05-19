'use client'

type FilterState = {
  characteristic: string
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableCharacteristics: string[]
}

export default function CharacteristicFilter({ filters, onChange, availableCharacteristics }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-200 rounded-xl p-4">
      <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>

      {availableCharacteristics.length > 0 && (
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">Characteristic</label>
          <select
            value={filters.characteristic}
            onChange={(e) => onChange({ characteristic: e.target.value })}
            className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {availableCharacteristics.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {filters.characteristic && (
        <button
          onClick={() => onChange({ characteristic: '' })}
          className="text-xs text-red-500 hover:text-red-700 ml-auto"
        >
          Reset
        </button>
      )}
    </div>
  )
}

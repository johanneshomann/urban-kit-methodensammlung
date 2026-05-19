'use client'

type FilterState = {
  tag: string
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableTags: string[]
}

export default function TagFilter({ filters, onChange, availableTags }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-200 rounded-xl p-4">
      <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>

      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">Tag</label>
          <select
            value={filters.tag}
            onChange={(e) => onChange({ tag: e.target.value })}
            className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Alle</option>
            {availableTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {filters.tag && (
        <button
          onClick={() => onChange({ tag: '' })}
          className="text-xs text-red-500 hover:text-red-700 ml-auto"
        >
          Zurücksetzen
        </button>
      )}
    </div>
  )
}

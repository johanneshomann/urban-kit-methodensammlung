'use client'

type FilterState = {
  category: string
  difficulty: string
  tag: string
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableTags: string[]
}

export default function TagFilter({ filters, onChange, availableTags }: Props) {
  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-200 rounded-xl p-4">
      <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>

      <div className="flex items-center gap-1.5">
        <label className="text-xs text-gray-500">Kategorie</label>
        <select
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <label className="text-xs text-gray-500">Schwierigkeit</label>
        <select
          value={filters.difficulty}
          onChange={(e) => update('difficulty', e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">Tag</label>
          <select
            value={filters.tag}
            onChange={(e) => update('tag', e.target.value)}
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

      {(filters.category || filters.difficulty || filters.tag) && (
        <button
          onClick={() => onChange({ category: '', difficulty: '', tag: '' })}
          className="text-xs text-red-500 hover:text-red-700 ml-auto"
        >
          Zurücksetzen
        </button>
      )}
    </div>
  )
}

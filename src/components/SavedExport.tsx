'use client'

import type { SavedItem } from '@/lib/saved'
import { useTranslations } from 'next-intl'

type Props = {
  items: SavedItem[]
}

export default function SavedExport({ items }: Props) {
  const t = useTranslations('saved')

  const handleExport = () => {
    const data = JSON.stringify(items, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'methods-saved.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      disabled={items.length === 0}
      className="text-sm px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {t('export')}
    </button>
  )
}

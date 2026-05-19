'use client'

import type { CartItem } from '@/lib/cart'

type Props = {
  items: CartItem[]
}

export default function CartExport({ items }: Props) {
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
      ↓ Export as JSON
    </button>
  )
}

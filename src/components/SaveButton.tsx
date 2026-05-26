'use client'

import { useSaved } from '@/hooks/useSaved'
import type { SavedItem } from '@/lib/saved'
import { useTranslations } from 'next-intl'

type Props = {
  item: SavedItem
}

export default function SaveButton({ item }: Props) {
  const { add, remove, inSaved, mounted } = useSaved()
  const t = useTranslations('savedButton')
  const isSaved = mounted && inSaved(item.id)

  return (
    <button
      onClick={() => (isSaved ? remove(item.id) : add(item))}
      className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-medium ${
        isSaved
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-600'
      }`}
    >
      {isSaved ? t('saved') : t('save')}
    </button>
  )
}

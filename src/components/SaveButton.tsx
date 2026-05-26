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
      aria-label={isSaved ? t('saved') : t('save')}
      className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-150 ${
        isSaved
          ? 'bg-[#a0a2e8] text-white opacity-100'
          : 'bg-white text-gray-400 hover:text-[#a0a2e8] opacity-0 group-hover:opacity-100'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  )
}

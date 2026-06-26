// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useSaved } from '@/hooks/useSaved'
import type { SavedItem } from '@/lib/saved'
import { useTranslations } from 'next-intl'
import { Bookmark } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  item: SavedItem
  className?: string
  style?: React.CSSProperties
}

export default function SaveButton({ item, className, style: styleProp }: Props) {
  const { add, remove, inSaved, mounted } = useSaved()
  const t = useTranslations('savedButton')
  const isSaved = mounted && inSaved(item.id)

  const btnRef = useRef<HTMLButtonElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  function handleMouseEnter() {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    timerRef.current = setTimeout(() => {
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
    }, 550)
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTooltipPos(null)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => (isSaved ? remove(item.id) : add(item))}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={isSaved ? t('saved') : t('save')}
        className={className ?? `absolute top-3 right-3 z-20 text-display flex items-center justify-center p-2 rounded-xl transition-all duration-150 hover:shadow-md hover:scale-105 active:scale-95 ${isSaved ? 'opacity-100 shadow-md' : 'opacity-100 shadow-md [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:shadow-none [@media(hover:hover)]:group-hover:opacity-100'}`}
        style={styleProp ?? { color: 'var(--method-ink)', background: 'var(--method-white)', cursor: isSaved ? 'pointer' : 'copy' }}
      >
        <Bookmark className="w-[1em] h-[1em]" fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      {tooltipPos && createPortal(
        <span
          className="tooltip-in pointer-events-none text-small whitespace-nowrap px-2.5 py-1 rounded-lg border"
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y - 8,
            transform: 'translate(-50%, -100%)',
            background: 'var(--method-white-transparent)',
            color: 'var(--method-ink)',
            zIndex: 9999,
            backdropFilter: 'blur(6px)',
          }}
        >
          {isSaved ? t('tooltipRemove') : t('tooltipSave')}
        </span>,
        document.body
      )}
    </>
  )
}

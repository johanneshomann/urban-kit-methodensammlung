// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ExpandableContent({
  children,
  maxHeight = 200,
  fadeColor = 'var(--method-white)',
  locale = 'de',
}: {
  children: React.ReactNode
  maxHeight?: number
  fadeColor?: string
  locale?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setOverflowing(el.scrollHeight > maxHeight + 4)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [maxHeight, children])

  return (
    <div className="relative">
      <div
        ref={ref}
        style={{
          position: 'relative',
          maxHeight: expanded ? `${ref.current?.scrollHeight ?? 9999}px` : `${maxHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
        {!expanded && overflowing && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '3rem',
              background: `linear-gradient(to bottom, transparent, ${fadeColor})`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? (locale === 'de' ? 'Weniger anzeigen' : 'Show less') : (locale === 'de' ? 'Mehr anzeigen' : 'Show more')}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
          style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      )}
    </div>
  )
}

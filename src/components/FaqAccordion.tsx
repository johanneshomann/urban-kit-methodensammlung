// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FaqItem = { q: string; a: string }

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId()
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set())
  const [hovered, setHovered] = useState<number | null>(null)

  const toggle = (i: number) =>
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-white)' }}>
      {items.map((item, i) => {
        const isOpen = openIndexes.has(i)
        const isHover = hovered === i
        const panelId = `${baseId}-panel-${i}`
        const buttonId = `${baseId}-button-${i}`
        const accent = isOpen || isHover ? 'var(--method-ink-accent)' : 'var(--method-ink)'

        return (
          <div key={i} style={i > 0 ? { borderTop: '1px solid var(--method-ink)' } : undefined}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="w-full flex items-center gap-4 px-5 md:px-6 py-4 md:py-5 text-left cursor-pointer transition-colors"
              >
                <span className="flex-1 text-display font-semibold transition-colors" style={{ color: accent }}>
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-[1.2em] h-[1.2em] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: accent }}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 md:px-6 pb-5 text-text leading-relaxed" style={{ color: 'var(--method-ink)' }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

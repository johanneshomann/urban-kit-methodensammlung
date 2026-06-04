'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import RichTextRenderer from './RichTextRenderer'

export type AccordionItem = {
  label: string
  content: unknown
  id?: string
  iconName?: string
}

export default function MethodAccordions({ items, locale = 'de' }: { items: AccordionItem[]; locale?: string }) {
  const filtered = items.filter(item => !!item.content)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    function openFromHash() {
      const hash = window.location.hash.slice(1)
      if (!hash) return
      const idx = filtered.findIndex(item => item.id === hash)
      if (idx !== -1) setOpenIndex(idx)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [filtered.map(i => i.id).join(',')])

  if (filtered.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((item, i) => {
        const isOpen = openIndex === i
        const isHovered = hoveredIndex === i

        const bg = isOpen
          ? 'var(--method-white)'
          : isHovered
            ? 'var(--method-white)'
            : 'var(--method-light)'

        const borderColor = isOpen || isHovered ? 'var(--method)' : 'transparent'

        return (
          <div
            key={i}
            className="rounded-xl border overflow-hidden"
            style={{
              background: bg,
              borderColor,
              boxShadow: isHovered && !isOpen ? '0 4px 16px rgba(0,0,0,0.06)' : isOpen ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
              transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {item.id && <div id={item.id} style={{ scrollMarginTop: '5rem' }} />}
            <button
              ref={el => { headerRefs.current[i] = el }}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left cursor-pointer"
            >
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-small font-bold transition-transform duration-200"
                style={{
                  background: 'var(--method)',
                  color: 'var(--method-white)',
                  transform: isHovered && !isOpen ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {(() => {
                  if (!item.iconName) return i + 1
                  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.iconName]
                  return Icon ? <Icon className="w-4 h-4" /> : i + 1
                })()}
              </span>
              <span
                className="text-display font-semibold flex-1 transition-colors duration-200"
                style={{ color: isHovered || isOpen ? 'var(--method-ink-accent)' : 'var(--method-ink)' }}
              >
                {item.label}
              </span>
              <ChevronDown
                className={`w-[1em] h-[1em] shrink-0 text-display transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--method)', opacity: isHovered || isOpen ? 0.7 : 0.3 }}
              />
            </button>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div
                  className="px-6 pb-6 pt-1 text-text"
                  style={{
                    color: 'var(--method-ink)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: isOpen
                      ? 'opacity 0.25s ease 0.1s, transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.05s'
                      : 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <RichTextRenderer content={item.content} />
                  <button
                    type="button"
                    onClick={() => {
                      const el = headerRefs.current[i]
                      const top = el ? el.getBoundingClientRect().top + window.scrollY - 96 : null
                      setOpenIndex(null)
                      if (top !== null) window.scrollTo({ top, behavior: 'smooth' })
                    }}
                    className="mt-6 flex items-center gap-1.5 text-small cursor-pointer transition-opacity hover:opacity-60"
                    style={{ color: 'var(--method-ink-accent)', opacity: 0.5 }}
                  >
                    <ChevronDown className="w-[1em] h-[1em] rotate-180" />
                    {locale === 'de' ? 'Schließen' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

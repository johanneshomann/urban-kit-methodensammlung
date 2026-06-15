'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import RichTextRenderer from './RichTextRenderer'
import type { MethodSection } from '@/types'

export type AccordionItem = {
  label: string
  sections: MethodSection[]
  id?: string
  iconName?: string
}

function SectionList({ sections, locale }: { sections: MethodSection[]; locale: string }) {
  const baseId = useId()
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set())

  const toggle = (i: number) =>
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  // Single untitled section → render flat, no nested accordion needed
  if (sections.length === 1 && !sections[0]?.sectionTitle?.trim()) {
    return (
      <div className="pl-[4.5rem] pr-6">
        <RichTextRenderer content={sections[0]?.content} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sections.map((section, i) => {
        const isOpen = openIndexes.has(i)
        const panelId = `${baseId}-panel-${i}`
        const buttonId = `${baseId}-button-${i}`
        const title = section.sectionTitle?.trim() || `${locale === 'de' ? 'Abschnitt' : 'Section'} ${i + 1}`

        return (
          <div
            key={section.id ?? i}
            className="overflow-hidden transition-colors duration-200"
            style={{
              borderTop: '1px solid var(--method)',
            }}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left cursor-pointer transition-colors"
            >
              <span className="w-8 text-center text-small font-bold tabular-nums shrink-0" style={{ color: 'var(--method)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-text font-semibold flex-1 transition-colors duration-200"
                style={{ color: isOpen ? 'var(--method-ink-accent)' : 'var(--method-ink)' }}
              >
                {title}
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--method)', opacity: isOpen ? 0.7 : 0.4 }}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div className="pl-[4.5rem] pr-6 pb-4 pt-0 text-text" style={{ color: 'var(--method-ink)' }}>
                  <RichTextRenderer content={section.content} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MethodAccordions({ items, locale = 'de' }: { items: AccordionItem[]; locale?: string }) {
  const filtered = items.filter(item => item.sections.length > 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
              boxShadow: isHovered && !isOpen ? '0 4px 16px rgba(0,0,0,0.06)' : isOpen ? '0 2px 8px rgba(0,0,0,0.04)' : '0 1px 3px rgba(0,0,0,0.08)',
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
                  className="text-text"
                  style={{
                    color: 'var(--method-ink)',
                    opacity: isOpen ? 1 : 0,
                    transition: isOpen ? 'opacity 0.25s ease 0.1s' : 'opacity 0.15s ease',
                  }}
                >
                  <SectionList sections={item.sections} locale={locale} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

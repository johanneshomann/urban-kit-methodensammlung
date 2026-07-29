// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useSaved } from '@/hooks/useSaved'
import { useLocale } from 'next-intl'
import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FilterItem, Methode } from '@/types'

function resolveItems(items: (FilterItem | string)[] | null | undefined): FilterItem[] {
  return (items ?? []).map(i => typeof i === 'object' ? i : null).filter(Boolean) as FilterItem[]
}

function getName(item: FilterItem, _locale?: string): string {
  return item.name ?? ''
}

export default function SavedPrintPage() {
  const { saved, mounted } = useSaved()
  const locale = useLocale()
  const [methods, setMethods] = useState<Methode[]>([])

  useEffect(() => {
    if (!mounted || saved.length === 0) { setMethods([]); return }
    const ids = saved.map(s => s.id).join(',')
    fetch(`/api/methods-by-ids?ids=${ids}&locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        const docs = (data?.docs ?? []) as Methode[]
        const ordered = saved.map(s => docs.find(d => String(d.id) === s.id)).filter(Boolean) as Methode[]
        setMethods(ordered)
      })
      .catch(() => setMethods([]))
  }, [mounted, saved.map(s => s.id).join(',')])

  return (
    <>
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: white !important; }
          .method-entry { break-inside: avoid; }
        }
      `}</style>

      {/* Content */}
      <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16" style={{ background: 'var(--method-very-light)' }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="no-print flex justify-end">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-small font-bold transition-all cursor-pointer"
              style={{ background: 'var(--method)', color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--method-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--method)')}
            >
              <Printer className="w-[1em] h-[1em]" />
              {locale === 'de' ? 'Drucken' : 'Print'}
            </button>
          </div>

          {!mounted || methods.length === 0 ? (
            saved.map(s => (
              <div key={s.id} className="rounded-xl animate-pulse h-32" style={{ background: 'var(--method-light)' }} />
            ))
          ) : (
            methods.map((m, i) => {
              const title = m.title
              const auszug = m.auszug
              const phases = resolveItems(m.projectPhases).map(f => getName(f, locale)).filter(Boolean)
              const sizes = resolveItems(m.groupSizes).map(f => getName(f, locale)).filter(Boolean)
              const chars = resolveItems(m.characteristics).map(f => getName(f, locale)).filter(Boolean)

              return (
                <div
                  key={m.id}
                  className="method-entry rounded-2xl overflow-hidden"
                  style={{ background: 'var(--method-white)' }}
                >
                  {/* Header bar */}
                  <div className="flex items-center gap-4 px-8 py-5" style={{ borderBottom: '1px solid var(--method-light)' }}>
                    <span
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-small font-bold"
                      style={{ background: 'var(--method)', color: 'white' }}
                    >
                      {i + 1}
                    </span>
                    <h2 className="text-display font-bold flex-1" style={{ color: 'var(--method-ink-accent)' }}>
                      {title}
                    </h2>
                  </div>

                  {/* Body */}
                  <div className="px-8 py-6 flex flex-col gap-5">
                    {auszug && (
                      <p className="text-text" style={{ color: 'var(--method-ink)' }}>{auszug}</p>
                    )}

                    <div className="flex flex-col gap-3">
                      {phases.length > 0 && (
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-small font-bold shrink-0" style={{ color: 'var(--method-ink-accent)', opacity: 0.5, minWidth: '9rem' }}>
                            {locale === 'de' ? 'Projektphase' : 'Project Phase'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {phases.map(p => (
                              <span key={p} className="text-small px-2.5 py-0.5 rounded-full" style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {sizes.length > 0 && (
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-small font-bold shrink-0" style={{ color: 'var(--method-ink-accent)', opacity: 0.5, minWidth: '9rem' }}>
                            {locale === 'de' ? 'Gruppengröße' : 'Group Size'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {sizes.map(s => (
                              <span key={s} className="text-small px-2.5 py-0.5 rounded-full" style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {chars.length > 0 && (
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-small font-bold shrink-0" style={{ color: 'var(--method-ink-accent)', opacity: 0.5, minWidth: '9rem' }}>
                            {locale === 'de' ? 'Merkmale' : 'Characteristics'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {chars.map(c => (
                              <span key={c} className="text-small px-2.5 py-0.5 rounded-full" style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-small" style={{ color: 'var(--method)', opacity: 0.6 }}>
                      {typeof window !== 'undefined' ? `${window.location.origin}/${locale}/methods/${m.slug}` : `/${locale}/methods/${m.slug}`}
                    </p>
                  </div>
                </div>
              )
            })
          )}

          {mounted && methods.length > 0 && (
            <p className="text-small text-center mt-4" style={{ color: 'var(--method-ink)', opacity: 0.4 }}>
              Urban Kit – Methodensammlung · {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </p>
          )}

        </div>
      </div>
    </>
  )
}

// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Print view for saved methods — designed for the browser's print-to-PDF.
 *
 * Print rules over screen-styling: the layout is BORDER-based, not
 * background-based, because browsers omit backgrounds by default when
 * printing. Text, borders and outlined chips survive any "background
 * graphics" setting. @page sets A4 + margins; the print @media block hides
 * all floating chrome and compacts the fluid type scale to pt sizes by
 * overriding the Tailwind theme variables.
 */
'use client'

import { useSaved } from '@/hooks/useSaved'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import RichTextRenderer from '@/components/RichTextRenderer'
import { FILTER_CONFIGS } from '@/lib/filterConfig'
import type { FilterItem, Methode } from '@/types'

function resolveItems(items: (FilterItem | string)[] | null | undefined): FilterItem[] {
  return (items ?? []).map(i => typeof i === 'object' ? i : null).filter(Boolean) as FilterItem[]
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

  const loading = mounted && saved.length > 0 && methods.length === 0
  const de = locale === 'de'
  const today = new Date().toLocaleDateString(de ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <>
      <style>{`
        @page { size: A4; margin: 16mm; }
        @media print {
          header, footer, .no-print, .saved-widget, .accessibility-fab, .skip-link, .cookie-notice {
            display: none !important;
          }
          html, body { background: #fff !important; }
          .print-root { background: #fff !important; padding: 0 !important; }
          .method-entry { break-inside: avoid; }
          /* Compact the fluid type scale to print-appropriate sizes. */
          :root {
            --text-title: 16pt;
            --text-title--line-height: 1.2;
            --text-display: 12.5pt;
            --text-display--line-height: 1.3;
            --text-text: 10.5pt;
            --text-text--line-height: 1.5;
            --text-small: 8.5pt;
            --text-small--line-height: 1.4;
          }
        }
      `}</style>

      <div className="print-root px-6 md:px-16 lg:px-24 py-12 md:py-16" style={{ background: 'var(--method-very-light)' }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="no-print flex justify-end">
            <button
              onClick={() => window.print()}
              disabled={saved.length === 0 || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-small font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--method-dark)'; e.currentTarget.style.color = 'var(--method-white)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--method)'; e.currentTarget.style.color = 'var(--method-on-brand)' }}
            >
              <Printer className="w-[1em] h-[1em]" />
              {loading ? (de ? 'Lädt …' : 'Loading …') : (de ? 'Drucken' : 'Print')}
            </button>
          </div>

          {/* Document header — also the PDF's title block */}
          <div className="pb-2" style={{ borderBottom: '2px solid var(--method-ink-accent)' }}>
            <h1 className="text-title font-bold leading-tight" style={{ color: 'var(--method-ink-accent)' }}>
              {de ? 'Gemerkte Methoden' : 'Saved Methods'}
            </h1>
            <p className="text-small mt-1" style={{ color: 'var(--method-ink)' }}>
              Urban Kit – Methodensammlung · {mounted ? saved.length : ''} {de ? (saved.length === 1 ? 'Methode' : 'Methoden') : (saved.length === 1 ? 'method' : 'methods')} · {today}
            </p>
          </div>

          {mounted && saved.length === 0 && (
            <p className="text-text" style={{ color: 'var(--method-ink)' }}>
              {de ? 'Keine Methoden gemerkt. ' : 'No methods saved. '}
              <Link href="/" className="underline" style={{ color: 'var(--method-dark)' }}>
                {de ? 'Zur Methodensammlung' : 'To the method collection'}
              </Link>
            </p>
          )}

          {loading &&
            saved.map(s => (
              <div key={s.id} className="no-print rounded-xl animate-pulse h-32" style={{ background: 'var(--method-light)' }} />
            ))}

          {methods.map((m, i) => {
            const steps = [
              [de ? 'Vorbereitung' : 'Preparation', m.vorbereitung?.length ?? 0],
              [de ? 'Durchführung' : 'Execution', m.durchfuehrung?.length ?? 0],
              [de ? 'Auswertung' : 'Evaluation', m.auswertung?.length ?? 0],
            ].filter(([, n]) => (n as number) > 0) as [string, number][]
            const url = typeof window !== 'undefined'
              ? `${window.location.origin}/${locale}/methods/${m.slug}`
              : `/${locale}/methods/${m.slug}`

            return (
              <article
                key={m.id}
                className="method-entry rounded-xl overflow-hidden"
                style={{ background: 'var(--method-white)', border: '1px solid var(--method-ink)' }}
              >
                {/* Header row — outlined badge survives background-less printing */}
                <div className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: '1px solid var(--method-ink)' }}>
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-small font-bold"
                    style={{ border: '2px solid var(--method-dark)', color: 'var(--method-dark)' }}
                  >
                    {i + 1}
                  </span>
                  <h2 className="text-display font-bold flex-1" style={{ color: 'var(--method-ink-accent)' }}>
                    {m.title}
                  </h2>
                </div>

                <div className="px-6 py-5 flex flex-col gap-4">
                  {m.auszug && (
                    <p className="text-text" style={{ color: 'var(--method-ink)' }}>{m.auszug}</p>
                  )}

                  {!!m.zielDerMethode && (
                    <div className="text-text" style={{ color: 'var(--method-ink)' }}>
                      <span className="text-small font-bold uppercase tracking-widest block mb-1" style={{ color: 'var(--method-ink-accent)' }}>
                        {de ? 'Ziel' : 'Goal'}
                      </span>
                      <RichTextRenderer content={m.zielDerMethode} />
                    </div>
                  )}

                  {/* All assigned classifications, outlined chips */}
                  <div className="flex flex-col gap-2">
                    {FILTER_CONFIGS.map(({ key, de: labelDe, en: labelEn }) => {
                      const names = resolveItems(m[key]).map(f => f.name ?? '').filter(Boolean)
                      if (names.length === 0) return null
                      return (
                        <div key={key} className="flex flex-wrap items-baseline gap-2">
                          <span className="text-small font-bold shrink-0" style={{ color: 'var(--method-ink-accent)', minWidth: '9rem' }}>
                            {de ? labelDe : labelEn}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {names.map(n => (
                              <span
                                key={n}
                                className="text-small px-2.5 py-0.5 rounded-full"
                                style={{ border: '1px solid var(--method-accent)', color: 'var(--method-ink)' }}
                              >
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {steps.length > 0 && (
                    <p className="text-small" style={{ color: 'var(--method-ink)' }}>
                      <span className="font-bold" style={{ color: 'var(--method-ink-accent)' }}>{de ? 'Ablauf: ' : 'Process: '}</span>
                      {steps.map(([label, n], idx) => (
                        <span key={label}>
                          {idx > 0 && ' · '}
                          {label} ({n} {de ? (n === 1 ? 'Abschnitt' : 'Abschnitte') : (n === 1 ? 'section' : 'sections')})
                        </span>
                      ))}
                    </p>
                  )}

                  <a href={url} className="text-small underline" style={{ color: 'var(--method-dark)' }}>
                    {url}
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </>
  )
}

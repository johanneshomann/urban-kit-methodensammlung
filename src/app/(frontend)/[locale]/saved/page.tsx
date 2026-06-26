'use client'

import MethodCard from '@/components/MethodCard'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import { useSaved } from '@/hooks/useSaved'
import { Link } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Bookmark, ChevronDown, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FilterItem, Methode } from '@/types'

export default function SavedPage() {
  const { saved, remove, mounted } = useSaved()
  const t = useTranslations('saved')
  const locale = useLocale()
  const [fullMethods, setFullMethods] = useState<Methode[]>([])

  useEffect(() => {
    if (!mounted || saved.length === 0) { setFullMethods([]); return }
    const ids = saved.map(s => s.id).join(',')
    fetch(`/api/methods-by-ids?ids=${ids}&locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        const docs = (data?.docs ?? []) as Methode[]
        // preserve saved order
        const ordered = saved.map(s => docs.find(d => String(d.id) === s.id)).filter(Boolean) as Methode[]
        setFullMethods(ordered)
      })
      .catch(() => setFullMethods([]))
  }, [mounted, saved.map(s => s.id).join(',')])

  if (!mounted) {
    return (
      <div className="min-h-svh flex items-center justify-center px-6 md:px-16 lg:px-24" style={{ background: 'var(--method-light)' }}>
        <LoadingText />
      </div>
    )
  }

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section
        className="relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-28 md:pb-20"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <Bookmark
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[25%] sm:h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        {saved.length > 0 && (
          <a href="#saved-content">
            <ChevronDown
              className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2 z-20 w-14 h-14 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: 'var(--method)' }}
              aria-label={t('scrollHint')}
            />
          </a>
        )}

        <div className="relative z-10 max-w-2xl">
          <EyebrowBadge
            label={saved.length === 1 ? t('countOne') : t('countMany', { count: saved.length })}
            opacity={0.6}
          />
          <h1 className="text-hero font-black leading-none tracking-tight mb-5" style={{ color: 'var(--method-ink-accent)' }}>
            {t('title')}<span style={{ color: 'var(--method)' }}>.</span>
          </h1>

          {saved.length === 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-text leading-relaxed" style={{ color: 'var(--method-ink)' }}>
                {t('empty')}
              </p>
              <Link
                href="/"
                className="text-text font-semibold"
                style={{ color: 'var(--method)' }}
              >
                {t('discover')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {saved.length > 0 && (
        <>
          {/* Cards grid */}
          <section id="saved-content" className="px-6 md:px-16 lg:px-24 py-12 md:py-16" style={{ background: 'var(--method-very-light)' }}>
            <div className="flex items-center justify-between gap-6 mb-10">
              <EyebrowBadge label={t('cardsEyebrow')} opacity={0.6} />
              <div className="flex items-center gap-3">
                <Link
                  href="/saved/print"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-small font-black border transition-all"
                  style={{ color: 'var(--method-ink)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--method-accent)'; e.currentTarget.style.color = 'var(--method-white)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--method-ink)' }}
                >
                  <Printer className="w-[1em] h-[1em]" />
                  {t('printPreview')}
                </Link>
              </div>
            </div>

            {fullMethods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMethods.map(method => (
                  <MethodCard key={method.id} method={method} showAuszug />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map(item => (
                  <div key={item.id} className="rounded-xl animate-pulse h-64" style={{ background: 'var(--method-light)' }} />
                ))}
              </div>
            )}
          </section>

          {/* Comparison table */}
          {fullMethods.length > 1 && (
            <section className="px-6 md:px-16 lg:px-24 py-12 md:py-16" style={{ background: 'var(--method-very-light)' }}>
              <EyebrowBadge label={t('comparison')} opacity={0.6} />
              <h2 className="text-title font-black tracking-tight mb-10" style={{ color: 'var(--method-ink-accent)' }}>
                {t('comparison')}<span style={{ color: 'var(--method)' }}>.</span>
              </h2>
              <div className="overflow-x-auto -mx-6 md:-mx-0 px-6 md:px-0">
                <table className="text-small border-collapse rounded-xl overflow-hidden" style={{ minWidth: '600px', width: '100%', background: 'var(--method-white)' }}>
                  <thead>
                    <tr style={{ background: 'var(--method-light)' }}>
                      <th className="text-left px-5 py-4 border-b font-semibold sticky left-0" style={{ color: 'var(--method-ink-accent)', background: 'var(--method-light)', minWidth: '160px' }}>
                        {locale === 'de' ? 'Methode' : 'Method'}
                      </th>
                      <th className="text-left px-5 py-4 border-b font-semibold" style={{ color: 'var(--method-ink-accent)', minWidth: '160px' }}>
                        {locale === 'de' ? 'Projektphase' : 'Project Phase'}
                      </th>
                      <th className="text-left px-5 py-4 border-b font-semibold" style={{ color: 'var(--method-ink-accent)', minWidth: '140px' }}>
                        {locale === 'de' ? 'Gruppengröße' : 'Group Size'}
                      </th>
                      <th className="text-left px-5 py-4 border-b font-semibold" style={{ color: 'var(--method-ink-accent)', minWidth: '180px' }}>
                        {locale === 'de' ? 'Merkmale' : 'Characteristics'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullMethods.map((m, i) => {
                      const phases = resolveItems(m.projectPhases).map(f => getLocalizedFilterName(f, locale)).filter(Boolean)
                      const sizes = resolveItems(m.groupSizes).map(f => getLocalizedFilterName(f, locale)).filter(Boolean)
                      const chars = resolveItems(m.characteristics).map(f => getLocalizedFilterName(f, locale)).filter(Boolean)
                      return (
                        <tr key={m.id} className={i < fullMethods.length - 1 ? 'border-b' : ''} style={{ borderColor: 'var(--method-light)' }}>
                          <td className="px-5 py-4 font-semibold sticky left-0" style={{ color: 'var(--method-ink-accent)', background: 'var(--method-white)' }}>
                            <Link href={`/methods/${m.slug}`} className="hover:underline">
                              {m.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4" style={{ color: 'var(--method-ink)' }}>
                            <Tags items={phases} />
                          </td>
                          <td className="px-5 py-4" style={{ color: 'var(--method-ink)' }}>
                            <Tags items={sizes} />
                          </td>
                          <td className="px-5 py-4" style={{ color: 'var(--method-ink)' }}>
                            <Tags items={chars} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function resolveItems(items: (FilterItem | string)[] | null | undefined): FilterItem[] {
  return (items ?? []).map(i => typeof i === 'object' ? i : null).filter(Boolean) as FilterItem[]
}

function getLocalizedFilterName(item: FilterItem, _locale?: string): string {
  return item.name ?? ''
}

function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return <span style={{ opacity: 0.3 }}>—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(label => (
        <span key={label} className="px-2 py-0.5 rounded-full text-small" style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}>
          {label}
        </span>
      ))}
    </div>
  )
}

function LoadingText() {
  const t = useTranslations()
  return <span className="text-text" style={{ color: 'var(--method-ink)' }}>{t('loading')}</span>
}

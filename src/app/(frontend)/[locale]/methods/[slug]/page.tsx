import SaveButton from '@/components/SaveButton'
import RichTextRenderer from '@/components/RichTextRenderer'
import MethodAccordions from '@/components/MethodAccordions'
import MethodCard from '@/components/MethodCard'
import type { FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { getMethodImageUrl } from '@/lib/methodImage'
import { FILTER_CONFIGS } from '@/lib/filterConfig'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { Link } from '@/navigation'
import { notFound } from 'next/navigation'
import { ChevronDown, FileText, Flag, ListChecks, Lightbulb, Network } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import MethodStickyTitle from '@/components/MethodStickyTitle'


type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) return { title: 'Not found' }
  return { title: `${method.title} – Urban Kit` }
}

export const dynamic = 'force-dynamic'

function Section({ children, id, background = 'white', icon: Icon }: { children: React.ReactNode; id?: string; background?: string; icon?: LucideIcon }) {
  return (
    <section id={id} className="relative w-full py-16 min-h-[100svh] flex flex-col justify-center overflow-hidden" style={{ background }}>
      {Icon && (
        <Icon
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-[40%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden
          style={{ color: 'var(--method)', opacity: 0.07 }}
        />
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full">
        {children}
      </div>
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-title font-black mb-6" style={{ color: 'var(--method-ink-accent)' }}>
      {children}
    </h2>
  )
}

function hasContent(val: unknown): boolean {
  if (!val || typeof val !== 'object') return false
  const root = (val as { root?: { children?: unknown[] } }).root
  return Array.isArray(root?.children) && root.children.length > 0
}

function resolveMethod(item: Methode | string): Methode | null {
  return typeof item === 'object' ? item : null
}

export default async function MethodDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('methods')

  const result = await payload.find({
    collection: 'methods',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })

  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) notFound()

  const characteristics = (method.characteristics ?? [])
    .map(c => typeof c === 'object' ? c as FilterItem : null)
    .filter(Boolean) as FilterItem[]

  const imageUrl = getMethodImageUrl(method.image, method.id)
  const auszug = locale === 'de' ? method.auszug : (method.auszugEn ?? method.auszug)
  const title = locale === 'de' ? method.title : (method.titleEn ?? method.title)

  const description = locale === 'de' ? method.description : (method.descriptionEn ?? method.description)
  const ziel = locale === 'de' ? method.zielDerMethode : (method.zielDerMethodeEn ?? method.zielDerMethode)
  const wann = locale === 'de' ? method.wannSinnvoll : (method.wannSinnvollEn ?? method.wannSinnvoll)

  const vorbereitung = locale === 'de' ? method.vorbereitung : (method.vorbereitungEn ?? method.vorbereitung)
  const durchfuehrung = locale === 'de' ? method.durchfuehrung : (method.durchfuehrungEn ?? method.durchfuehrung)
  const auswertung = locale === 'de' ? method.auswertung : (method.auswertungEn ?? method.auswertung)

  const tipps = locale === 'de' ? method.tipps : (method.tippsEn ?? method.tipps)
  const ungeeignet = locale === 'de' ? method.ungeeignetFuer : (method.ungeeignetFuerEn ?? method.ungeeignetFuer)

  const aehnliche = (method.aehnlicheMethoden ?? []).map(resolveMethod).filter(Boolean) as Methode[]
  const weitergehen = (method.wieKannEsWeiterGehen ?? []).map(resolveMethod).filter(Boolean) as Methode[]

  const savedItem = {
    id: String(method.id),
    slug: method.slug ?? '',
    title: method.title,
    characteristics: characteristics.map(c => getLocalizedName(c, locale)),
  }

  return (
    <div className="flex flex-col" style={{ background: 'var(--method-light)' }}>

      <MethodStickyTitle title={title ?? method.title} locale={locale} />

      {/* ── Hero ── */}
      <section className="relative h-[calc(100svh-3.5rem)] flex flex-col overflow-hidden" style={{ background: 'var(--method-ink-accent)' }}>
        {/* Background image */}
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(2px)', transform: 'scale(1.03)' }}
        />
        {/* method-light overlay */}
        <div className="absolute inset-0" style={{ background: 'var(--method-light)', opacity: 0.75 }} />
        {/* Fade into page background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-white" />

        {/* Save button */}
        <div className="absolute top-0 right-0 z-30 px-6 md:px-16 lg:px-24 pt-8">
          <SaveButton
            item={savedItem}
            className="text-display flex items-center justify-center p-2 rounded-xl transition-all duration-150 cursor-pointer"
            style={{ color: 'var(--method-ink)', background: 'var(--method-white)', opacity: 0.85 }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 md:px-16 lg:px-24 pt-20 md:pt-28">
          <EyebrowBadge label={locale === 'de' ? 'Methode' : 'Method'} opacity={0.6} />

          <h1 className="text-hero font-black mb-6 max-w-3xl" style={{ color: 'var(--method-ink-accent)' }}>{title}</h1>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {FILTER_CONFIGS.map(({ key }) => {
              const items = (method[key] as (FilterItem | string)[] | null | undefined) ?? []
              const resolved = items.map(i => typeof i === 'object' ? i as FilterItem : null).filter(Boolean) as FilterItem[]
              if (resolved.length === 0) return null
              return resolved.map(item => {
                const name = getLocalizedName(item, locale)
                if (!name) return null
                const uploadUrl = typeof item.icon === 'object' && item.icon ? item.icon.url : null
                const Icon = item.lucideIcon ? (LucideIcons as unknown as Record<string, LucideIcon>)[item.lucideIcon] : null
                return (
                  <span
                    key={`${key}-${item.id}`}
                    className="inline-flex items-center gap-1.5 text-text px-3 py-1 rounded-full"
                    style={{ background: 'var(--method-white)', color: 'var(--method-ink)', opacity: 0.9 }}
                  >
                    {uploadUrl
                      ? <img src={uploadUrl} alt="" aria-hidden className="w-[1em] h-[1em] object-contain shrink-0" />
                      : Icon ? <Icon className="w-[1em] h-[1em] shrink-0" aria-hidden /> : null
                    }
                    {name}
                  </span>
                )
              })
            })}
          </div>

          {/* Scroll hint */}
          <a
            href="#beschreibung"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronDown
              className="w-14 h-14 animate-bounce"
              style={{ color: 'var(--method-ink)' }}
              aria-label="Zur Beschreibung"
            />
          </a>
        </div>
      </section>

      {/* ── Section 0: Beschreibung + Inhalt TOC ── */}
      {(auszug || hasContent(description)) && (() => {
        const tocItems = [
          (hasContent(ziel) || hasContent(wann)) && { label: locale === 'de' ? 'Ziel der Methode' : 'Goal', href: '#ziel' },
          hasContent(vorbereitung) && { label: locale === 'de' ? 'Vorbereitung' : 'Preparation', href: '#vorbereitung' },
          hasContent(durchfuehrung) && { label: locale === 'de' ? 'Durchführung' : 'Execution', href: '#durchfuehrung' },
          hasContent(auswertung) && { label: locale === 'de' ? 'Auswertung' : 'Evaluation', href: '#auswertung' },
          (hasContent(tipps) || hasContent(ungeeignet) || weitergehen.length > 0) && { label: locale === 'de' ? 'Tipps & Weitergehen' : 'Tips & Next Steps', href: '#hinweise' },
          aehnliche.length > 0 && { label: locale === 'de' ? 'Ähnliche Methoden' : 'Similar Methods', href: '#weiteres' },
        ].filter(Boolean) as { label: string; href: string }[]

        return (
          <>
          <Section id="beschreibung" icon={FileText}>
            <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-20">
              {/* Left: Kurz + description */}
              <div>
                <p className="text-text font-black mb-3" style={{ color: 'var(--method-ink-accent)', opacity: 0.4 }}>
                  {locale === 'de' ? 'Kurz:' : 'Summary:'}
                </p>
                {auszug && (
                  <p className="text-text mb-6" style={{ color: 'var(--method-ink)' }}>
                    {auszug}
                  </p>
                )}
                {hasContent(description) && (
                  <div className="text-text" style={{ color: 'var(--method-ink)' }}>
                    <RichTextRenderer content={description} />
                  </div>
                )}
              </div>

              {/* Right: Inhalt TOC */}
              {tocItems.length > 0 && (
                <div className="md:min-w-[14rem] rounded-xl p-6 self-start" style={{ background: 'var(--method-light)' }}>
                  <p className="text-text mb-4" style={{ color: 'var(--method-ink-accent)', opacity: 0.5 }}>
                    {locale === 'de' ? 'Inhalt' : 'Contents'}
                  </p>
                  <ul className="flex flex-col gap-1.5 list-disc list-inside">
                    {tocItems.map(({ label, href }) => (
                      <li key={`${href}-${label}`}>
                        <a
                          href={href}
                          className="text-text underline-offset-2 transition-opacity hover:underline hover:opacity-70"
                          style={{ color: 'var(--method-ink-accent)' }}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
          <div className="w-full h-px" style={{ background: 'var(--method)', opacity: 0.2 }} />
          </>
        )
      })()}

      {/* ── Section 1: Ziel + Wann sinnvoll ── */}
      {(hasContent(ziel) || hasContent(wann)) && (
        <>
          <Section id="ziel" icon={Flag}>
            {hasContent(ziel) && (
              <>
                <SectionTitle>{locale === 'de' ? 'Ziel der Methode' : 'Goal of the Method'}</SectionTitle>
                <div className="text-text max-w-3xl mb-8" style={{ color: 'var(--method-ink)' }}>
                  <RichTextRenderer content={ziel} />
                </div>
              </>
            )}
            {hasContent(wann) && (
              <div className="w-full rounded-xl p-6" style={{ background: 'var(--method-light)' }}>
                <div className="text-small" style={{ color: 'var(--method-ink)' }}>
                  <RichTextRenderer content={wann} />
                </div>
              </div>
            )}
          </Section>
          <div className="w-full h-px" style={{ background: 'var(--method)', opacity: 0.2 }} />
        </>
      )}

      {/* ── Section 3: Ablauf — numbered accordions ── */}
      {(hasContent(vorbereitung) || hasContent(durchfuehrung) || hasContent(auswertung)) && (
        <>
          <Section id="ablauf" icon={ListChecks}>
            <SectionTitle>{locale === 'de' ? 'Ablauf' : 'Process'}</SectionTitle>
            <MethodAccordions
              locale={locale}
              items={[
                { id: 'vorbereitung', iconName: 'ClipboardList', label: locale === 'de' ? 'Vorbereitung' : 'Preparation', content: vorbereitung },
                { id: 'durchfuehrung', iconName: 'Workflow', label: locale === 'de' ? 'Durchführung' : 'Execution', content: durchfuehrung },
                { id: 'auswertung', iconName: 'BarChart2', label: locale === 'de' ? 'Auswertung' : 'Evaluation', content: auswertung },
              ]}
            />
          </Section>
          <div className="w-full h-px" style={{ background: 'var(--method)', opacity: 0.2 }} />
        </>
      )}

      {/* ── Section 4: Hinweise — Tipps, Ungeeignet & Weitergehen ── */}
      {(hasContent(tipps) || hasContent(ungeeignet) || weitergehen.length > 0) && (
        <>
          <section id="hinweise" className="relative w-full py-16 min-h-[100svh] flex flex-col justify-center overflow-hidden" style={{ background: 'var(--method-light)' }}>
            <Lightbulb
              className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-[40%] w-auto pointer-events-none"
              strokeWidth={1}
              aria-hidden
              style={{ color: 'var(--method)', opacity: 0.07 }}
            />
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full flex flex-col gap-6">

              {/* 2-col: Tipps + Ungeeignet */}
              {(hasContent(tipps) || hasContent(ungeeignet)) && (
                <div className="grid md:grid-cols-2 gap-6 items-start">

                  {/* Tipps */}
                  {hasContent(tipps) && (
                    <div className="flex flex-col gap-0 rounded-2xl overflow-hidden" style={{ background: 'var(--method-white)' }}>
                      <div className="flex items-center gap-3 px-8 pt-8 pb-5">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                            <path d="M9 18h6"/><path d="M10 22h4"/>
                          </svg>
                        </span>
                        <h2 className="text-display font-black" style={{ color: 'var(--method-ink-accent)' }}>
                          {locale === 'de' ? 'Tipps' : 'Tips'}
                        </h2>
                      </div>
                      <div className="px-8 pb-8 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-light)', paddingTop: '1.25rem' }}>
                        <RichTextRenderer content={tipps} />
                      </div>
                    </div>
                  )}

                  {/* Ungeeignet für */}
                  {hasContent(ungeeignet) && (
                    <div className="flex flex-col gap-0 rounded-2xl overflow-hidden" style={{ background: 'var(--method-white)' }}>
                      <div className="flex items-center gap-3 px-8 pt-8 pb-5">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
                          </svg>
                        </span>
                        <h2 className="text-display font-black" style={{ color: 'var(--method-ink-accent)' }}>
                          {locale === 'de' ? 'Ungeeignet für' : 'Not suitable for'}
                        </h2>
                      </div>
                      <div className="px-8 pb-8 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-light)', paddingTop: '1.25rem' }}>
                        <RichTextRenderer content={ungeeignet} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Full-width: Weitergehen */}
              {weitergehen.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--method-white)' }}>
                  <div className="flex items-center gap-3 px-8 pt-8 pb-5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </span>
                    <h2 className="text-display font-black" style={{ color: 'var(--method-ink-accent)' }}>
                      {locale === 'de' ? 'Wie kann es weitergehen?' : 'What can follow?'}
                    </h2>
                  </div>
                  <div className="px-8 pb-8 flex flex-wrap gap-3" style={{ borderTop: '1px solid var(--method-light)', paddingTop: '1.25rem' }}>
                    {weitergehen.map(m => (
                      <Link
                        key={m.id}
                        href={`/methods/${m.slug}`}
                        className="px-4 py-2 rounded-xl text-text transition-all hover:shadow-md"
                        style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}
                      >
                        {locale === 'de' ? m.title : (m.titleEn ?? m.title)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>
          <div className="w-full h-px" style={{ background: 'var(--method)', opacity: 0.2 }} />
        </>
      )}

      {/* ── Section 5: Ähnliche Methoden ── */}
      {aehnliche.length > 0 && (
        <Section id="weiteres" background="var(--method-very-light)" icon={Network}>
          <SectionTitle>{locale === 'de' ? 'Ähnliche Methoden' : 'Similar Methods'}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {aehnliche.map(m => (
              <MethodCard key={m.id} method={m} showAuszug />
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}

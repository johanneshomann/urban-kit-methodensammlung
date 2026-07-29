// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Method detail page — one published method, rendered as a full-height scrolling
 * story (hero → overview → goal → process → notes → afterwards → gallery).
 *
 * Server component. Reads the method by `slug` via Payload's local API (which
 * bypasses access control, so we filter `status: published` ourselves) in the
 * requested locale with a `de` fallback. `force-dynamic` keeps content fresh
 * without rebuilds. The visible section list (`navSections`) is derived from
 * which fields actually have content, so empty fields don't produce empty sections.
 */
import RichTextRenderer from '@/components/RichTextRenderer'
import MethodAccordions from '@/components/MethodAccordions'
import GalleryLightbox from '@/components/GalleryLightbox'
import { RegisterCurrentMethod } from '@/components/CurrentMethodProvider'
import type { FilterItem, Methode, MethodSection } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { getMethodImageUrl } from '@/lib/methodImage'
import { FILTER_CONFIGS } from '@/lib/filterConfig'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/navigation'
import { Ban, ChevronDown, Info, Flag, ListChecks, Lightbulb, Check, X, ArrowRight, Images, Layers } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import MethodStickyTitle from '@/components/MethodStickyTitle'
import BackButton from '@/components/BackButton'
import SectionDotsNav from '@/components/SectionDotsNav'
import MethodCardSlider from '@/components/MethodCardSlider'
import ExpandableContent from '@/components/ExpandableContent'


type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as 'de' | 'en',
    fallbackLocale: 'de',
  })
  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) return { title: 'Not found' }
  return { title: `${method.title} – Urban Kit` }
}

export const dynamic = 'force-dynamic'

function Section({ children, id, background = 'var(--method-white)', icon: Icon, align = 'center', minHeight = '100svh', className = '' }: { children: React.ReactNode; id?: string; background?: string; icon?: LucideIcon; align?: 'center' | 'start'; minHeight?: string; className?: string }) {
  return (
    <section id={id} className={`relative w-full py-16 scroll-mt-20 flex flex-col ${align === 'start' ? 'justify-start' : 'justify-center'} overflow-hidden ${className}`} style={{ background, minHeight }}>
      {Icon && (
        <Icon
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[22%] sm:h-[40%] w-auto pointer-events-none"
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
    <h2 className="text-title font-bold mb-6" style={{ color: 'var(--method-ink-accent)' }}>
      {children}
    </h2>
  )
}

// Block-type leaf nodes that count as content even without text (e.g. images, dividers)
const CONTENT_BLOCK_TYPES = ['horizontalrule', 'upload', 'image', 'relationship', 'block', 'table']

function nodeHasContent(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const n = node as { type?: string; text?: string; children?: unknown[] }
  if (typeof n.text === 'string' && n.text.trim() !== '') return true
  if (n.type && CONTENT_BLOCK_TYPES.includes(n.type)) return true
  if (Array.isArray(n.children)) return n.children.some(nodeHasContent)
  return false
}

function hasContent(val: unknown): boolean {
  if (!val || typeof val !== 'object') return false
  const root = (val as { root?: { children?: unknown[] } }).root
  if (!Array.isArray(root?.children) || root.children.length === 0) return false
  return root.children.some(nodeHasContent)
}

// A procedure section counts as "present" if it has either a title or real body
// content — drop fully empty rows so they don't render as blank steps.
function getSections(val: unknown): MethodSection[] {
  if (!Array.isArray(val)) return []
  return (val as MethodSection[]).filter(
    (s) => hasContent(s?.content) || !!s?.sectionTitle?.trim(),
  )
}

// Relationship fields arrive either populated (object, depth>0) or as a bare id
// (string) — keep only the populated ones so we can read their fields directly.
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
    locale: locale as 'de' | 'en',
    fallbackLocale: 'de',
  })

  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) notFound()

  const characteristics = (method.characteristics ?? [])
    .map(c => typeof c === 'object' ? c as FilterItem : null)
    .filter(Boolean) as FilterItem[]

  const imageUrl = getMethodImageUrl(method.image, method.id)
  // Fields are already in the requested locale (query passes `locale`), with DE fallback.
  const auszug = method.auszug
  const title = method.title

  const ziel = method.zielDerMethode
  const wann = method.wannSinnvoll
  const wannNicht = method.wannNichtSinnvoll

  const vorbereitung = getSections(method.vorbereitung)
  const durchfuehrung = getSections(method.durchfuehrung)
  const auswertung = getSections(method.auswertung)

  // Best practices: optional sections + an image gallery rendered as the item's
  // final "Galerie" section. Rows arrive with the media doc populated (depth 2);
  // drop rows whose upload is missing/unpopulated.
  const bestPractices = getSections(method.bestPractices)
  const bpGallery = (method.bestPracticesGallery ?? [])
    .map((row) => {
      const img = row?.image
      if (!img || typeof img !== 'object' || !img.url) return null
      return { url: img.url, alt: img.alt ?? null, caption: row.caption ?? null }
    })
    .filter(Boolean) as { url: string; alt: string | null; caption: string | null }[]

  const tipps = method.tipps
  const ungeeignet = method.ungeeignetFuer

  // "Similar methods" is mutual (kept reciprocal by the collection's afterChange
  // hook), so reading the single relationship field is enough.
  const aehnliche = (method.aehnlicheMethoden ?? []).map(resolveMethod).filter(Boolean) as Methode[]
  const weitergehen = (method.wieKannEsWeiterGehen ?? []).map(resolveMethod).filter(Boolean) as Methode[]
  const gallery = (method.gallery ?? [])
    .map((g) => (typeof g === 'object' && g ? g : null))
    .filter(Boolean) as { url?: string | null; alt?: string | null }[]

  const savedItem = {
    id: String(method.id),
    slug: method.slug ?? '',
    title: method.title,
    characteristics: characteristics.map(c => getLocalizedName(c, locale)),
  }

  // Per-section presence flags drive both the section dots nav and whether each
  // <Section> renders at all — a method with no "Hinweise" simply omits that block.
  const hasZiel = hasContent(ziel) || hasContent(wann) || hasContent(wannNicht)
  const hasAblauf = vorbereitung.length > 0 || bestPractices.length > 0 || bpGallery.length > 0 || durchfuehrung.length > 0 || auswertung.length > 0
  const hasHinweise = hasContent(tipps) || hasContent(ungeeignet)
  const hasWeitergehen = weitergehen.length > 0
  const hasWeiteres = aehnliche.length > 0
  const hasGalerie = gallery.length > 0

  const navSections = [
    { id: 'hero', label: locale === 'de' ? 'Start' : 'Start', icon: 'Home' },
    (auszug || hasZiel || hasAblauf || hasHinweise || hasWeitergehen || hasWeiteres || hasGalerie) && { id: 'beschreibung', label: locale === 'de' ? 'Übersicht' : 'Overview', icon: 'Info' },
    hasZiel && { id: 'ziel', label: locale === 'de' ? 'Ziel' : 'Goal', icon: 'Flag' },
    hasAblauf && { id: 'ablauf', label: locale === 'de' ? 'Ablauf' : 'Process', icon: 'ListChecks' },
    (hasHinweise || hasWeiteres) && { id: 'hinweise', label: locale === 'de' ? 'Hinweise' : 'Notes', icon: 'Lightbulb' },
    hasWeitergehen && { id: 'weitergehen', label: locale === 'de' ? 'Im Anschluss' : 'Afterwards', icon: 'ArrowRight' },
    hasGalerie && { id: 'galerie', label: locale === 'de' ? 'Galerie' : 'Gallery', icon: 'Images' },
  ].filter(Boolean) as { id: string; label: string; icon: string }[]

  return (
    <div className="flex flex-col" style={{ background: 'var(--method-light)' }}>

      <RegisterCurrentMethod item={savedItem} />
      <MethodStickyTitle title={title ?? method.title} locale={locale} />
      <SectionDotsNav items={navSections} label={locale === 'de' ? 'Abschnitte' : 'Sections'} />

      {/* ── Hero ── */}
      <section id="hero" className="relative h-[calc(100svh-3.5rem)] scroll-mt-20 flex flex-col overflow-hidden" style={{ background: 'var(--method-ink-accent)' }}>
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
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 75%, var(--method-white))' }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 md:px-16 lg:px-24 pt-20 md:pt-28">
          <div className="flex items-center gap-2 mb-4">
            <BackButton locale={locale} fallback="/#methods" />
            <EyebrowBadge label={locale === 'de' ? 'Methode' : 'Method'} opacity={0.6} className="!mb-0" />
          </div>

          <h1 className="text-hero font-bold mb-6 max-w-3xl" style={{ color: 'var(--method-ink-accent)' }}>{title}</h1>

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
                    className="inline-flex items-center gap-1.5 text-small px-3 py-1 rounded-full"
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

      {/* ── Section 0: Kurz (lead) ── */}
      {auszug && (
        <Section id="beschreibung" icon={Info} minHeight="70svh">
          <p
            className="text-text leading-relaxed max-w-[60ch] border-l-4 pl-6"
            style={{ color: 'var(--method-ink-accent)', borderColor: 'var(--method)' }}
          >
            {auszug}
          </p>
        </Section>
      )}

      {/* ── Section 1: Ziel + Wann (nicht) sinnvoll ── */}
      {hasZiel && (
        <>
          <Section id="ziel" icon={Flag} align="start">
            {hasContent(ziel) && (
              <>
                <SectionTitle>{locale === 'de' ? 'Ziel' : 'Goal'}</SectionTitle>
                <div className="text-text max-w-3xl mb-8" style={{ color: 'var(--method-ink)' }}>
                  <RichTextRenderer content={ziel} />
                </div>
              </>
            )}
            {(hasContent(wann) || hasContent(wannNicht)) && (
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Wann sinnvoll? */}
                {hasContent(wann) && (
                  <div className="flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-very-light)' }}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                        <Check className="w-4 h-4" strokeWidth={3} aria-hidden />
                      </span>
                      <h2 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                        {locale === 'de' ? 'Wann sinnvoll?' : 'When useful?'}
                      </h2>
                    </div>
                    <div className="px-6 pb-9 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}>
                      <ExpandableContent maxHeight={200} locale={locale} fadeColor="var(--method-very-light)">
                        <RichTextRenderer content={wann} />
                      </ExpandableContent>
                    </div>
                  </div>
                )}

                {/* Wann nicht sinnvoll? */}
                {hasContent(wannNicht) && (
                  <div className="flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-very-light)' }}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                        <X className="w-4 h-4" strokeWidth={3} aria-hidden />
                      </span>
                      <h2 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                        {locale === 'de' ? 'Wann nicht sinnvoll?' : 'When not useful?'}
                      </h2>
                    </div>
                    <div className="px-6 pb-9 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}>
                      <ExpandableContent maxHeight={200} locale={locale} fadeColor="var(--method-very-light)">
                        <RichTextRenderer content={wannNicht} />
                      </ExpandableContent>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>
        </>
      )}

      {/* ── Section 3: Ablauf — numbered accordions ── */}
      {hasAblauf && (
        <Section id="ablauf" icon={ListChecks} align="start" minHeight="100svh" background="var(--method-very-light)" className="!pt-28">
          <SectionTitle>{locale === 'de' ? 'Ablauf' : 'Process'}</SectionTitle>
          <MethodAccordions
            locale={locale}
            items={[
              { id: 'vorbereitung', iconName: 'ClipboardList', label: locale === 'de' ? 'Vorbereitung' : 'Preparation', sections: vorbereitung },
              { id: 'praxisbeispiele', iconName: 'Award', label: locale === 'de' ? 'Praxisbeispiele' : 'Best Practices', sections: bestPractices, gallery: bpGallery },
              { id: 'durchfuehrung', iconName: 'Workflow', label: locale === 'de' ? 'Durchführung' : 'Execution', sections: durchfuehrung },
              { id: 'auswertung', iconName: 'BarChart2', label: locale === 'de' ? 'Auswertung' : 'Evaluation', sections: auswertung },
            ]}
          />
        </Section>
      )}

      {/* ── Section 4: Hinweise — Tipps, Ungeeignet & Ähnliche Methoden ── */}
      {(hasContent(tipps) || hasContent(ungeeignet) || aehnliche.length > 0) && (
        <Section id="hinweise" icon={Lightbulb} background="var(--method-very-light)" align="start">
          <SectionTitle>{locale === 'de' ? 'Hinweise' : 'Notes'}</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Tipps */}
            {hasContent(tipps) && (
              <div className="flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-white)' }}>
                <div className="flex items-center gap-4 px-6 py-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                    <Lightbulb className="w-[18px] h-[18px]" aria-hidden />
                  </span>
                  <h2 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                    {locale === 'de' ? 'Tipps' : 'Tips'}
                  </h2>
                </div>
                <div className="px-6 pb-9 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}>
                  <ExpandableContent maxHeight={200} locale={locale} fadeColor="var(--method-white)">
                    <RichTextRenderer content={tipps} />
                  </ExpandableContent>
                </div>
              </div>
            )}

            {/* Ungeeignet für */}
            {hasContent(ungeeignet) && (
              <div className="flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-white)' }}>
                <div className="flex items-center gap-4 px-6 py-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                    <Ban className="w-[18px] h-[18px]" aria-hidden />
                  </span>
                  <h2 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                    {locale === 'de' ? 'Ungeeignet für' : 'Not suitable for'}
                  </h2>
                </div>
                <div className="px-6 pb-9 text-text" style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}>
                  <ExpandableContent maxHeight={200} locale={locale} fadeColor="var(--method-white)">
                    <RichTextRenderer content={ungeeignet} />
                  </ExpandableContent>
                </div>
              </div>
            )}
          </div>

          {/* Ähnliche Methoden — full-width card across both cards above */}
          {aehnliche.length > 0 && (
            <div className="mt-6 flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm" style={{ background: 'var(--method-white)' }}>
              <div className="flex items-center gap-4 px-6 py-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--method)', color: 'var(--method-white)' }}>
                  <Layers className="w-[18px] h-[18px]" aria-hidden />
                </span>
                <h2 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                  {locale === 'de' ? 'Ähnliche Methoden' : 'Similar Methods'}
                </h2>
              </div>
              <div className="px-6 pb-6" style={{ borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}>
                <div className="flex flex-col gap-1">
                  {aehnliche.map(m => {
                    const mChars = (m.characteristics ?? [])
                      .map(c => (typeof c === 'object' ? c as FilterItem : null))
                      .filter(Boolean) as FilterItem[]
                    const subtitle = mChars.slice(0, 2).map(c => getLocalizedName(c, locale)).filter(Boolean).join(' · ')
                    return (
                      <Link
                        key={m.id}
                        href={`/methods/${m.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 -mx-3 px-3 py-2 rounded-xl transition-colors hover:bg-[var(--method-very-light)]"
                      >
                        <img
                          src={getMethodImageUrl(m.image, m.id)}
                          alt=""
                          aria-hidden
                          className="w-20 h-14 object-cover rounded-lg shrink-0"
                          loading="lazy"
                        />
                        <span className="flex flex-col min-w-0 flex-1">
                          <span className="text-text font-bold truncate transition-colors" style={{ color: 'var(--method-ink-accent)' }}>
                            {m.title}
                          </span>
                          {subtitle && (
                            <span className="text-small truncate" style={{ color: 'var(--method-ink)' }}>{subtitle}</span>
                          )}
                        </span>
                        <ArrowRight
                          className="w-[1em] h-[1em] text-display shrink-0 transition-all opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5"
                          style={{ color: 'var(--method)' }}
                          aria-hidden
                        />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Section: Wie kann es weitergehen? — card slider ── */}
      {weitergehen.length > 0 && (
        <Section id="weitergehen" icon={ArrowRight}>
          <SectionTitle>{locale === 'de' ? 'Im Anschluss' : 'Afterwards'}</SectionTitle>
          <p className="text-text max-w-3xl mb-8" style={{ color: 'var(--method-ink)' }}>
            {locale === 'de'
              ? 'Im Anschluss bieten sich Methoden an, die die gesammelten Inhalte ordnen, vertiefen oder in konkrete Schritte überführen. Je nach Ziel können z.B. folgende Formate anschließen:'
              : 'Afterwards, methods that organise, deepen, or translate the gathered content into concrete steps are useful. Depending on the goal, the following formats can follow, for example:'}
          </p>
          <MethodCardSlider methods={weitergehen} locale={locale} />
        </Section>
      )}

      {/* ── Section 6: Galerie ── */}
      {hasGalerie && (
        <Section id="galerie" icon={Images} align="start">
          <SectionTitle>{locale === 'de' ? 'Galerie' : 'Gallery'}</SectionTitle>
          <GalleryLightbox images={gallery} />
        </Section>
      )}

    </div>
  )
}

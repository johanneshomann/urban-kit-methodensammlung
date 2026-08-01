// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import BackButton from '@/components/BackButton'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import { Signpost, ChevronDown, Home, BookOpen, Bookmark, Accessibility, Mail, LayoutGrid, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

type PageEntry = { icon: string; title: string; text: string }

const ICONS: Record<string, LucideIcon> = { Home, BookOpen, Bookmark, Accessibility, Mail }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'help' })
  return { title: t('metaTitle') }
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'help' })

  const pages = t.raw('pages') as PageEntry[]
  const faq = t.raw('faq') as FaqItem[]

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-28 md:pb-20"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <Signpost
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[25%] sm:h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        <a href="#help-content">
          <ChevronDown
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-14 h-14 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--method)' }}
            aria-label={t('scrollHint')}
          />
        </a>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <BackButton locale={locale} />
            <EyebrowBadge label={t('eyebrow')} className="!mb-0" />
          </div>
          <h1 className="text-hero font-bold leading-none tracking-tight mb-5 hyphens-auto [overflow-wrap:anywhere]" style={{ color: 'var(--method-ink-accent)' }}>
            {t('title')}<span style={{ color: 'var(--method)' }}>.</span>
          </h1>
          <p className="text-text leading-relaxed" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Pages overview */}
      <section
        id="help-content"
        className="relative w-full min-h-[100svh] py-16 scroll-mt-20 flex flex-col justify-center overflow-hidden"
        style={{ background: 'var(--method-very-light)' }}
      >
        <LayoutGrid
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[22%] sm:h-[40%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.07 }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full">
          <h2 className="text-title font-bold mb-6" style={{ color: 'var(--method-ink-accent)' }}>
            {t('pagesTitle')}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {pages.map(({ icon, title, text }, i) => {
              const Icon = ICONS[icon] ?? Home
              return (
                <div
                  key={i}
                  className="flex flex-col gap-0 rounded-xl overflow-hidden shadow-sm"
                  style={{ background: 'var(--method-white)' }}
                >
                  <div className="flex items-center gap-4 px-6 py-4">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                      style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="text-display font-bold" style={{ color: 'var(--method-ink-accent)' }}>
                      {title}
                    </h3>
                  </div>
                  <p
                    className="px-6 pb-6 text-text leading-relaxed"
                    style={{ color: 'var(--method-ink)', borderTop: '1px solid var(--method-ink)', paddingTop: '1.25rem' }}
                  >
                    {text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="help-faq"
        className="relative w-full min-h-[100svh] py-16 scroll-mt-20 flex flex-col justify-center overflow-hidden"
        style={{ background: 'var(--method-very-light)' }}
      >
        <HelpCircle
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[22%] sm:h-[40%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.07 }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full">
          <h2 className="text-title font-bold mb-6" style={{ color: 'var(--method-ink-accent)' }}>
            {t('faqTitle')}
          </h2>

          <FaqAccordion items={faq} />

          {/* Closing / contact */}
          <div
            className="mt-8 md:mt-10 rounded-xl shadow-sm p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: 'var(--method-light)' }}
          >
            <div>
              <h3 className="text-text font-bold mb-1" style={{ color: 'var(--method-ink-accent)' }}>
                {t('footerTitle')}
              </h3>
              <p className="text-small leading-relaxed" style={{ color: 'var(--method-ink)' }}>
                {t('footerText')}
              </p>
            </div>
            <Link
              href="/kontakt"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-cta font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95"
              style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
            >
              <Mail className="w-[1.1em] h-[1.1em] shrink-0" aria-hidden="true" />
              {t('footerCta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

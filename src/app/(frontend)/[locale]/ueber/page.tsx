// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * "Über das Projekt" — admin-editable rich text (PlatformSettings → Über) plus
 * the sponsor grid. Unlike the footer band, the sponsor NAMES are visible here,
 * under each logo. Mirrors the kontakt/legal page anatomy.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import BackButton from '@/components/BackButton'
import RichTextRenderer from '@/components/RichTextRenderer'
import { mapSponsors } from '@/lib/sponsors'
import { SponsorCards } from '@/components/FooterSponsors'
import { HeartHandshake, ChevronDown } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ueber' })
  return { title: t('metaTitle') }
}

export default async function UeberPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ueber' })

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'platform-settings' as any, locale: locale as 'de' | 'en', fallbackLocale: 'de' })

  const content = (settings as any).ueber
  const sponsors = mapSponsors(settings)

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-28 md:pb-20"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <HeartHandshake
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[25%] sm:h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        <a href="#ueber-content">
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
          <p className="text-text leading-relaxed max-w-2xl" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        id="ueber-content"
        className="py-12 md:py-24"
        style={{ background: 'var(--method-very-light)' }}
      >
        {/* Container + text measure mirror the guide page's centered layout. */}
        <div className="max-w-6xl mx-auto px-6 md:px-16 w-full">
          <div className="max-w-2xl">
            {content
              ? (
                <RichTextRenderer
                  content={content as any}
                  paragraphClassName="text-text"
                  headingClassName="text-title font-bold mb-6 mt-12 first:mt-0"
                />
              )
              : <p className="text-text italic" style={{ color: 'var(--method-ink)' }}>{t('placeholder')}</p>
            }
          </div>

          {/* Sponsors — names via tooltip, same as the footer */}
          {sponsors.length > 0 && (
            <div className="mt-16">
              <EyebrowBadge label={t('sponsorsEyebrow')} />
              <h2 className="text-title font-bold tracking-tight mb-10" style={{ color: 'var(--method-ink-accent)' }}>
                {t('sponsorsHeading')}<span style={{ color: 'var(--method)' }}>.</span>
              </h2>
              <SponsorCards sponsors={sponsors} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

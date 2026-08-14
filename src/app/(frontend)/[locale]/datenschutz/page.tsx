// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import RichTextRenderer from '@/components/RichTextRenderer'
import { hasRichTextContent } from '@/lib/richText'
import { ShieldCheck, ChevronDown } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'datenschutz' })
  return { title: t('metaTitle') }
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'datenschutz' })

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'legal' as any, locale: locale as 'de' | 'en', fallbackLocale: 'de' })

  // A saved-but-empty EN document defeats Payload's locale fallback — fall back manually.
  let content = settings.datenschutz
  if (locale !== 'de' && !hasRichTextContent(content)) {
    content = (await payload.findGlobal({ slug: 'legal' as any, locale: 'de' })).datenschutz
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-28 md:pb-20"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <ShieldCheck
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        <a href="#datenschutz-content">
          <ChevronDown
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-14 h-14 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--method)' }}
            aria-label={t('scrollHint')}
          />
        </a>

        <div className="relative z-10 max-w-2xl">
          <EyebrowBadge label={t('eyebrow')} />
          <h1 className="text-hero font-bold leading-none tracking-tight mb-5" style={{ color: 'var(--method-ink-accent)' }}>
            {t('title')}<span style={{ color: 'var(--method)' }}>.</span>
          </h1>
          <p className="text-text leading-relaxed" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        id="datenschutz-content"
        className="flex-1 px-6 md:px-16 lg:px-24 py-12 md:py-24"
        style={{ background: 'var(--method-very-light)' }}
      >
        <div className="max-w-3xl">
          {content
            ? <RichTextRenderer content={content as any} />
            : <p className="text-text italic" style={{ color: 'var(--method-ink)' }}>{t('placeholder')}</p>
          }
        </div>
      </section>
    </div>
  )
}

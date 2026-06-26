// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { getTranslations } from 'next-intl/server'
import { redirect } from '@/navigation'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import BackButton from '@/components/BackButton'
import MethodAssistant from '@/components/MethodAssistant'
import AssistantImmersive from '@/components/AssistantImmersive'
import { loadAssistantSettings } from '@/lib/methodAssistant/settings'
import { Sparkles, ChevronDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assistantPage' })
  return { title: t('metaTitle') }
}

export default async function AssistantPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assistantPage' })
  const settings = await loadAssistantSettings(locale as 'de' | 'en')

  // If the assistant is off / unconfigured, there's nothing to show — go home.
  if (!settings.configured) redirect({ href: '/', locale })

  return (
    <div className="flex flex-col">
      <AssistantImmersive />
      {/* 1. Hero */}
      <section
        className="relative flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-10 md:pb-20"
        style={{ minHeight: 'calc(100dvh - 3.5rem)', background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <Sparkles
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        <a href="#assistant-chat" aria-label={t('scrollHint')}>
          <ChevronDown
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-14 h-14 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--method)' }}
          />
        </a>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BackButton locale={locale} />
            <EyebrowBadge label={t('eyebrow')} opacity={0.6} className="!mb-0" />
          </div>
          <h1
            className="text-hero font-black leading-none tracking-tight mb-4 hyphens-auto [overflow-wrap:anywhere]"
            style={{ color: 'var(--method-ink-accent)' }}
          >
            {t('title')}
          </h1>
          <p className="text-text leading-relaxed max-w-2xl" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. Chat — its own full-height section with internal scrolling */}
      <section
        id="assistant-chat"
        className="scroll-mt-14 px-6 md:px-16 lg:px-24 py-8 md:py-12 flex flex-col"
        style={{ height: 'calc(100dvh - 3.5rem)', background: 'var(--method-very-light)' }}
      >
        <div className="flex-1 min-h-0">
          <MethodAssistant enabled variant="page" greeting={settings.greeting} />
        </div>
      </section>
    </div>
  )
}

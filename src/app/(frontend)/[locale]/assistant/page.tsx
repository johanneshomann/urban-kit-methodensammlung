import { getTranslations } from 'next-intl/server'
import { redirect } from '@/navigation'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import MethodAssistant from '@/components/MethodAssistant'
import { loadAssistantSettings } from '@/lib/methodAssistant/settings'

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
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: 'calc(100svh - 3.5rem)', background: 'var(--method-light)' }}
    >
      {/* Same fade as the landing hero */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />

      <div className="relative z-10 flex flex-col flex-1 min-h-0 px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-8">
        <EyebrowBadge label={t('eyebrow')} opacity={0.6} />
        <h1
          className="text-hero font-black leading-none tracking-tight mb-4"
          style={{ color: 'var(--method-ink-accent)' }}
        >
          {t('title')}
        </h1>
        <p className="text-text leading-relaxed max-w-2xl" style={{ color: 'var(--method-ink)' }}>
          {t('subtitle')}
        </p>

        <div className="flex-1 min-h-0 mt-2">
          <MethodAssistant enabled variant="page" greeting={settings.greeting} />
        </div>
      </div>
    </div>
  )
}

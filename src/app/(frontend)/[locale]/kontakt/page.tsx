import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { EyebrowBadge } from '@/components/EyebrowBadge'
import RichTextRenderer from '@/components/RichTextRenderer'
import { Mail, ChevronDown } from 'lucide-react'
import { KontaktForm } from './KontaktForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'kontakt' })
  return { title: t('metaTitle') }
}

export default async function KontaktPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'kontakt' })

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'platform-settings' as any, locale: locale as 'de' | 'en', fallbackLocale: 'de' })

  const content = settings.kontakt
  const email = settings.kontaktEmail as string | undefined

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-start overflow-hidden px-6 md:px-16 lg:px-24 pt-20 pb-10 md:pt-28 md:pb-20"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <Mail
          className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 h-[25%] sm:h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.1 }}
        />

        <a href="#kontakt-details">
          <ChevronDown
            className="absolute bottom-8 left-6 md:left-1/2 md:-translate-x-1/2 z-20 w-14 h-14 animate-bounce opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--method)' }}
            aria-label={t('scrollHint')}
          />
        </a>

        <div className="relative z-10">
          <EyebrowBadge label={t('eyebrow')} opacity={0.6} />
          <h1 className="text-hero font-black leading-none tracking-tight mb-5 hyphens-auto [overflow-wrap:anywhere]" style={{ color: 'var(--method-ink-accent)' }}>
            {t('titleLine1')}<span style={{ color: 'var(--method)' }}>.</span>
          </h1>
          <p className="text-text leading-relaxed max-w-2xl" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Contact details */}
      <section
        id="kontakt-details"
        className="min-h-svh flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 md:py-24"
        style={{ background: 'var(--method-very-light)' }}
      >
        <EyebrowBadge label={t('sectionEyebrow')} opacity={0.6} />
        <h2 className="text-title font-black tracking-tight mb-10" style={{ color: 'var(--method-ink-accent)' }}>
          {t('sectionTitleLine1')}<br />
          {t('sectionTitleLine2')}<span style={{ color: 'var(--method)' }}>.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left — contact info */}
          <div className="flex flex-col gap-6">
            <div className="bg-method-white rounded-xl border p-7 flex flex-col gap-5 hover:shadow-md transition-all">
              {content && (
                <div className="text-text" style={{ color: 'var(--method-ink)' }}>
                  <RichTextRenderer content={content as any} />
                </div>
              )}
              {email && (
                <div>
                  <p className="text-small uppercase tracking-widest font-black mb-1" style={{ color: 'var(--method-ink)' }}>
                    E-Mail
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="text-text transition-opacity hover:opacity-70"
                    style={{ color: 'var(--method)' }}
                  >
                    {email}
                  </a>
                </div>
              )}
              {!content && !email && (
                <p className="text-text italic" style={{ color: 'var(--method-ink)' }}>
                  {t('placeholder')}
                </p>
              )}
            </div>
          </div>

          {/* Right — form */}
          <KontaktForm disabled={!settings.mailEnabled} />
        </div>
      </section>
    </div>
  )
}

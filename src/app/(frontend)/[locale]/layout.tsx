// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Link } from '@/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavMenu from '@/components/NavMenu'
import SiteFooter from '@/components/SiteFooter'
import FooterSponsors, { type FooterSponsor } from '@/components/FooterSponsors'
import { loadAssistantSettings } from '@/lib/methodAssistant/settings'
import SavedWidget from '@/components/SavedWidget'
import CookieNotice from '@/components/CookieNotice'
import { CurrentMethodProvider } from '@/components/CurrentMethodProvider'
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider'
import { AccessibilityButton } from '@/components/accessibility/AccessibilityButton'
import localFont from 'next/font/local'
import { getPayload } from 'payload'
import config from '@payload-config'
import { colorsToCssVars, resolveColors } from '@/lib/theme'
import { getPlatformIdentity } from '@/lib/platformIdentity'
import '../globals.css'

const atkinson = localFont({
  src: [
    {
      path: '../fonts/AtkinsonHyperlegible-Regular-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/AtkinsonHyperlegible-Bold-latin.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-atkinson',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const { favicon, ogImage } = await getPlatformIdentity()
  const base = process.env.NEXT_PUBLIC_SERVER_URL
  const title = t('title')
  const description = t('description')
  return {
    ...(base ? { metadataBase: new URL(base) } : {}),
    title,
    description,
    icons: { icon: favicon, apple: favicon },
    openGraph: { title, description, type: 'website', images: [ogImage] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'de')) {
    notFound()
  }

  const messages = await getMessages()
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'platform-settings' as any })
  const cssVars = colorsToCssVars(resolveColors(settings))
  const assistant = await loadAssistantSettings(locale as 'de' | 'en')

  // Sponsor logos for the footer band — rides the settings fetch above.
  // Rows with an unpopulated/missing logo are dropped defensively.
  const sponsors: FooterSponsor[] = ((settings as any).sponsors ?? [])
    .map((row: any) => {
      const logo = row?.logo
      if (!logo || typeof logo !== 'object' || !logo.url || !row?.name) return null
      return {
        name: row.name as string,
        url: typeof row.url === 'string' && row.url.trim() !== '' ? row.url.trim() : null,
        logoUrl: (logo.sizes?.card?.url as string | undefined) ?? (logo.url as string),
        alt: (logo.alt as string | undefined) || (row.name as string),
      }
    })
    .filter(Boolean)

  return (
    <html lang={locale} className={atkinson.variable}>
      <head>
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <a href="#main-content" className="skip-link">{tNav('skipLink')}</a>
        <NextIntlClientProvider messages={messages}>
          <AccessibilityProvider>
          <CurrentMethodProvider>
          <header id="site-header" className="relative h-14 border-b bg-method-white grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 sticky top-0 z-50 transition-shadow shadow-md">
            <div>
              <NavMenu assistantEnabled={assistant.configured} />
            </div>

            <Link href="/" className="method-brand font-bold text-text transition-opacity duration-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="hidden sm:inline">
                  <span className="font-normal" style={{ color: 'var(--method-ink-accent)' }}>Urban</span>
                  <span style={{ color: 'var(--method-dark)' }}>KIT</span>
                </span>
                <span className="font-normal" style={{ color: 'var(--method-ink)' }}>
                  <span className="hidden sm:inline"> – </span>{tNav('subtitle')}
                </span>
              </span>
            </Link>

            <div className="flex justify-end items-center gap-4">
              <LanguageSwitcher />
            </div>

            {/* Method pages portal their sticky title here, crossfading with the brand.
                Centered over the whole header with room between the side controls. */}
            <div
              id="method-title-portal"
              className="pointer-events-none absolute left-1/2 top-0 h-full -translate-x-1/2 flex items-center justify-center px-4 w-[70%] md:w-[60%]"
            />
          </header>

          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>

          <SiteFooter>
            <FooterText sponsors={sponsors} />
          </SiteFooter>
          <SavedWidget />
          </CurrentMethodProvider>
          <AccessibilityButton />
          <CookieNotice />
          </AccessibilityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

async function FooterText({ sponsors }: { sponsors: FooterSponsor[] }) {
  const t = await getTranslations('footer')
  return (
    <>
      <FooterSponsors heading={t('sponsors')} sponsors={sponsors} />
      <div className="max-w-6xl mx-auto px-4 py-6 text-small text-ink flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <span>{t('text')}</span>
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link href="/impressum" className="hover:text-method-dark transition-colors">
          {t('impressum')}
        </Link>
        <Link href="/datenschutz" className="hover:text-method-dark transition-colors">
          {t('datenschutz')}
        </Link>
        <Link href="/barrierefreiheit" className="hover:text-method-dark transition-colors">
          {t('barrierefreiheit')}
        </Link>
        <Link href="/cookies" className="hover:text-method-dark transition-colors">
          {t('cookies')}
        </Link>
        <a href="/admin" className="hover:text-method-dark transition-colors">
          {t('login')}
        </a>
      </nav>
    </div>
    </>
  )
}

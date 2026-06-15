import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Link } from '@/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavMenu from '@/components/NavMenu'
import SavedWidget from '@/components/SavedWidget'
import localFont from 'next/font/local'
import { COLOR_DEFAULTS, colorsToCssVars } from '@/lib/theme'
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
  return {
    title: t('title'),
    description: t('description'),
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

  const cssVars = colorsToCssVars(COLOR_DEFAULTS)

  return (
    <html lang={locale} className={atkinson.variable}>
      <head>
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <header className="relative h-14 border-b bg-white grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 sticky top-0 z-50 transition-shadow shadow-md">
            <div>
              <NavMenu />
            </div>

            <Link href="/" className="method-brand font-bold text-text transition-opacity duration-300">
              <span className="inline-flex items-center gap-1.5">
                <span>
                  <span className="font-normal" style={{ color: 'var(--method-ink-accent)' }}>Urban</span>
                  <span style={{ color: 'var(--method)' }}>KIT</span>
                </span>
                <span className="font-normal" style={{ color: 'var(--method-ink)' }}> – {tNav('subtitle')}</span>
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

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t mt-auto">
            <FooterText />
          </footer>
          <SavedWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

async function FooterText() {
  const t = await getTranslations('footer')
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-small text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span>{t('text')}</span>
      <nav className="flex gap-4">
        <Link href="/impressum" className="hover:text-[#a0a2e8] transition-colors">
          {t('impressum')}
        </Link>
        <Link href="/datenschutz" className="hover:text-[#a0a2e8] transition-colors">
          {t('datenschutz')}
        </Link>
        <a href="/admin" className="hover:text-[#a0a2e8] transition-colors">
          {t('login')}
        </a>
      </nav>
    </div>
  )
}

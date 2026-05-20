import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Link } from '@/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import CartWidget from '@/components/CartWidget'
import localFont from 'next/font/local'
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

  return (
    <html lang={locale} className={atkinson.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <header className="bg-white border-b border-[#d8d9ff] sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="transition-colors block leading-none">
                <span className="font-bold text-black">Urban</span><span className="font-bold text-[#a0a2e8]">KIT</span>
                <br />
                <span className="font-normal text-gray-400 text-sm uppercase tracking-[0.1em]">Methodensammlung</span>
              </Link>
              <nav className="flex items-center gap-4">
                <NavLinks />
                <LanguageSwitcher />
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-[#d8d9ff] mt-auto">
            <FooterText />
          </footer>
          <CartWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

async function NavLinks() {
  const t = await getTranslations('nav')
  return (
    <Link href="/" className="text-sm text-gray-500 hover:text-[#a0a2e8] transition-colors">
      {t('allMethods')}
    </Link>
  )
}

async function FooterText() {
  const t = await getTranslations('footer')
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
      {t('text')}
    </div>
  )
}

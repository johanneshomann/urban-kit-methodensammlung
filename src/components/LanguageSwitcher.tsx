'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'de' : 'en' })
  }

  return (
    <button
      onClick={toggle}
      className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'DE' : 'EN'}
    </button>
  )
}

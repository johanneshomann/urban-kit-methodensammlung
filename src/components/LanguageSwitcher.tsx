// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

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
      className="flex items-center gap-1.5 text-text cursor-pointer transition-colors text-ink hover:text-method-dark"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'DE' : 'EN'}
    </button>
  )
}

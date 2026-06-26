// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useRouter } from '@/navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * History-aware back control. Returns the visitor to wherever they came from
 * (preserving the landing list's filters & scroll, the Saved page, etc.) via
 * the browser history. When the page was opened directly — a shared link or a
 * fresh tab, where there is no in-app history — it falls back to `fallback` so
 * the arrow never dead-ends.
 */
export default function BackButton({
  locale = 'de',
  fallback = '/',
}: {
  locale?: string
  fallback?: string
}) {
  const router = useRouter()
  const label = locale === 'de' ? 'Zurück' : 'Back'

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center px-2 py-1 rounded-md text-small leading-none shrink-0 transition-opacity hover:opacity-100 cursor-pointer"
      style={{ color: 'var(--method-white)', background: 'var(--method-ink)', opacity: 0.6 }}
    >
      <ArrowLeft className="w-[1em] h-[1em]" aria-hidden />
    </button>
  )
}

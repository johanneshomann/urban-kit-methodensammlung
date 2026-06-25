'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Cookie, X } from 'lucide-react'

/**
 * Informational cookie/storage notice — not a consent gate (the site uses only
 * strictly-necessary, functional storage, so no consent is required).
 *
 * Shows once per browser session and is synchronised across tabs: a
 * BroadcastChannel lets open tabs coordinate so only one shows it, and a
 * dismissal in any tab hides it everywhere. `sessionStorage` carries the
 * "already seen" state within a tab and resets when the browser session ends.
 */
const SS_KEY = 'uk-cookie-notice-ack'
const CHANNEL = 'uk-cookie-notice'

export default function CookieNotice() {
  const t = useTranslations('cookieNotice')
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)
  const ackedRef = useRef(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SS_KEY) === '1') return
    } catch {
      /* storage blocked — fall through and just show it */
    }

    const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null

    const ack = () => {
      ackedRef.current = true
      try { sessionStorage.setItem(SS_KEY, '1') } catch { /* ignore */ }
    }
    const suppress = () => {
      visibleRef.current = false
      setVisible(false)
      ack()
    }
    const present = () => {
      if (ackedRef.current) return
      visibleRef.current = true
      setVisible(true)
      bc?.postMessage({ type: 'present' })
    }

    if (bc) {
      bc.onmessage = (e: MessageEvent) => {
        const type = (e.data || {}).type
        if (type === 'present' || type === 'dismiss') suppress()
        // A newcomer is asking — if we already own or acknowledged it, tell them to stand down.
        else if (type === 'hello' && (visibleRef.current || ackedRef.current)) bc.postMessage({ type: 'present' })
      }
      bc.postMessage({ type: 'hello' })
    }

    // Give peers a moment to claim the notice first; jitter avoids two fresh tabs racing.
    const delay = 150 + Math.floor(Math.random() * 150)
    const timer = window.setTimeout(() => {
      if (!ackedRef.current && !visibleRef.current) present()
    }, delay)

    return () => {
      window.clearTimeout(timer)
      bc?.close()
    }
  }, [])

  const dismiss = () => {
    visibleRef.current = false
    ackedRef.current = true
    setVisible(false)
    try { sessionStorage.setItem(SS_KEY, '1') } catch { /* ignore */ }
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(CHANNEL)
      bc.postMessage({ type: 'dismiss' })
      bc.close()
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        onClick={e => e.stopPropagation()}
        className="notice-in relative w-full max-w-xl rounded-2xl p-6"
        style={{
          background: 'var(--method-white)',
          color: 'var(--method-ink)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)',
        }}
      >
        <button
          onClick={dismiss}
          aria-label={t('close')}
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md p-1 transition-opacity opacity-50 hover:opacity-100"
          style={{ color: 'var(--method-ink)' }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 shrink-0 mt-0.5" style={{ color: 'var(--method)' }} aria-hidden />
          <div className="pr-4">
            <p className="text-text font-bold mb-1" style={{ color: 'var(--method-ink-accent)' }}>{t('title')}</p>
            <p className="text-small leading-relaxed">{t('text')}</p>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={dismiss}
                className="text-small font-bold px-4 py-2 rounded-xl transition-colors"
                style={{ background: 'var(--method)', color: 'var(--method-white)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--method-dark)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--method)')}
              >
                {t('dismiss')}
              </button>
              <Link
                href="/cookies"
                onClick={dismiss}
                className="text-small underline transition-colors hover:opacity-70"
                style={{ color: 'var(--method)' }}
              >
                {t('more')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

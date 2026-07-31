// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Send } from 'lucide-react'

const inputClass =
  'rounded-lg border px-3 py-2 text-text outline-none focus:ring-2 transition-all'
const labelClass =
  'text-small uppercase tracking-widest font-bold'

export function KontaktForm({ disabled = false }: { disabled?: boolean }) {
  const t = useTranslations('kontakt.form')
  const baseId = useId()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

    const data = new FormData(e.currentTarget)
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          betreff: data.get('betreff'),
          nachricht: data.get('nachricht'),
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body?.error === 'disabled' ? t('errorDisabled') : t('errorGeneric'))
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setErrorMsg(t('errorGeneric'))
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-method-white rounded-xl border p-7 flex flex-col gap-3 hover:shadow-md transition-all">
        <p className="text-display font-bold tracking-tight" style={{ color: 'var(--method)' }}>
          {t('successTitle')}<span style={{ color: 'var(--method)' }}>.</span>
        </p>
        <p className="text-text" style={{ color: 'var(--method-ink)' }}>
          {t('successText')}
        </p>
      </div>
    )
  }

  const isSending = status === 'sending'

  return (
    <form onSubmit={handleSubmit} className="bg-method-white rounded-xl border p-7 flex flex-col gap-4 hover:shadow-md transition-all">
      <fieldset disabled={disabled || isSending} className="contents">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${baseId}-name`} className={labelClass} style={{ color: 'var(--method-ink)' }}>
              {t('name')}
            </label>
            <input
              id={`${baseId}-name`}
              type="text"
              name="name"
              autoComplete="name"
              placeholder={t('namePlaceholder')}
              required
              className={inputClass}
              style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${baseId}-email`} className={labelClass} style={{ color: 'var(--method-ink)' }}>
              {t('email')}
            </label>
            <input
              id={`${baseId}-email`}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              required
              className={inputClass}
              style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${baseId}-betreff`} className={labelClass} style={{ color: 'var(--method-ink)' }}>
            {t('subject')}
          </label>
          <input
            id={`${baseId}-betreff`}
            type="text"
            name="betreff"
            placeholder={t('subjectPlaceholder')}
            required
            className={inputClass}
            style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${baseId}-nachricht`} className={labelClass} style={{ color: 'var(--method-ink)' }}>
            {t('message')}
          </label>
          <textarea
            id={`${baseId}-nachricht`}
            rows={5}
            name="nachricht"
            placeholder={t('messagePlaceholder')}
            required
            className={`${inputClass} resize-none`}
            style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
          />
        </div>

        {status === 'error' && (
          <p className="text-small" style={{ color: 'var(--method-dark)' }} role="alert">
            {errorMsg}
          </p>
        )}

        <div className="flex">
          <button
            type="submit"
            disabled={disabled || isSending}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-cta font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--method)', color: 'var(--method-ink-accent)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--method-dark)'; e.currentTarget.style.color = 'var(--method-white)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--method)'; e.currentTarget.style.color = 'var(--method-ink-accent)' }}
          >
            <Send className="w-[1em] h-[1em] shrink-0" />
            {isSending ? t('sending') : t('submit')}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

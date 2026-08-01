// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSaved } from '@/hooks/useSaved'
import { useCurrentMethod } from '@/components/CurrentMethodProvider'
import { Link } from '@/navigation'
import { Bookmark, X } from 'lucide-react'

export default function SavedWidget() {
  const { saved, add, remove, inSaved, mounted } = useSaved()
  const { current } = useCurrentMethod()
  const t = useTranslations('savedWidget')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const count = mounted ? saved.length : 0
  const onMethodPage = mounted && current != null
  const currentSaved = onMethodPage && current ? inSaved(current.id) : false

  return (
    <div ref={containerRef} className="saved-widget fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Popup panel — inert while closed so its (invisible) links/buttons
          leave the tab order and the accessibility tree. */}
      <div
        inert={!open}
        className={`w-80 max-w-[calc(100vw-3rem)] bg-method-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <span className="font-bold text-small" style={{ color: 'var(--method-ink-accent)' }}>{t('title')}</span>
          <span className="text-small" style={{ color: 'var(--method-ink)' }}>
            {count === 1 ? t('countOne') : t('countMany', { count })}
          </span>
        </div>

        {/* Method list */}
        <div className="overflow-y-auto max-h-72">
          {count === 0 ? (
            <p className="text-small text-center py-8" style={{ color: 'var(--method-ink)' }}>{t('empty')}</p>
          ) : (
            <ul className="divide-y">
              {saved.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-[var(--method-very-light)]">
                  <Link
                    href={`/methods/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-small line-clamp-1 flex-1 transition-colors"
                    style={{ color: 'var(--method-ink)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--method-dark)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--method-ink)')}
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex-shrink-0 transition-opacity opacity-40 hover:opacity-100"
                    style={{ color: 'var(--method-ink)' }}
                    aria-label={t('remove')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer CTA — only when there's an action to offer */}
        {(onMethodPage || count > 0) && (
          <div className="p-3 border-t flex flex-col gap-2">
            {/* Save the currently viewed method — only if it isn't already in the list */}
            {onMethodPage && current && !currentSaved && (
              <button
                onClick={() => add(current)}
                className="flex items-center justify-center gap-1.5 w-full text-center text-small font-bold py-2.5 rounded-xl transition-colors"
                style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--method-dark)'; e.currentTarget.style.color = 'var(--method-white)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--method)'; e.currentTarget.style.color = 'var(--method-on-brand)' }}
              >
                <Bookmark className="w-4 h-4" />{t('saveThis')}
              </button>
            )}

            {/* View all — whenever something is saved */}
            {count > 0 && (
              <Link
                href="/saved"
                onClick={() => setOpen(false)}
                className="block w-full text-center text-small font-bold py-2.5 rounded-xl transition-colors"
                style={
                  onMethodPage
                    ? { background: 'transparent', color: 'var(--method-dark)' }
                    : { background: 'var(--method)', color: 'var(--method-on-brand)' }
                }
                onMouseEnter={e => { e.currentTarget.style.background = onMethodPage ? 'var(--method-very-light)' : 'var(--method-dark)'; if (!onMethodPage) e.currentTarget.style.color = 'var(--method-white)' }}
                onMouseLeave={e => { e.currentTarget.style.background = onMethodPage ? 'transparent' : 'var(--method)'; if (!onMethodPage) e.currentTarget.style.color = 'var(--method-on-brand)' }}
              >
                {t('viewAll')}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* FAB button */}
      <button
        ref={fabRef}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center relative pointer-events-auto cursor-pointer"
        style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--method-dark)'; e.currentTarget.style.color = 'var(--method-white)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--method)'; e.currentTarget.style.color = 'var(--method-on-brand)' }}
        aria-label={t('title')}
      >
        <Bookmark className="w-5 h-5" fill={open ? 'currentColor' : 'none'} />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow border"
            style={{ background: 'var(--method-white)', color: 'var(--method-dark)' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
    </div>
  )
}

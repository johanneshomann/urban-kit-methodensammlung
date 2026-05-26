'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSaved } from '@/hooks/useSaved'
import { Link } from '@/navigation'

export default function SavedWidget() {
  const { saved, remove, mounted } = useSaved()
  const t = useTranslations('savedWidget')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const count = mounted ? saved.length : 0

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Popup panel */}
      <div
        className={`w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm">{t('title')}</span>
          <span className="text-xs text-gray-400">
            {count === 1 ? t('countOne') : t('countMany', { count })}
          </span>
        </div>

        {/* Method list */}
        <div className="overflow-y-auto max-h-72">
          {count === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('empty')}</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {saved.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <Link
                    href={`/methods/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-800 hover:text-[#a0a2e8] transition-colors line-clamp-1 flex-1"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label={t('remove')}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/saved"
            onClick={() => setOpen(false)}
            className="block w-full text-center text-sm font-medium bg-[#a0a2e8] hover:bg-[#8082d0] text-white py-2.5 rounded-xl transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-[#a0a2e8] hover:bg-[#8082d0] text-white shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center relative pointer-events-auto"
        aria-label={t('title')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#a0a2e8] text-xs font-bold flex items-center justify-center shadow border border-[#d8d9ff]">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
    </div>
  )
}

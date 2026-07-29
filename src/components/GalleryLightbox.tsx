// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = { url?: string | null; alt?: string | null; caption?: string | null }

/**
 * Image gallery with a fullscreen lightbox (keyboard nav, scroll lock).
 * Two thumbnail layouts: `grid` (the detail page's gallery section) and
 * `strip` — a horizontally scrollable row used inside accordion panels.
 * The lightbox caption prefers `caption` (localized, per-use) over `alt`.
 */
export default function GalleryLightbox({ images, variant = 'grid' }: { images: GalleryImage[]; variant?: 'grid' | 'strip' }) {
  const items = images.filter((img) => img.url) as { url: string; alt?: string | null; caption?: string | null }[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Strip variant: scroll-arrow state (mirrors MethodCardSlider)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (variant !== 'strip') return
    const el = trackRef.current
    if (!el) return
    const update = () => {
      setCanPrev(el.scrollLeft > 4)
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [variant, items.length])

  const scrollTrack = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, close, prev, next])

  if (items.length === 0) return null

  return (
    <>
      <div className="relative">
        <div
          ref={trackRef}
          className={
            variant === 'strip'
              ? 'no-scrollbar flex gap-4 overflow-x-auto snap-x -mx-1 px-1 py-2'
              : 'grid grid-cols-2 md:grid-cols-3 gap-4'
          }
        >
          {items.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={img.caption || img.alt || `Bild ${i + 1}`}
              className={`group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-zoom-in ${
                variant === 'strip' ? 'snap-start shrink-0' : ''
              }`}
            >
              <img
                src={img.url}
                alt={img.alt ?? img.caption ?? ''}
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  variant === 'strip' ? 'h-44 w-64 sm:h-48 sm:w-72' : 'w-full h-56'
                }`}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {variant === 'strip' && (canPrev || canNext) && (
          <>
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              disabled={!canPrev}
              aria-label="Zurück"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
              style={{ background: 'var(--method-white)', color: 'var(--method-ink-accent)' }}
            >
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              disabled={!canNext}
              aria-label="Weiter"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
              style={{ background: 'var(--method-white)', color: 'var(--method-ink-accent)' }}
            >
              <ChevronRight className="w-5 h-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      {mounted && openIndex !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            onClick={close}
            className="lightbox-fade fixed inset-0 z-[9999] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Schließen"
              className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: 'var(--method-white-transparent)', color: 'var(--method-ink-accent)', backdropFilter: 'blur(6px)' }}
            >
              <X className="w-5 h-5" />
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  aria-label="Vorheriges Bild"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: 'var(--method-white-transparent)', color: 'var(--method-ink-accent)', backdropFilter: 'blur(6px)' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next() }}
                  aria-label="Nächstes Bild"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: 'var(--method-white-transparent)', color: 'var(--method-ink-accent)', backdropFilter: 'blur(6px)' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <figure key={openIndex} className="lightbox-zoom flex flex-col items-center gap-3 max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <img
                src={items[openIndex].url}
                alt={items[openIndex].alt ?? ''}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg"
              />
              {(items[openIndex].caption || items[openIndex].alt) && (
                <figcaption className="text-small text-center px-4" style={{ color: 'var(--method-white)' }}>
                  {items[openIndex].caption || items[openIndex].alt}
                </figcaption>
              )}
            </figure>
          </div>,
          document.body,
        )}
    </>
  )
}

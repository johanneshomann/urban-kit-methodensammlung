'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = { url?: string | null; alt?: string | null }

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const items = images.filter((img) => img.url) as { url: string; alt?: string | null }[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={img.alt || `Bild ${i + 1}`}
            className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
          >
            <img
              src={img.url}
              alt={img.alt ?? ''}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
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
              {items[openIndex].alt && (
                <figcaption className="text-small text-center px-4" style={{ color: 'var(--method-white)' }}>
                  {items[openIndex].alt}
                </figcaption>
              )}
            </figure>
          </div>,
          document.body,
        )}
    </>
  )
}

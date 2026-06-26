// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MethodCard from './MethodCard'
import type { Methode } from '@/types'

export default function MethodCardSlider({ methods, locale = 'de' }: { methods: Methode[]; locale?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  function update() {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    update()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [methods.length])

  function scroll(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const showNav = canPrev || canNext

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-2"
      >
        {methods.map((m) => (
          <div key={m.id} className="snap-start shrink-0 basis-full md:basis-[calc(50%-0.75rem)]">
            <MethodCard method={m} showAuszug background="var(--method-very-light)" />
          </div>
        ))}
      </div>

      {showNav && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            aria-label={locale === 'de' ? 'Zurück' : 'Previous'}
            className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full shadow-md transition-opacity disabled:opacity-0 disabled:pointer-events-none cursor-pointer hover:scale-105"
            style={{ background: 'var(--method-white)', color: 'var(--method-ink-accent)' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canNext}
            aria-label={locale === 'de' ? 'Weiter' : 'Next'}
            className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full shadow-md transition-opacity disabled:opacity-0 disabled:pointer-events-none cursor-pointer hover:scale-105"
            style={{ background: 'var(--method-white)', color: 'var(--method-ink-accent)' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

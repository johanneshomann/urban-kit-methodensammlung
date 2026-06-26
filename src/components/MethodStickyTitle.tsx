// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function MethodStickyTitle({ title, locale = 'de' }: { title: string; locale?: string }) {
  const [visible, setVisible] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPortalTarget(document.getElementById('method-title-portal'))
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = !entry.isIntersecting
        setVisible(isVisible)
        document.body.classList.toggle('method-sticky-active', isVisible)
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.classList.remove('method-sticky-active')
    }
  }, [])

  return (
    <>
      {/* Sentinel at the bottom of the hero — when it leaves the viewport, the title fades in */}
      <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-px pointer-events-none" />

      {portalTarget &&
        createPortal(
          <span
            className="max-w-full px-4 truncate text-text transition-all duration-300"
            style={{
              color: 'var(--method-ink-accent)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-4px)',
            }}
            aria-hidden={!visible}
          >
            <span style={{ opacity: 0.5 }}>{locale === 'de' ? 'Methode: ' : 'Method: '}</span>
            {title}
          </span>,
          portalTarget,
        )}
    </>
  )
}

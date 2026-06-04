'use client'

import { useEffect, useRef, useState } from 'react'

export default function MethodStickyTitle({ title, locale = 'de' }: { title: string; locale?: string }) {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = !entry.isIntersecting
        setVisible(isVisible)
        document.body.classList.toggle('method-sticky-active', isVisible)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.body.classList.remove('method-sticky-active')
    }
  }, [])

  return (
    <>
      {/* Sentinel placed at bottom of hero — when it leaves viewport, bar fades in */}
      <div ref={sentinelRef} className="absolute bottom-0 left-0 w-full h-px pointer-events-none" />

      <div
        className="fixed left-0 right-0 z-40 h-14 border-b bg-white grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 transition-all duration-300"
        style={{
          top: '3.5rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div />
        <span className="text-text truncate" style={{ color: 'var(--method-ink-accent)' }}>
          <span style={{ opacity: 0.5 }}>{locale === 'de' ? 'Methode:' : 'Method:'} </span>
          {title}
        </span>
        <div />
      </div>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

export type DotItem = { id: string; label: string }

export default function SectionDotsNav({ items, label = 'Abschnitte' }: { items: DotItem[]; label?: string }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [revealId, setRevealId] = useState<string | null>(null)
  const prevActive = useRef<string | null>(null)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        // Keep a running record of every section's latest visibility, then
        // pick whichever is most in view — not just the ones in this batch.
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        }
        let bestId: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (!bestId) return
        setActiveId(bestId)
        if (prevActive.current !== bestId) {
          prevActive.current = bestId
          setRevealId(bestId)
          if (revealTimer.current) clearTimeout(revealTimer.current)
          revealTimer.current = setTimeout(() => setRevealId(null), 1500)
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => {
      observer.disconnect()
      if (revealTimer.current) clearTimeout(revealTimer.current)
    }
  }, [items])

  if (items.length < 2) return null

  return (
    <nav
      aria-label={label}
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1 items-end"
    >
      {items.map((item) => {
        const isActive = activeId === item.id
        const showLabel = hoveredId === item.id || revealId === item.id

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            aria-current={isActive ? 'true' : undefined}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative flex items-center justify-center p-2 group"
          >
            {/* Reveal label */}
            <span
              className="absolute right-full mr-1 top-1/2 -translate-y-1/2 text-small whitespace-nowrap px-2.5 py-1 rounded-lg pointer-events-none"
              style={{
                background: 'var(--method-white-transparent)',
                color: 'var(--method-ink)',
                backdropFilter: 'blur(6px)',
                opacity: showLabel ? 1 : 0,
                transform: showLabel ? 'translateX(0)' : 'translateX(6px)',
                transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {item.label}
            </span>

            {/* Dot */}
            <span
              aria-hidden
              className="block rounded-full"
              style={{
                background: 'var(--method)',
                width: isActive ? 11 : 7,
                height: isActive ? 11 : 7,
                opacity: isActive ? 1 : 0.3,
                transform: !isActive && hoveredId === item.id ? 'scale(1.3)' : 'scale(1)',
                transition: 'width 0.25s, height 0.25s, opacity 0.25s, transform 0.2s',
              }}
            />
          </a>
        )
      })}
    </nav>
  )
}

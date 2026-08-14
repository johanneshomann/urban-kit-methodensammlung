// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

/**
 * The "Gefördert durch" logo band at the top of the footer, fed from the
 * Sponsoren tab in PlatformSettings. Sponsor names are deliberately not shown
 * next to the logos — they appear via the house tooltip (delayed, portaled,
 * also on keyboard focus) and as the accessible name of the logo/link.
 */

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from '@/navigation'
import type { Sponsor } from '@/lib/sponsors'

// Footer band logo: no tooltip here (deliberately — the Über page cards have
// one); the sponsor name is still the accessible name of the link/image.
function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const img = (
    <img
      src={sponsor.logoUrl}
      alt={sponsor.alt}
      className={`w-auto object-contain ${sponsor.size === 'gross' ? 'h-40 max-w-[48rem]' : 'h-24 max-w-[28rem]'}`}
      loading="lazy"
    />
  )

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={sponsor.name}
        className="shrink-0 transition-opacity hover:opacity-70"
      >
        {img}
      </a>
    )
  }
  return (
    <span role="img" aria-label={sponsor.name} className="shrink-0">
      {img}
    </span>
  )
}

export default function FooterSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  const pathname = usePathname()
  // The Über page renders its own sponsor grid right above the footer —
  // showing the band there too would double the logos.
  if (pathname === '/ueber' || sponsors.length === 0) return null
  return (
    <div className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center sm:justify-start">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 list-none">
          {sponsors.map((s, i) => (
            <li key={`${s.name}-${i}`} className="flex items-center">
              <SponsorLogo sponsor={s} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * Sponsor grid for the Über page: white cards, the logo fills a uniform box
 * (the per-row size select only affects the footer band). Names are
 * tooltip-only here too, and carry the accessible name.
 */
function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const ref = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  function show() {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    timerRef.current = setTimeout(() => {
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
    }, 550)
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setTooltipPos(null)
  }

  const img = (
    <img src={sponsor.logoUrl} alt={sponsor.alt} className="w-full h-full object-contain" loading="lazy" />
  )
  const cardClass = 'flex items-center justify-center rounded-xl p-6 h-32 w-full shadow-sm transition-shadow'
  const interactionProps = { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide }

  return (
    <>
      {sponsor.url ? (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          aria-label={sponsor.name}
          className={`${cardClass} hover:shadow-md`}
          style={{ background: 'var(--method-white)' }}
          {...interactionProps}
        >
          {img}
        </a>
      ) : (
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          role="img"
          aria-label={sponsor.name}
          tabIndex={0}
          className={cardClass}
          style={{ background: 'var(--method-white)' }}
          {...interactionProps}
        >
          {img}
        </div>
      )}
      {tooltipPos && createPortal(
        <span
          aria-hidden
          className="tooltip-in pointer-events-none text-small whitespace-nowrap px-2.5 py-1 rounded-lg border"
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y - 8,
            transform: 'translate(-50%, -100%)',
            background: 'var(--method-white-transparent)',
            color: 'var(--method-ink)',
            zIndex: 9999,
            backdropFilter: 'blur(6px)',
          }}
        >
          {sponsor.name}
        </span>,
        document.body,
      )}
    </>
  )
}

export function SponsorCards({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 list-none max-w-5xl">
      {sponsors.map((s, i) => (
        <li key={`${s.name}-${i}`}>
          <SponsorCard sponsor={s} />
        </li>
      ))}
    </ul>
  )
}

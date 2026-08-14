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
import type { Sponsor } from '@/lib/sponsors'

// NOTE: the delayed portal tooltip mirrors SaveButton/ClearDot (a shared
// tooltip is a known cleanup — see the OSS review notes).
function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
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
    <img
      src={sponsor.logoUrl}
      alt={sponsor.alt}
      className={`w-auto object-contain ${sponsor.size === 'gross' ? 'h-24 max-w-[30rem]' : 'h-12 max-w-56'}`}
      loading="lazy"
    />
  )

  const interactionProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  }

  return (
    <>
      {sponsor.url ? (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          aria-label={sponsor.name}
          className="shrink-0 transition-opacity hover:opacity-70"
          {...interactionProps}
        >
          {img}
        </a>
      ) : (
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          role="img"
          aria-label={sponsor.name}
          tabIndex={0}
          className="shrink-0"
          {...interactionProps}
        >
          {img}
        </span>
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

export default function FooterSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null
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

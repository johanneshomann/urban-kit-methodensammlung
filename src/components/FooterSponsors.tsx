// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

/**
 * Sponsor logo strip, fed from the Sponsoren tab in PlatformSettings. Used in
 * two places: the "Gefördert durch" band at the top of the footer and the
 * sponsor section of the Über page — same markup, so the admin's pixel
 * settings (height + per-side padding) compose identically on both surfaces.
 * Sponsor names are deliberately not shown next to the logos — they are the
 * accessible name of the logo/link.
 */

import { usePathname } from '@/navigation'
import type { Sponsor } from '@/lib/sponsors'

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const img = (
    <img
      src={sponsor.logoUrl}
      alt={sponsor.alt}
      className="w-auto max-w-full object-contain"
      style={{ height: `${sponsor.height}px` }}
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

/**
 * The bare logo strip. Each row carries its own per-side pixel padding (admin
 * fields Oben/Rechts/Unten/Links) — full box control per logo.
 */
export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null
  return (
    <ul className="flex flex-wrap items-center justify-center list-none">
      {sponsors.map((s, i) => (
        <li
          key={`${s.name}-${i}`}
          className="flex items-center"
          style={{ padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px` }}
        >
          <SponsorLogo sponsor={s} />
        </li>
      ))}
    </ul>
  )
}

export default function FooterSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  const pathname = usePathname()
  // The Über page renders the same strip right above the footer — showing the
  // band there too would double the logos.
  if (pathname === '/ueber' || sponsors.length === 0) return null
  return (
    <div className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
        <SponsorStrip sponsors={sponsors} />
      </div>
    </div>
  )
}

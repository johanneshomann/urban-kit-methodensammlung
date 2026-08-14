// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Maps the PlatformSettings `sponsors` array rows to render-ready props.
 * Shared by the footer band (layout) and the Über page grid so both surfaces
 * stay in sync. Rows with a missing/unpopulated logo or empty name are
 * dropped defensively.
 */

export type Sponsor = {
  name: string
  url: string | null
  logoUrl: string
  alt: string
  /** Logo height (px) in the footer band; width follows the aspect ratio. */
  height: number
  /** Per-side padding (px) around the logo in the footer band. */
  padding: { top: number; right: number; bottom: number; left: number }
}

const px = (v: unknown, fallback: number): number =>
  typeof v === 'number' && v >= 0 ? v : fallback

export function mapSponsors(settings: unknown): Sponsor[] {
  const rows = (settings as { sponsors?: unknown[] } | null)?.sponsors ?? []
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      const r = row as { logo?: unknown; name?: unknown; url?: unknown; height?: unknown; padTop?: unknown; padRight?: unknown; padBottom?: unknown; padLeft?: unknown }
      const logo = r?.logo as { url?: string | null; alt?: string | null; sizes?: { card?: { url?: string | null } } } | null
      if (!logo || typeof logo !== 'object' || !logo.url || typeof r?.name !== 'string' || r.name.trim() === '') return null
      return {
        name: r.name,
        url: typeof r.url === 'string' && r.url.trim() !== '' ? r.url.trim() : null,
        logoUrl: logo.sizes?.card?.url ?? logo.url,
        alt: logo.alt || r.name,
        height: px(r.height, 110),
        padding: {
          top: px(r.padTop, 0),
          right: px(r.padRight, 0),
          bottom: px(r.padBottom, 0),
          left: px(r.padLeft, 0),
        },
      }
    })
    .filter(Boolean) as Sponsor[]
}

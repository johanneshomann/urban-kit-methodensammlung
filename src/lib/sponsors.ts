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
  size: 'standard' | 'gross'
  display: 'both' | 'footer' | 'ueber'
}

/** Rows for the footer band. */
export function footerSponsors(all: Sponsor[]): Sponsor[] {
  return all.filter((s) => s.display !== 'ueber')
}

/** Rows for the Über page grid. */
export function aboutSponsors(all: Sponsor[]): Sponsor[] {
  return all.filter((s) => s.display !== 'footer')
}

export function mapSponsors(settings: unknown): Sponsor[] {
  const rows = (settings as { sponsors?: unknown[] } | null)?.sponsors ?? []
  if (!Array.isArray(rows)) return []
  return rows
    .map((row) => {
      const r = row as { logo?: unknown; name?: unknown; url?: unknown; size?: unknown; display?: unknown }
      const logo = r?.logo as { url?: string | null; alt?: string | null; sizes?: { card?: { url?: string | null } } } | null
      if (!logo || typeof logo !== 'object' || !logo.url || typeof r?.name !== 'string' || r.name.trim() === '') return null
      return {
        name: r.name,
        url: typeof r.url === 'string' && r.url.trim() !== '' ? r.url.trim() : null,
        logoUrl: logo.sizes?.card?.url ?? logo.url,
        alt: logo.alt || r.name,
        size: r.size === 'gross' ? 'gross' as const : 'standard' as const,
        display: r.display === 'footer' ? 'footer' as const : r.display === 'ueber' ? 'ueber' as const : 'both' as const,
      }
    })
    .filter(Boolean) as Sponsor[]
}

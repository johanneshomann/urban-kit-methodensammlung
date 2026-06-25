import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Platform identity assets (admin logo, favicon, sharing image). Each is an
 * optional upload in Platform Settings → Branding; when empty we fall back to
 * the built-in defaults under public/platform-defaults.
 */
export const IDENTITY_DEFAULTS = {
  adminLogo: '/platform-defaults/admin-logo.svg',
  favicon: '/platform-defaults/favicon.svg',
  ogImage: '/platform-defaults/og-default.svg',
} as const

const urlOf = (v: unknown): string | null =>
  v && typeof v === 'object' && typeof (v as { url?: unknown }).url === 'string'
    ? (v as { url: string }).url
    : null

export type PlatformIdentity = { adminLogo: string; favicon: string; ogImage: string }

export async function getPlatformIdentity(): Promise<PlatformIdentity> {
  try {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'platform-settings' as any, depth: 1, overrideAccess: true })
    return {
      adminLogo: urlOf((s as { adminLogo?: unknown }).adminLogo) ?? IDENTITY_DEFAULTS.adminLogo,
      favicon: urlOf((s as { favicon?: unknown }).favicon) ?? IDENTITY_DEFAULTS.favicon,
      ogImage: urlOf((s as { ogImage?: unknown }).ogImage) ?? IDENTITY_DEFAULTS.ogImage,
    }
  } catch {
    return { ...IDENTITY_DEFAULTS }
  }
}

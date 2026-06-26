/**
 * Reads a taxonomy item's display name. Trivial today because Payload already
 * resolves localized fields to the query locale (with DE fallback) server-side —
 * the `_locale` arg is kept as a seam so callers don't change if that ever moves
 * client-side. Centralising it also gives one place to handle missing names.
 */
type LocalizedItem = {
  // `name` is a Payload localized field — already resolved to the query locale (DE fallback).
  name?: string | null
}

export function getLocalizedName(item: LocalizedItem | null | undefined, _locale?: string): string {
  if (!item) return ''
  return item.name || ''
}

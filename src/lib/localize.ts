type LocalizedItem = {
  // `name` is a Payload localized field — already resolved to the query locale (DE fallback).
  name?: string | null
}

export function getLocalizedName(item: LocalizedItem | null | undefined, _locale?: string): string {
  if (!item) return ''
  return item.name || ''
}

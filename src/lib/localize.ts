type LocalizedItem = { nameDe?: string | null; nameEn?: string | null }

export function getLocalizedName(item: LocalizedItem | null | undefined, locale: string): string {
  if (!item) return ''
  if (locale === 'de') return item.nameDe || item.nameEn || ''
  return item.nameEn || item.nameDe || ''
}

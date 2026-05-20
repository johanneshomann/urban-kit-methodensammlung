type LocalizedItem = {
  nameDe?: string | null
  nameEn?: string | null
  labelDe?: string | null
  labelEn?: string | null
}

export function getLocalizedName(item: LocalizedItem | null | undefined, locale: string): string {
  if (!item) return ''
  const primary = locale === 'de' ? (item.nameDe || item.labelDe) : (item.nameEn || item.labelEn)
  return primary || item.nameDe || item.labelDe || item.nameEn || item.labelEn || ''
}

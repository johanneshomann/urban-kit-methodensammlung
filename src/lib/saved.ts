const SAVED_KEY = 'uk-saved'

export type SavedItem = {
  id: string
  slug: string
  title: string
  characteristics?: string[]
}

export function getSaved(): SavedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? (JSON.parse(raw) as SavedItem[]) : []
  } catch {
    return []
  }
}

export function writeSaved(items: SavedItem[]): void {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('uk-saved-change'))
}

export function addToSaved(item: SavedItem): void {
  const saved = getSaved()
  if (!saved.find((i) => i.id === item.id)) {
    writeSaved([...saved, item])
  }
}

export function removeFromSaved(id: string): void {
  writeSaved(getSaved().filter((i) => i.id !== id))
}

export function isInSaved(id: string): boolean {
  return getSaved().some((i) => i.id === id)
}

export function clearSaved(): void {
  localStorage.removeItem(SAVED_KEY)
  window.dispatchEvent(new Event('uk-saved-change'))
}

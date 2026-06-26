/**
 * "Saved methods" persistence — a bookmark list kept entirely in the browser
 * (localStorage, no account needed). Every mutation dispatches a `uk-saved-change`
 * event so open components (badge counts, the saved page) re-read in sync; see the
 * `useSaved` hook which subscribes to it.
 */

const SAVED_KEY = 'uk-saved'

export type SavedItem = {
  id: string
  slug: string
  title: string
  characteristics?: string[]
}

export function getSaved(): SavedItem[] {
  if (typeof window === 'undefined') return [] // SSR: no localStorage
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    // NOTE: the cast trusts the stored shape — a stale/old format isn't validated.
    // Acceptable for a throwaway bookmark list; a type guard would harden it.
    return raw ? (JSON.parse(raw) as SavedItem[]) : []
  } catch {
    return []
  }
}

export function writeSaved(items: SavedItem[]): void {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items))
  // Notify same-tab listeners (the native `storage` event only fires cross-tab).
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

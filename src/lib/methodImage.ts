// Number of fallback cover images in /public/method-defaults (1.jpg … 7.jpg).
const POOL_SIZE = 7

/**
 * Resolves a method's cover image URL: the uploaded image if present, otherwise a
 * deterministic pick from the default pool so a given method always shows the same
 * placeholder (stable across renders, no per-request randomness).
 */
export function getMethodImageUrl(
  image: { url?: string | null } | string | null | undefined,
  id: string | number,
): string {
  if (image) {
    const url = typeof image === 'string' ? image : image.url
    if (url) return url
  }
  // deterministic pick: sum char codes of the id so every method consistently gets the same default
  const str = String(id)
  const index = (str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % POOL_SIZE) + 1
  return `/method-defaults/${index}.jpg`
}

// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { MediaSizeName } from '@/types'

// Number of fallback cover images in /public/method-defaults (1.jpg … 7.jpg).
const POOL_SIZE = 7

type ImageLike = {
  url?: string | null
  sizes?: Partial<Record<MediaSizeName, { url?: string | null }>> | null
}

/**
 * Resolves a method's cover image URL: the uploaded image if present, otherwise a
 * deterministic pick from the default pool so a given method always shows the same
 * placeholder (stable across renders, no per-request randomness).
 *
 * `size` prefers a generated WebP rendition (thumbnail/card/hero); uploads made
 * before image processing existed have no sizes and fall back to the original.
 */
export function getMethodImageUrl(
  image: ImageLike | string | null | undefined,
  id: string | number,
  size?: MediaSizeName,
): string {
  if (image) {
    if (typeof image === 'object') {
      const sized = size ? image.sizes?.[size]?.url : null
      if (sized) return sized
    }
    const url = typeof image === 'string' ? image : image.url
    if (url) return url
  }
  // deterministic pick: sum char codes of the id so every method consistently gets the same default
  const str = String(id)
  const index = (str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % POOL_SIZE) + 1
  return `/method-defaults/${index}.jpg`
}

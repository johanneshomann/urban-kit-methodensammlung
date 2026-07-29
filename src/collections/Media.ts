// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: { en: 'Assets', de: 'Medien' },
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: ['image/*'],
    // The stored "original" is itself capped and converted: incoming files
    // (≤ 5 MB, see upload.limits in payload.config.ts) are resized to max
    // 2400px wide and re-encoded as WebP, so no full-size camera files ever
    // stay on disk. doc.url keeps working — it just points at this WebP.
    resizeOptions: { width: 2400, withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 85 } },
    // Smaller WebP renditions for specific frontend contexts.
    // NOTE: uploads from before image processing existed have no sizes and
    // remain unconverted — the frontend falls back to their original url.
    imageSizes: [
      { name: 'thumbnail', width: 400, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 70 } } },
      { name: 'card', width: 800, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'hero', width: 1600, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { en: 'Alt Text', de: 'Alternativtext' },
    },
  ],
}

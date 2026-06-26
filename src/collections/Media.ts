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
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { en: 'Alt Text', de: 'Alternativtext' },
    },
  ],
}

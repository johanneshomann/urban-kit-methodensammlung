// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { CollectionConfig } from 'payload'
import path from 'path'

export const Icons: CollectionConfig = {
  slug: 'icons',
  labels: {
    singular: { en: 'Icon', de: 'Icon' },
    plural: { en: 'Icons', de: 'Icons' },
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/icons'),
    mimeTypes: ['image/svg+xml', 'image/png', 'image/webp'],
  },
  admin: {
    useAsTitle: 'name',
    group: { en: 'Assets', de: 'Medien' },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', de: 'Name' },
    },
    {
      // Deliberately optional: icons render as decorative on the website
      // (aria-hidden, always next to their visible text label).
      name: 'alt',
      type: 'text',
      label: { en: 'Alt Text', de: 'Alternativtext' },
      admin: {
        description: {
          de: 'Optional – Icons erscheinen auf der Website dekorativ neben ihrem Namen und werden von Screenreadern übersprungen. Nur ausfüllen, falls das Icon irgendwo allein stehend Bedeutung tragen soll.',
          en: 'Optional – icons appear decoratively next to their visible name on the website and are skipped by screen readers. Fill in only if the icon needs to carry meaning on its own somewhere.',
        },
      },
    },
  ],
}

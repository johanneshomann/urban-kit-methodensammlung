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
      name: 'alt',
      type: 'text',
      label: { en: 'Alt Text', de: 'Alternativtext' },
    },
  ],
}

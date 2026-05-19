import type { CollectionConfig } from 'payload'
import path from 'path'

export const Icons: CollectionConfig = {
  slug: 'icons',
  labels: { singular: 'Icon', plural: 'Icons' },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/icons'),
    mimeTypes: ['image/svg+xml', 'image/png', 'image/webp'],
  },
  admin: {
    useAsTitle: 'name',
    group: 'Assets',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
  ],
}

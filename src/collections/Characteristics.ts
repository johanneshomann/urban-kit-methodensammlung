import type { CollectionConfig } from 'payload'

export const Characteristics: CollectionConfig = {
  slug: 'characteristics',
  labels: { singular: 'Characteristic', plural: 'Characteristics' },
  admin: { useAsTitle: 'name', group: 'Filter Collections' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Sprache oben wechseln um zu übersetzen · Switch language above to translate' },
    },
  ],
}

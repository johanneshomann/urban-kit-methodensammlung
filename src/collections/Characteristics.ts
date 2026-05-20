import type { CollectionConfig } from 'payload'

export const Characteristics: CollectionConfig = {
  slug: 'characteristics',
  labels: {
    singular: { en: 'Characteristic', de: 'Merkmal' },
    plural: { en: 'Characteristics', de: 'Merkmale' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Filter Collections', de: 'Filter' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'DE',
          fields: [{ name: 'nameDe', label: { en: 'Name', de: 'Name' }, type: 'text', required: true }],
        },
        {
          label: 'EN',
          fields: [{ name: 'nameEn', label: { en: 'Name', de: 'Name' }, type: 'text' }],
        },
      ],
    },
  ],
}

import type { CollectionConfig } from 'payload'

export const Formats: CollectionConfig = {
  slug: 'formats',
  labels: {
    singular: { en: 'Format', de: 'Format' },
    plural: { en: 'Formats', de: 'Formate' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Formats', de: 'Formate' } },
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

import type { CollectionConfig } from 'payload'

export const Goals: CollectionConfig = {
  slug: 'goals',
  labels: {
    singular: { en: 'Goal', de: 'Ziel' },
    plural: { en: 'Goals', de: 'Ziele' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Goals', de: 'Ziele' } },
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

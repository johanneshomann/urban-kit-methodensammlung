import type { CollectionConfig } from 'payload'

export const Goals: CollectionConfig = {
  slug: 'goals',
  labels: {
    singular: { en: 'Goal', de: 'Ziel' },
    plural: { en: 'Goals', de: 'Ziele' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Filter Collections', de: 'Filter' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'German', de: 'Deutsch' },
          fields: [
            { name: 'nameDe', label: { en: 'Name (German)', de: 'Name (Deutsch)' }, type: 'text', required: true },
          ],
        },
        {
          label: { en: 'English', de: 'Englisch' },
          fields: [
            { name: 'nameEn', label: { en: 'Name (English)', de: 'Name (Englisch)' }, type: 'text' },
          ],
        },
      ],
    },
  ],
}

import type { CollectionConfig } from 'payload'

export const Durations: CollectionConfig = {
  slug: 'durations',
  labels: {
    singular: { en: 'Duration', de: 'Dauer' },
    plural: { en: 'Durations', de: 'Zeitrahmen' },
  },
  admin: { useAsTitle: 'nameDe', defaultColumns: ['nameDe', 'category'], group: { en: 'Filter Collections', de: 'Filter' } },
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
    {
      name: 'category',
      label: { en: 'Category', de: 'Kategorie' },
      type: 'select',
      required: true,
      options: [
        { label: { en: 'Short', de: 'Kurz' }, value: 'short' },
        { label: { en: 'Medium', de: 'Mittel' }, value: 'medium' },
        { label: { en: 'Long', de: 'Lang' }, value: 'long' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

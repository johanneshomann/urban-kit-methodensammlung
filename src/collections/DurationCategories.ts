import type { CollectionConfig } from 'payload'

export const DurationCategories: CollectionConfig = {
  slug: 'duration-categories',
  labels: {
    singular: { en: 'Duration Category', de: 'Zeitrahmen-Kategorie' },
    plural: { en: 'Duration Categories', de: 'Zeitrahmen-Kategorien' },
  },
  admin: {
    useAsTitle: 'nameDe',
    defaultColumns: ['nameDe', 'nameEn'],
    group: { en: 'Durations', de: 'Zeitrahmen' },
  },
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
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
      admin: { position: 'sidebar' },
    },
  ],
}

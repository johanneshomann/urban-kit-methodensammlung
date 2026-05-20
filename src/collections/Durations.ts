import type { CollectionConfig } from 'payload'

export const Durations: CollectionConfig = {
  slug: 'durations',
  labels: {
    singular: { en: 'Duration', de: 'Dauer' },
    plural: { en: 'Durations', de: 'Zeitrahmen' },
  },
  admin: { useAsTitle: 'labelDe', defaultColumns: ['labelDe', 'category'], group: { en: 'Filter Collections', de: 'Filter' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'German', de: 'Deutsch' },
          fields: [
            { name: 'labelDe', label: { en: 'Label (German)', de: 'Bezeichnung (Deutsch)' }, type: 'text', required: true },
          ],
        },
        {
          label: { en: 'English', de: 'Englisch' },
          fields: [
            { name: 'labelEn', label: { en: 'Label (English)', de: 'Bezeichnung (Englisch)' }, type: 'text' },
          ],
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

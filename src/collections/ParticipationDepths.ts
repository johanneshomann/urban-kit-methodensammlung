import type { CollectionConfig } from 'payload'

export const ParticipationDepths: CollectionConfig = {
  slug: 'participation-depths',
  labels: {
    singular: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
    plural: { en: 'Participation Depths', de: 'Beteiligungstiefen' },
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

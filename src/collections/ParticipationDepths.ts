import type { CollectionConfig } from 'payload'

export const ParticipationDepths: CollectionConfig = {
  slug: 'participation-depths',
  labels: {
    singular: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
    plural: { en: 'Participation Depths', de: 'Beteiligungstiefen' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Participation Depth', de: 'Beteiligungstiefe' } },
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

import type { CollectionConfig } from 'payload'

export const TargetGroups: CollectionConfig = {
  slug: 'target-groups',
  labels: {
    singular: { en: 'Target Group', de: 'Zielgruppe' },
    plural: { en: 'Target Groups', de: 'Zielgruppen' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Filter Collections', de: 'Filter' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'DE',
          fields: [
            { name: 'nameDe', label: { en: 'Name', de: 'Name' }, type: 'text', required: true },
            { name: 'explanation', type: 'textarea', label: { en: 'Explanation', de: 'Erläuterung' }, maxLength: 250, admin: { description: { en: 'Max. 250 characters', de: 'Max. 250 Zeichen' } } },
          ],
        },
        {
          label: 'EN',
          fields: [
            { name: 'nameEn', label: { en: 'Name', de: 'Name' }, type: 'text' },
            { name: 'explanationEn', type: 'textarea', label: { en: 'Explanation', de: 'Erläuterung' }, maxLength: 250, admin: { description: { en: 'Max. 250 characters', de: 'Max. 250 Zeichen' } } },
          ],
        },
      ],
    },
  ],
}

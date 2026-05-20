import type { CollectionConfig } from 'payload'

export const GroupSizes: CollectionConfig = {
  slug: 'group-sizes',
  labels: {
    singular: { en: 'Group Size', de: 'Gruppengröße' },
    plural: { en: 'Group Sizes', de: 'Gruppengrößen' },
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

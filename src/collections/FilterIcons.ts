import type { CollectionConfig } from 'payload'

export const FilterIcons: CollectionConfig = {
  slug: 'filter-icons',
  labels: {
    singular: { en: 'Filter Icons', de: 'Filter-Icons' },
    plural: { en: 'Filter Icons', de: 'Filter-Icons' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Settings', de: 'Einstellungen' },
    description: { en: 'Only one document allowed.', de: 'Nur ein Dokument erlaubt.' },
  },
  hooks: {
    beforeOperation: [
      async ({ operation, req }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({ collection: 'filter-icons', limit: 1 })
          if (existing.totalDocs > 0) {
            throw new Error('Only one Filter Icons document is allowed.')
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Filter Icons',
      admin: { hidden: true },
    },
    {
      name: 'characteristics',
      label: { en: 'Characteristics', de: 'Merkmale' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'durations',
      label: { en: 'Duration', de: 'Zeitrahmen' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'formats',
      label: { en: 'Format', de: 'Format' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'goals',
      label: { en: 'Goals', de: 'Ziele' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'groupSizes',
      label: { en: 'Group Size', de: 'Gruppengröße' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'participationDepths',
      label: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'projectPhases',
      label: { en: 'Project Phase', de: 'Projektphase' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'targetGroups',
      label: { en: 'Target Group', de: 'Zielgruppe' },
      type: 'upload',
      relationTo: 'icons',
    },
  ],
}

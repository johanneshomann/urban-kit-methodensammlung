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
          const existing = await req.payload.find({ collection: 'filter-icons' as any, limit: 1 })
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
      type: 'group',
      name: 'characteristicsGroup',
      label: { en: 'Characteristics', de: 'Merkmale' },
      fields: [
        { name: 'characteristics', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'characteristicsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'durationsGroup',
      label: { en: 'Duration', de: 'Zeitrahmen' },
      fields: [
        { name: 'durations', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'durationsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'formatsGroup',
      label: { en: 'Format', de: 'Format' },
      fields: [
        { name: 'formats', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'formatsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'goalsGroup',
      label: { en: 'Goals', de: 'Ziele' },
      fields: [
        { name: 'goals', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'goalsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'groupSizesGroup',
      label: { en: 'Group Size', de: 'Gruppengröße' },
      fields: [
        { name: 'groupSizes', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'groupSizesLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'participationDepthsGroup',
      label: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
      fields: [
        { name: 'participationDepths', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'participationDepthsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'projectPhasesGroup',
      label: { en: 'Project Phase', de: 'Projektphase' },
      fields: [
        { name: 'projectPhases', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'projectPhasesLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
    {
      type: 'group',
      name: 'targetGroupsGroup',
      label: { en: 'Target Group', de: 'Zielgruppe' },
      fields: [
        { name: 'targetGroups', label: { en: 'Uploaded Icon', de: 'Hochgeladenes Icon' }, type: 'upload', relationTo: 'icons' },
        { name: 'targetGroupsLucide', label: { en: 'Lucide Icon', de: 'Lucide Icon' }, type: 'text', admin: { description: { en: 'Fallback icon name from lucide.dev', de: 'Fallback Icon-Name von lucide.dev' } } },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

export const FilterIcons: GlobalConfig = {
  slug: 'filter-icons',
  label: { en: 'Filter Icons', de: 'Filter-Icons' },
  admin: {
    group: { en: 'Settings', de: 'Einstellungen' },
  },
  fields: [
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

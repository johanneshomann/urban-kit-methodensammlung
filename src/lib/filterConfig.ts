export type CategoryDef = { value: string; de: string; en: string }

export const FILTER_CONFIGS = [
  { key: 'participationDepths', de: 'Beteiligungstiefe', en: 'Participation Depth', slug: 'participation-depths', categories: undefined },
  {
    key: 'projectPhases',
    de: 'Projektphase',
    en: 'Project Phase',
    slug: 'project-phases',
    categories: [
      { value: 'preparation', de: 'Vorbereitung', en: 'Preparation' },
      { value: 'implementation', de: 'Durchführung', en: 'Implementation' },
      { value: 'follow-up', de: 'Nachbereitung', en: 'Follow-up' },
    ] as CategoryDef[],
  },
  { key: 'goals', de: 'Ziele', en: 'Goals', slug: 'goals', categories: undefined },
  { key: 'formats', de: 'Format', en: 'Format', slug: 'formats', categories: undefined },
  { key: 'durations', de: 'Zeitrahmen', en: 'Duration', slug: 'durations', categories: undefined },
  { key: 'targetGroups', de: 'Zielgruppe', en: 'Target Group', slug: 'target-groups', categories: undefined },
  { key: 'groupSizes', de: 'Gruppengröße', en: 'Group Size', slug: 'group-sizes', categories: undefined },
  { key: 'characteristics', de: 'Merkmale', en: 'Characteristics', slug: 'characteristics', categories: undefined },
] as const

export type FilterKey = (typeof FILTER_CONFIGS)[number]['key']
export type FilterState = Record<FilterKey, string>

export const EMPTY_FILTERS: FilterState = {
  participationDepths: '',
  projectPhases: '',
  goals: '',
  formats: '',
  durations: '',
  targetGroups: '',
  groupSizes: '',
  characteristics: '',
}

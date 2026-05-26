export const FILTER_CONFIGS = [
  { key: 'participationDepths', de: 'Beteiligungstiefe', en: 'Participation Depth', slug: 'participation-depths' },
  { key: 'projectPhases', de: 'Projektphase', en: 'Project Phase', slug: 'project-phases', categoryCollectionSlug: 'project-phase-categories' },
  { key: 'goals', de: 'Ziele', en: 'Goals', slug: 'goals' },
  { key: 'formats', de: 'Format', en: 'Format', slug: 'formats' },
  { key: 'durations', de: 'Zeitrahmen', en: 'Duration', slug: 'durations', categoryCollectionSlug: 'duration-categories' },
  { key: 'targetGroups', de: 'Zielgruppe', en: 'Target Group', slug: 'target-groups' },
  { key: 'groupSizes', de: 'Gruppengröße', en: 'Group Size', slug: 'group-sizes' },
  { key: 'characteristics', de: 'Merkmale', en: 'Characteristics', slug: 'characteristics' },
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

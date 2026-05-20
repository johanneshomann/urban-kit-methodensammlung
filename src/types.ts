export type FilterItem = {
  id: string
  nameDe?: string | null
  nameEn?: string | null
  labelDe?: string | null
  labelEn?: string | null
}

export type MediaFile = {
  id: string
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type Methode = {
  id: string
  title: string
  slug?: string | null
  status?: 'draft' | 'published' | null
  description?: unknown
  characteristics?: (FilterItem | string)[] | null
  durations?: (FilterItem | string)[] | null
  formats?: (FilterItem | string)[] | null
  goals?: (FilterItem | string)[] | null
  groupSizes?: (FilterItem | string)[] | null
  participationDepths?: (FilterItem | string)[] | null
  projectPhases?: (FilterItem | string)[] | null
  targetGroups?: (FilterItem | string)[] | null
  image?: MediaFile | string | null
  createdAt: string
  updatedAt: string
}

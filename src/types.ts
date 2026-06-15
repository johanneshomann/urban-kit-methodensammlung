export type CategoryItem = {
  id: string
  nameDe?: string | null
  nameEn?: string | null
  icon?: { id: string; url?: string | null; alt?: string | null } | string | null
}

export type FilterItem = {
  id: string
  nameDe?: string | null
  nameEn?: string | null
  labelDe?: string | null
  labelEn?: string | null
  category?: CategoryItem | string | null
  icon?: { id: string; url?: string | null } | string | null
  lucideIcon?: string | null
}

export type MethodSection = {
  id?: string | null
  sectionTitle?: string | null
  content?: unknown
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
  titleEn?: string | null
  slug?: string | null
  status?: 'draft' | 'published' | null
  auszug?: string | null
  auszugEn?: string | null
  zielDerMethode?: unknown
  zielDerMethodeEn?: unknown
  wannSinnvoll?: unknown
  wannSinnvollEn?: unknown
  wannNichtSinnvoll?: unknown
  wannNichtSinnvollEn?: unknown
  description?: unknown
  descriptionEn?: unknown
  vorbereitung?: MethodSection[] | null
  vorbereitungEn?: MethodSection[] | null
  durchfuehrung?: MethodSection[] | null
  durchfuehrungEn?: MethodSection[] | null
  auswertung?: MethodSection[] | null
  auswertungEn?: MethodSection[] | null
  tipps?: unknown
  tippsEn?: unknown
  ungeeignetFuer?: unknown
  ungeeignetFuerEn?: unknown
  aehnlicheMethoden?: (Methode | string)[] | null
  wieKannEsWeiterGehen?: (Methode | string)[] | null
  characteristics?: (FilterItem | string)[] | null
  durations?: (FilterItem | string)[] | null
  formats?: (FilterItem | string)[] | null
  goals?: (FilterItem | string)[] | null
  groupSizes?: (FilterItem | string)[] | null
  participationDepths?: (FilterItem | string)[] | null
  projectPhases?: (FilterItem | string)[] | null
  targetGroups?: (FilterItem | string)[] | null
  image?: MediaFile | string | null
  gallery?: (MediaFile | string)[] | null
  createdAt: string
  updatedAt: string
}

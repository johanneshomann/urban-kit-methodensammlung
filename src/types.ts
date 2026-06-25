export type CategoryItem = {
  id: string
  name?: string | null
  icon?: { id: string; url?: string | null; alt?: string | null } | string | null
}

export type FilterItem = {
  id: string
  name?: string | null
  explanation?: string | null
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
  // Localized fields — Payload returns the value for the requested locale (DE fallback).
  title: string
  slug?: string | null
  status?: 'draft' | 'published' | null
  auszug?: string | null
  zielDerMethode?: unknown
  wannSinnvoll?: unknown
  wannNichtSinnvoll?: unknown
  vorbereitung?: MethodSection[] | null
  durchfuehrung?: MethodSection[] | null
  auswertung?: MethodSection[] | null
  tipps?: unknown
  ungeeignetFuer?: unknown
  aehnlicheMethoden?: (Methode | string)[] | null
  aehnlichMarkiertVon?: { docs?: (Methode | string)[] | null } | null
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

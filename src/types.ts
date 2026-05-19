export type Tag = {
  id: string
  name: string
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
  category?: 'A' | 'B' | 'C' | null
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  description?: unknown
  steps?: Array<{ id?: string | null; step: string }> | null
  tags?: (Tag | string)[] | null
  image?: MediaFile | string | null
  createdAt: string
  updatedAt: string
}

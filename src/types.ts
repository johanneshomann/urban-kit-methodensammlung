export type Characteristic = {
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
  description?: unknown
  steps?: Array<{ id?: string | null; step: string }> | null
  characteristics?: (Characteristic | string)[] | null
  image?: MediaFile | string | null
  createdAt: string
  updatedAt: string
}

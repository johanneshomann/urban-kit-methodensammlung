import { getPayload } from 'payload'
import config from '@payload-config'
import type { Methode } from '@/types'
import { lexicalToText } from './query'

/**
 * A compact, whole-catalogue digest the model reads to suggest methods from a
 * free-text project description ("describe → suggest"). One short line per
 * published method: id, title, summary, and taxonomy labels. This is the
 * semantic layer for a small/medium catalogue — the model matches the user's
 * prose against real methods, no embeddings/vector store needed.
 *
 * Goes into the (prompt-cached) system prompt, so per-turn cost stays tiny.
 * `ids` is the allow-list: the model can only surface methods that exist here.
 */

const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_METHODS = 200 // digest cap — see note in the route if the catalogue outgrows this

type Digest = { at: number; text: string; ids: Set<string>; count: number }
const cache = new Map<string, Digest>()

export async function loadCatalogueDigest(locale: 'de' | 'en'): Promise<Digest> {
  const cached = cache.get(locale)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached

  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'methods',
    where: { status: { equals: 'published' } },
    depth: 1,
    limit: MAX_METHODS,
    sort: '-createdAt',
    locale,
    fallbackLocale: 'de',
  })

  const methods = res.docs as unknown as Methode[]
  const ids = new Set<string>()

  const lines = methods.map((m) => {
    ids.add(String(m.id))
    const auszug = (m.auszug || '').replace(/\s+/g, ' ').trim().slice(0, 180)
    const ziel = lexicalToText(m.zielDerMethode).slice(0, 260)
    return `[${m.id}] ${m.title}${auszug ? ` — ${auszug}` : ''}${ziel ? `\n    Ziel: ${ziel}` : ''}`
  })

  const data: Digest = { at: Date.now(), text: lines.join('\n'), ids, count: methods.length }
  cache.set(locale, data)
  return data
}

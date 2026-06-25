import { getPayload } from 'payload'
import config from '@payload-config'
import { FILTER_CONFIGS, type FilterKey } from '@/lib/filterConfig'

/**
 * Loads the filter taxonomies as `{ id, name }` option lists, in the requested
 * locale. This is the ONLY catalogue knowledge the LLM ever sees — it maps a
 * conversation onto these IDs; retrieval stays deterministic in `query.ts`.
 *
 * Mirrors the collection slugs used by the public methods page so the assistant
 * and the manual filter UI always agree on the option set.
 */

const COLLECTION_SLUGS: Record<FilterKey, string> = {
  participationDepths: 'participation-depths',
  projectPhases: 'project-phases',
  goals: 'goals',
  formats: 'formats',
  durations: 'durations',
  targetGroups: 'target-groups',
  groupSizes: 'group-sizes',
  characteristics: 'characteristics',
}

export type TaxonomyOption = { id: string; name: string }
export type Taxonomies = Record<FilterKey, TaxonomyOption[]>

// Taxonomies change rarely; cache per locale with a short TTL so the route
// doesn't re-query Payload on every chat turn.
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { at: number; data: Taxonomies }>()

export async function loadTaxonomies(locale: 'de' | 'en'): Promise<Taxonomies> {
  const cached = cache.get(locale)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data

  const payload = await getPayload({ config })
  const keys = FILTER_CONFIGS.map((c) => c.key)

  const results = await Promise.all(
    keys.map((key) =>
      payload.find({
        collection: COLLECTION_SLUGS[key] as never,
        limit: 200,
        depth: 0,
        locale,
        fallbackLocale: 'de',
      }),
    ),
  )

  const data = {} as Taxonomies
  keys.forEach((key, i) => {
    data[key] = (results[i].docs as Array<{ id: string; name?: string | null }>)
      .map((d) => ({ id: String(d.id), name: d.name || '' }))
      .filter((o) => o.name)
  })

  cache.set(locale, { at: Date.now(), data })
  return data
}

/** Flat set of every valid taxonomy ID — used to reject anything the model invents. */
export function validIdSet(taxonomies: Taxonomies): Set<string> {
  const set = new Set<string>()
  for (const opts of Object.values(taxonomies)) for (const o of opts) set.add(o.id)
  return set
}

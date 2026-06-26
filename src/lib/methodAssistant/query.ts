// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Methode } from '@/types'
import { FILTER_CONFIGS, type FilterKey } from '@/lib/filterConfig'

/**
 * Deterministic retrieval. The LLM only ever produces taxonomy IDs; these
 * functions turn those IDs into real, published methods via Payload. The model
 * cannot fabricate a method or reach one outside the catalogue.
 */

const FILTER_KEYS = FILTER_CONFIGS.map((c) => c.key)

export type AssistantFilters = Partial<Record<FilterKey, string[]>>

/**
 * AND across taxonomy groups, OR within a group (a method matches if it carries
 * any of the selected options for that group) — identical semantics to the
 * manual filter UI.
 */
export function buildWhere(filters: AssistantFilters): Where {
  const and: Where[] = [{ status: { equals: 'published' } }]
  for (const key of FILTER_KEYS) {
    const ids = filters[key]
    if (ids && ids.length) and.push({ [key]: { in: ids } })
  }
  return { and }
}

const SHORTLIST_LIMIT = 10

/** Content snippet handed to the model so it can give grounded feedback. */
export type MethodSnippet = {
  id: string
  title: string
  auszug: string
  ziel: string
  wannSinnvoll: string
  ungeeignetFuer: string
}

export type Shortlist = {
  /** Trimmed content rows the model reasons over (keeps tool results small). */
  forModel: MethodSnippet[]
  /** Full method docs kept server-side to render cards in the client. */
  full: Methode[]
}

function snippet(m: Methode): MethodSnippet {
  return {
    id: String(m.id),
    title: m.title,
    auszug: (m.auszug || '').slice(0, 220),
    ziel: lexicalToText(m.zielDerMethode).slice(0, 320),
    wannSinnvoll: lexicalToText(m.wannSinnvoll).slice(0, 320),
    ungeeignetFuer: lexicalToText(m.ungeeignetFuer).slice(0, 220),
  }
}

/**
 * Deterministic finder. Combines taxonomy filtering (AND across groups) with an
 * optional free-text keyword match over title + summary. Returns candidates
 * WITH content snippets so the model can compare them on substance, not just
 * labels.
 */
export async function findMethods(
  args: { filters?: AssistantFilters; query?: string },
  locale: 'de' | 'en',
): Promise<Shortlist> {
  const where = buildWhere(args.filters ?? {})
  const q = args.query?.trim()
  if (q) {
    ;(where.and as Where[]).push({
      or: [{ title: { like: q } }, { auszug: { like: q } }],
    })
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where,
    depth: 2,
    limit: SHORTLIST_LIMIT,
    sort: '-createdAt',
    locale,
    fallbackLocale: 'de',
  })

  const full = result.docs as unknown as Methode[]
  return { full, forModel: full.map(snippet) }
}

/**
 * Fetch specific methods by id (preserving the requested order) to render as
 * cards AND to ground the model's recommendation. The route validates ids
 * against the catalogue first, so this only ever sees real published methods.
 */
export async function showMethods(ids: string[], locale: 'de' | 'en'): Promise<Shortlist> {
  if (!ids.length) return { full: [], forModel: [] }
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { and: [{ status: { equals: 'published' } }, { id: { in: ids } }] },
    depth: 2,
    limit: ids.length,
    locale,
    fallbackLocale: 'de',
  })
  const byId = new Map((result.docs as unknown as Methode[]).map((m) => [String(m.id), m]))
  const full = ids.map((id) => byId.get(id)).filter((m): m is Methode => Boolean(m))
  return { full, forModel: full.map(snippet) }
}

/** Recursively pull plain text out of a Lexical rich-text value. */
export function lexicalToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (typeof n.text === 'string') return n.text
  const root = n.root as Record<string, unknown> | undefined
  const children = (root?.children ?? n.children) as unknown[] | undefined
  if (!Array.isArray(children)) return ''
  return children.map(lexicalToText).join(' ').replace(/\s+/g, ' ').trim()
}

function sectionsToText(sections: Methode['vorbereitung']): string {
  if (!Array.isArray(sections)) return ''
  return sections
    .map((s) => [s.sectionTitle, lexicalToText(s.content)].filter(Boolean).join(': '))
    .filter(Boolean)
    .join(' · ')
}

/**
 * One method's content, trimmed to plain text — fetched on demand when the
 * model decides it needs detail to answer a content-specific question.
 */
export async function getMethodDetail(id: string, locale: 'de' | 'en') {
  const payload = await getPayload({ config })
  const m = (await payload.findByID({
    collection: 'methods',
    id,
    depth: 1,
    locale,
    fallbackLocale: 'de',
  })) as unknown as Methode

  return {
    id: String(m.id),
    title: m.title,
    auszug: m.auszug || '',
    ziel: lexicalToText(m.zielDerMethode),
    wannSinnvoll: lexicalToText(m.wannSinnvoll),
    wannNichtSinnvoll: lexicalToText(m.wannNichtSinnvoll),
    ungeeignetFuer: lexicalToText(m.ungeeignetFuer),
    vorbereitung: sectionsToText(m.vorbereitung),
    durchfuehrung: sectionsToText(m.durchfuehrung),
    auswertung: sectionsToText(m.auswertung),
  }
}

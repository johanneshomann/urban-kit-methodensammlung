// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { generateText, stepCountIs, tool, type ModelMessage } from 'ai'
import { z } from 'zod'
import type { Methode } from '@/types'
import { FILTER_CONFIGS, type FilterKey } from '@/lib/filterConfig'
import { buildSystemPrompt } from './prompt'
import { loadTaxonomies, validIdSet } from './taxonomies'
import { loadCatalogueDigest } from './catalogue'
import { findMethods, getMethodDetail, showMethods, type AssistantFilters } from './query'
import { buildModel } from './model'
import type { AssistantSettings } from './settings'

/**
 * Runs the tool-use loop against whichever provider the settings select
 * (Anthropic / OpenAI / Mistral) via the Vercel AI SDK. The SDK normalises
 * tool-calling and drives the multi-step loop; everything else (retrieval,
 * prompt, catalogue digest, UI) is provider-agnostic.
 */

const MAX_STEPS = 8 // hard stop on the agentic loop
const MAX_GET_METHOD_CALLS = 4 // deep-read budget (the most expensive path)
const MAX_SHOWN = 6 // cards surfaced to the user per turn

export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type AssistantResult = { reply: string; methods: Methode[] }

const FILTER_KEYS = FILTER_CONFIGS.map((c) => c.key)

// zod schema: { [filterKey]: string[]? } — one optional id array per taxonomy group.
const filtersSchema = z
  .object(
    Object.fromEntries(FILTER_KEYS.map((k) => [k, z.array(z.string()).optional()])) as Record<
      FilterKey,
      z.ZodOptional<z.ZodArray<z.ZodString>>
    >,
  )
  .optional()

/** Keep only valid, known taxonomy IDs — the model cannot inject anything else. */
function sanitizeFilters(raw: unknown, validIds: Set<string>): AssistantFilters {
  const out: AssistantFilters = {}
  if (!raw || typeof raw !== 'object') return out
  for (const key of FILTER_KEYS as FilterKey[]) {
    const v = (raw as Record<string, unknown>)[key]
    if (Array.isArray(v)) {
      const ids = v.filter((x): x is string => typeof x === 'string' && validIds.has(x))
      if (ids.length) out[key] = ids
    }
  }
  return out
}

export async function runAssistantTurn(
  history: ChatMessage[],
  locale: 'de' | 'en',
  settings: AssistantSettings,
): Promise<AssistantResult> {
  const [taxonomies, digest] = await Promise.all([
    loadTaxonomies(locale),
    loadCatalogueDigest(locale),
  ])
  const validTaxonomyIds = validIdSet(taxonomies)
  const catalogueIds = digest.ids
  const system = buildSystemPrompt(taxonomies, digest.text, locale, settings.instructions)

  // Mutated by the tool executors below; read after the loop completes.
  let shown: Methode[] = [] // cards from show_methods (the user-facing pick)
  let found: Methode[] = [] // fallback: latest find_methods result
  let getMethodCalls = 0

  const tools = {
    find_methods: tool({
      description:
        'Deterministically find published methods. Provide `filters` (taxonomy IDs, AND across groups) and/or a free-text `query` matched against title and summary. Returns matching methods with content snippets so you can judge fit.',
      inputSchema: z.object({ filters: filtersSchema, query: z.string().optional() }),
      execute: async ({ filters, query }) => {
        const result = await findMethods(
          { filters: sanitizeFilters(filters, validTaxonomyIds), query },
          locale,
        )
        found = result.full
        return { count: result.forModel.length, methods: result.forModel }
      },
    }),
    show_methods: tool({
      description:
        "Display these methods to the user as cards and get their content back to ground your recommendation. Pass up to 6 ids you want to recommend or compare — ids must come from the catalogue or a prior tool result. Call this whenever you name specific methods.",
      inputSchema: z.object({ ids: z.array(z.string()) }),
      execute: async ({ ids }) => {
        const valid = ids.filter((id) => catalogueIds.has(id)).slice(0, MAX_SHOWN)
        if (!valid.length) {
          return { error: 'No valid ids. Use ids from the catalogue or a find_methods result.' }
        }
        const result = await showMethods(valid, locale)
        shown = result.full
        return { shown: result.forModel.length, methods: result.forModel }
      },
    }),
    get_method: tool({
      description:
        "Read one method's deeper content (full procedure: preparation, execution, follow-up; materials; tips). Use only when the user asks something the summaries can't answer.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        if (!catalogueIds.has(id)) return { error: 'Unknown method id.' }
        if (getMethodCalls >= MAX_GET_METHOD_CALLS) {
          return { error: 'Detail budget reached. Use the summaries you already have.' }
        }
        getMethodCalls++
        return getMethodDetail(id, locale)
      },
    }),
  }

  const messages: ModelMessage[] = history.map((m) => ({ role: m.role, content: m.content }))

  const result = await generateText({
    model: buildModel(settings.provider, settings.model, settings.apiKey),
    // System as a message so Anthropic prompt-caching can be attached. The
    // anthropic providerOptions are simply ignored by other providers.
    system: [
      {
        role: 'system',
        content: system,
        providerOptions:
          settings.provider === 'anthropic'
            ? { anthropic: { cacheControl: { type: 'ephemeral', ttl: '1h' } } }
            : undefined,
      },
    ],
    messages,
    tools,
    stopWhen: stepCountIs(MAX_STEPS),
  })

  const reply = result.text.trim()
  return {
    reply:
      reply ||
      (locale === 'de'
        ? 'Hier sind einige passende Methoden. Magst du mir noch etwas mehr über dein Projekt verraten?'
        : 'Here are some matching methods. Could you tell me a bit more about your project?'),
    methods: shown.length ? shown : found,
  }
}

import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { mistral, createMistral } from '@ai-sdk/mistral'
import type { LanguageModel } from 'ai'

/**
 * Provider selection. The rest of the assistant is provider-agnostic — it talks
 * to whatever LanguageModel this returns via the Vercel AI SDK, which normalises
 * tool-calling across Anthropic / OpenAI / Mistral.
 *
 * Provider, model and key come from `settings.ts` (the admin global, or env
 * fallback). When an explicit key is given it's injected via the provider's
 * `create*` factory; otherwise the default instance reads the conventional env
 * var (ANTHROPIC_API_KEY / OPENAI_API_KEY / MISTRAL_API_KEY).
 */

export type AssistantProvider = 'anthropic' | 'openai' | 'mistral'

export const DEFAULT_MODEL: Record<AssistantProvider, string> = {
  anthropic: 'claude-haiku-4-5',
  openai: 'gpt-4o-mini',
  mistral: 'mistral-small-latest',
}

export function buildModel(
  provider: AssistantProvider,
  modelId?: string,
  apiKey?: string,
): LanguageModel {
  const id = modelId || DEFAULT_MODEL[provider]
  switch (provider) {
    case 'openai':
      return (apiKey ? createOpenAI({ apiKey }) : openai)(id)
    case 'mistral':
      return (apiKey ? createMistral({ apiKey }) : mistral)(id)
    default:
      return (apiKey ? createAnthropic({ apiKey }) : anthropic)(id)
  }
}

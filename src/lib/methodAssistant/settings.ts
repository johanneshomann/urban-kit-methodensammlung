import { getPayload } from 'payload'
import config from '@payload-config'
import type { AssistantProvider } from './model'

/**
 * Resolves the assistant configuration from the `assistant` admin global, with
 * environment variables as fallback (so the API key can stay in the server env
 * instead of the database). Precedence: global value → env var → default.
 *
 * Cached briefly so a busy chat doesn't re-read the global on every turn; admin
 * changes take effect within the TTL.
 */

export type AssistantSettings = {
  enabled: boolean
  provider: AssistantProvider
  model?: string
  apiKey?: string
  greeting?: string
  instructions?: string
  rateLimit: number
  /** enabled AND the selected provider has a key. */
  configured: boolean
}

const PROVIDERS: AssistantProvider[] = ['anthropic', 'openai', 'mistral']
const ENV_KEY: Record<AssistantProvider, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  mistral: 'MISTRAL_API_KEY',
}

const CACHE_TTL_MS = 30 * 1000
const cache = new Map<string, { at: number; data: AssistantSettings }>()

function pickProvider(value: unknown): AssistantProvider {
  if (typeof value === 'string' && PROVIDERS.includes(value as AssistantProvider)) {
    return value as AssistantProvider
  }
  const env = (process.env.METHOD_ASSISTANT_PROVIDER || '').toLowerCase()
  return PROVIDERS.includes(env as AssistantProvider) ? (env as AssistantProvider) : 'anthropic'
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

export async function loadAssistantSettings(locale: 'de' | 'en'): Promise<AssistantSettings> {
  const cached = cache.get(locale)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data

  let g: Record<string, unknown> = {}
  try {
    const payload = await getPayload({ config })
    g = (await payload.findGlobal({ slug: 'assistant', locale, fallbackLocale: 'de' })) as unknown as Record<
      string,
      unknown
    >
  } catch {
    // Global not yet created / DB unavailable → fall back to env entirely.
  }

  const provider = pickProvider(g.provider)
  const apiKey = str(g.apiKey) || str(process.env[ENV_KEY[provider]])
  const enabled = g.enabled !== false // default on; only an explicit toggle-off disables

  const data: AssistantSettings = {
    enabled,
    provider,
    model: str(g.model) || str(process.env.METHOD_ASSISTANT_MODEL),
    apiKey,
    greeting: str(g.greeting),
    instructions: str(g.instructions),
    rateLimit: typeof g.rateLimit === 'number' && g.rateLimit > 0 ? g.rateLimit : 20,
    configured: enabled && Boolean(apiKey),
  }

  cache.set(locale, { at: Date.now(), data })
  return data
}

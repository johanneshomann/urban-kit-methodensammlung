// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { NextRequest, NextResponse } from 'next/server'
import { runAssistantTurn, type ChatMessage } from '@/lib/methodAssistant/provider'
import { loadAssistantSettings } from '@/lib/methodAssistant/settings'
import { clientIp, countDailyRequest, dailyLimitReached, rateLimit } from '@/lib/methodAssistant/rateLimit'

export const dynamic = 'force-dynamic'

const MAX_MESSAGES = 16 // cap conversation length
const MAX_CHARS = 2000 // cap a single message

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null
  const out: ChatMessage[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') return null
    const { role, content } = m as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string' || content.length === 0 || content.length > MAX_CHARS) return null
    out.push({ role, content })
  }
  // Keep only the last few turns — the model re-derives filters from context.
  return out.slice(-8)
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { messages, locale } = (body ?? {}) as { messages?: unknown; locale?: unknown }
  const parsed = parseMessages(messages)
  if (!parsed) return NextResponse.json({ error: 'invalid_messages' }, { status: 400 })
  const loc: 'de' | 'en' = locale === 'en' ? 'en' : 'de'

  const settings = await loadAssistantSettings(loc)
  if (!settings.configured) {
    return NextResponse.json({ error: 'assistant_unavailable' }, { status: 503 })
  }

  // Global daily budget first — an attacker rotating IPs slips past the per-IP
  // window. Exhausted ⇒ same 503 as "not configured", so the widget hides and
  // the site falls back to manual filtering.
  if (dailyLimitReached()) {
    console.warn('[method-assistant] daily request ceiling reached')
    return NextResponse.json({ error: 'assistant_unavailable' }, { status: 503 })
  }

  const limit = rateLimit(clientIp(req.headers), settings.rateLimit)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } },
    )
  }

  try {
    countDailyRequest()
    const result = await runAssistantTurn(parsed, loc, settings)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[method-assistant]', err)
    return NextResponse.json({ error: 'assistant_error' }, { status: 502 })
  }
}

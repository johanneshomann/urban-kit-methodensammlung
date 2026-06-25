/**
 * Minimal in-memory IP rate limiter — the single biggest cost guard for a
 * public LLM endpoint. Per-process only (resets on redeploy / doesn't span
 * serverless instances); good enough to stop casual abuse. Swap for a shared
 * store (Redis/Upstash) if the app is scaled horizontally.
 */

const WINDOW_MS = 5 * 60 * 1000
const DEFAULT_MAX = 20

const hits = new Map<string, number[]>()

export function rateLimit(ip: string, max: number = DEFAULT_MAX): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= max) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)
    return { ok: false, retryAfter }
  }
  recent.push(now)
  hits.set(ip, recent)
  return { ok: true }
}

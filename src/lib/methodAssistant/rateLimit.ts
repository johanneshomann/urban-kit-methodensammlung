// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Cost guards for the public LLM endpoint: a per-IP sliding window plus a
 * global daily ceiling. Both are in-memory and per-process (reset on redeploy,
 * don't span instances) — good enough for a single-container deployment; swap
 * for a shared store (Redis/Upstash) if the app is scaled horizontally.
 *
 * The per-IP limit stops casual abuse; the daily ceiling is the backstop the
 * per-IP limit cannot provide, because an attacker rotating IPs (botnet, cloud
 * proxies) gets a fresh bucket per address. Exhausting it degrades the site to
 * manual filtering, which is a designed-for state.
 */

/**
 * The client IP to key rate limits on, in descending order of trust:
 *
 * 1. `CF-Connecting-IP` — set (and always overwritten) by Cloudflare, which
 *    fronts this app via a Zero Trust tunnel. Not spoofable by the client.
 * 2. `X-Real-IP` — single value, typically set by a reverse proxy.
 * 3. The **last** `X-Forwarded-For` entry — proxies (Cloudflare included)
 *    *append* the address they saw, so the last hop is the one added by our
 *    own trusted proxy. Reading the FIRST entry would let a client pick their
 *    own rate-limit bucket by sending a fake header.
 *
 * Provider-agnostic: without Cloudflare, step 1 is simply absent and any
 * ordinary reverse proxy (nginx/Caddy/Traefik) is covered by 2 or 3. With no
 * proxy headers at all, everyone shares one bucket — over-restrictive rather
 * than bypassable, which is the safe direction to fail in.
 */
export function clientIp(headers: Headers): string {
  const cf = headers.get('cf-connecting-ip')?.trim()
  if (cf) return cf
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real
  const fwd = headers.get('x-forwarded-for')
  if (fwd) {
    const parts = fwd.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }
  return 'unknown'
}

const WINDOW_MS = 5 * 60 * 1000
const DEFAULT_MAX = 20
/** Requests per calendar day across ALL clients. Override via env. */
const DAILY_MAX = Number(process.env.ASSISTANT_DAILY_MAX ?? 600)
/** Drop IP buckets that fell out of the window; runs at most this often. */
const SWEEP_INTERVAL_MS = 10 * 60 * 1000

const hits = new Map<string, number[]>()
let lastSweep = Date.now()

let dailyCount = 0
let dailyDay = new Date().toISOString().slice(0, 10)

/**
 * Drop entries whose timestamps have all aged out. Without this, every IP ever
 * seen stays in the map for the process's lifetime — a slow leak under
 * distributed probing.
 */
function sweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(ip)
  }
}

/** True while the global daily budget is exhausted (checked before per-IP). */
export function dailyLimitReached(): boolean {
  const today = new Date().toISOString().slice(0, 10)
  if (today !== dailyDay) {
    dailyDay = today
    dailyCount = 0
  }
  return dailyCount >= DAILY_MAX
}

/** Count one accepted request against the global daily budget. */
export function countDailyRequest(): void {
  dailyCount++
}

export function rateLimit(ip: string, max: number = DEFAULT_MAX): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  sweep(now)
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= max) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)
    return { ok: false, retryAfter }
  }
  recent.push(now)
  hits.set(ip, recent)
  return { ok: true }
}

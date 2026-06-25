/**
 * One-off backfill: make all existing `aehnlicheMethoden` links symmetric.
 *
 * The reciprocal sync only runs on save going forward, so links created before
 * the hook existed may be one-sided (A lists B, but B doesn't list A). This
 * script computes the symmetric closure and writes back any missing links.
 *
 * Idempotent — methods that are already symmetric are skipped.
 *
 *   BACK UP THE DATABASE FIRST, then:  npm run backfill:similar
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

const toId = (v: unknown): string | null =>
  v && typeof v === 'object' ? String((v as { id: string | number }).id ?? '') || null : (v != null ? String(v) : null)

async function backfill() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  console.log('\n── Backfill: symmetric “Ähnliche Methoden” ───')

  const all = await payload.find({ collection: 'methods', depth: 0, limit: 10000, overrideAccess: true })

  // Build the current adjacency, then its symmetric closure.
  const links = new Map<string, Set<string>>()
  for (const m of all.docs) {
    const id = toId(m.id)
    if (!id) continue
    links.set(id, new Set((m.aehnlicheMethoden ?? []).map(toId).filter((x): x is string => !!x)))
  }
  for (const [id, targets] of links) {
    for (const t of targets) {
      if (t === id) { targets.delete(t); continue } // never link to self
      links.get(t)?.add(id)
    }
  }

  let updated = 0
  for (const m of all.docs) {
    const id = toId(m.id)
    if (!id) continue
    const current = new Set((m.aehnlicheMethoden ?? []).map(toId).filter((x): x is string => !!x))
    const desired = links.get(id) ?? new Set<string>()
    // Already symmetric? (same size + every desired id present)
    if (desired.size === current.size && [...desired].every((x) => current.has(x))) continue

    await payload.update({
      collection: 'methods',
      id,
      data: { aehnlicheMethoden: [...desired] },
      overrideAccess: true,
      context: { skipSimilarSync: true }, // we already computed the full closure
    })
    updated++
    console.log(`  fixed  ${(m as { title?: string }).title ?? id}  (${current.size} → ${desired.size})`)
  }

  console.log(`\n✓ Backfill complete — ${updated} method(s) updated\n`)
  process.exit(0)
}

backfill().catch((err) => {
  console.error(err)
  process.exit(1)
})

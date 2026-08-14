// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * One-off backfill: set the stable `slug` on existing project-phase docs,
 * matched by their German name. New phases get slugs via seed.ts; this covers
 * databases seeded before the field existed. External consumers (the UrbanKIT
 * platform) match phases by these slugs.
 *
 * Idempotent — phases that already have a slug are skipped.
 *
 *   npm run backfill:phase-slugs
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

const SLUG_BY_NAME: Record<string, string> = {
  Einarbeitung: 'einarbeitung',
  Konzeptentwicklung: 'konzeptentwicklung',
  Projektplanung: 'projektplanung',
  Projektausführung: 'projektausfuehrung',
  Projektüberwachung: 'projektueberwachung',
  Projektabschluss: 'projektabschluss',
  'Abschluss & Wirkung': 'abschluss-wirkung',
  'Reflexion & Evaluation': 'reflexion-evaluation',
}

async function backfill() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  console.log('\n── Backfill: project-phase slugs ─────────────')
  const res = await payload.find({ collection: 'project-phases', limit: 100, locale: 'de', overrideAccess: true })
  for (const doc of res.docs) {
    const name = (doc.name as string) ?? ''
    const slug = SLUG_BY_NAME[name]
    if (!slug) {
      console.log(`  skip  ${name || doc.id} (no known slug)`)
      continue
    }
    if (doc.slug === slug) {
      console.log(`  skip  ${name} (already set)`)
      continue
    }
    await payload.update({ collection: 'project-phases', id: doc.id, data: { slug }, overrideAccess: true })
    console.log(`  set   ${name} → ${slug}`)
  }
  console.log('Done.')
  process.exit(0)
}

void backfill()

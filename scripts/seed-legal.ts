// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * Seeds ONLY the default legal texts (cookie policy + accessibility statement)
 * into the `Legal` global — the subset of `npm run seed` you want when the
 * templates changed but the taxonomies should be left alone.
 *
 *   npm run seed:legal            # only fills texts that are still empty
 *   npm run seed:legal -- --force # OVERWRITES the stored texts with the defaults
 *
 * `--force` discards admin edits in those two fields (both locales), so the
 * placeholders in the accessibility statement have to be filled in again.
 * The privacy policy is deliberately never seeded — it must be written for the
 * actual operator; see docs/PRIVACY-POLICY-TEMPLATES.md.
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'
import {
  barrierefreiheitDe,
  barrierefreiheitEn,
  cookiePolicyDe,
  cookiePolicyEn,
} from '../src/lib/legalDefaults'

const FIELDS = [
  { name: 'cookies', label: 'cookie policy', de: cookiePolicyDe, en: cookiePolicyEn },
  { name: 'barrierefreiheit', label: 'accessibility statement', de: barrierefreiheitDe, en: barrierefreiheitEn },
] as const

async function run() {
  const force = process.argv.includes('--force')
  // Dynamic import so payload.config reads env only after dotenv ran above.
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const legal = await payload.findGlobal({ slug: 'legal' as any, locale: 'all' as any })

  console.log(`\n── Legal texts ${force ? '(FORCE: overwriting)' : '(only empty fields)'} ─────`)
  for (const field of FIELDS) {
    if ((legal as any)?.[field.name] && !force) {
      console.log(`  skip   legal / ${field.name} (already set — use --force to overwrite)`)
      continue
    }
    await payload.updateGlobal({ slug: 'legal' as any, locale: 'de', data: { [field.name]: field.de } as any, overrideAccess: true })
    await payload.updateGlobal({ slug: 'legal' as any, locale: 'en', data: { [field.name]: field.en } as any, overrideAccess: true })
    console.log(`  ${force ? 'update' : 'create'} legal / ${field.name} (${field.label}, de + en)`)
  }

  console.log('\n✓ Done. Remember to fill the [bracketed] placeholders in the admin.\n')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

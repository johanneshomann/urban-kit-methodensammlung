/**
 * One-off migration: reshape manual DE/EN field pairs into Payload's localized
 * storage (`field: { de, en }`), then drop the old `*De`/`*En` keys.
 *
 * Covers:
 *   - methods          (title, auszug, … 10 fields)
 *   - filter collections + categories  (nameDe/nameEn → name, target-groups explanation)
 *   - platform-settings global  (impressum/datenschutz/kontakt)
 *
 * Idempotent — already-localized docs are skipped.
 *
 *   BACK UP THE DATABASE FIRST, then:  npm run migrate:localization
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import mongoose from 'mongoose'

const isLocalized = (value: unknown): boolean =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  ('de' in (value as Record<string, unknown>) || 'en' in (value as Record<string, unknown>))

/** Reshape `{ base: X, base+En: Y }` → `{ base: { de: X, en: Y } }` for the given base→deKey pairs. */
async function migrateCollection(
  collectionName: string,
  fields: { target: string; de: string; en: string }[],
) {
  const col = mongoose.connection.collection(collectionName)
  let migrated = 0
  let skipped = 0
  for await (const doc of col.find({})) {
    // skip if the first target field is already localized
    if (isLocalized(doc[fields[0].target])) {
      skipped++
      continue
    }
    const set: Record<string, unknown> = {}
    const unset: Record<string, ''> = {}
    for (const f of fields) {
      set[f.target] = { de: doc[f.de] ?? null, en: doc[f.en] ?? null }
      if (f.de !== f.target) unset[f.de] = ''
      if (f.en !== f.target) unset[f.en] = ''
    }
    await col.updateOne({ _id: doc._id }, { $set: set, $unset: unset })
    migrated++
  }
  console.log(`  ${collectionName}: migrated ${migrated}, skipped ${skipped}`)
}

async function run() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/urban-kit'
  await mongoose.connect(uri)

  // ── Methods ──────────────────────────────────────────────────────────────
  await migrateCollection(
    'methods',
    ['title', 'auszug', 'zielDerMethode', 'wannSinnvoll', 'wannNichtSinnvoll', 'vorbereitung', 'durchfuehrung', 'auswertung', 'tipps', 'ungeeignetFuer'].map(
      (target) => ({ target, de: target, en: `${target}En` }),
    ),
  )

  // ── Filter collections + categories (nameDe/nameEn → name) ───────────────
  const NAME_COLLECTIONS = [
    'participation-depths',
    'project-phases',
    'project-phase-categories',
    'goals',
    'formats',
    'durations',
    'duration-categories',
    'group-sizes',
    'characteristics',
  ]
  for (const name of NAME_COLLECTIONS) {
    await migrateCollection(name, [{ target: 'name', de: 'nameDe', en: 'nameEn' }])
  }
  // target-groups also has a localized explanation
  await migrateCollection('target-groups', [
    { target: 'name', de: 'nameDe', en: 'nameEn' },
    { target: 'explanation', de: 'explanation', en: 'explanationEn' },
  ])

  // ── Platform settings global (stored in the `globals` collection) ────────
  const globals = mongoose.connection.collection('globals')
  const ps = await globals.findOne({ globalType: 'platform-settings' })
  if (ps && !isLocalized(ps.impressum)) {
    await globals.updateOne(
      { _id: ps._id },
      {
        $set: {
          impressum: { de: ps.impressumDe ?? null, en: ps.impressumEn ?? null },
          datenschutz: { de: ps.datenschutzDe ?? null, en: ps.datenschutzEn ?? null },
          kontakt: { de: ps.kontaktDe ?? null, en: ps.kontaktEn ?? null },
        },
        $unset: {
          impressumDe: '', impressumEn: '',
          datenschutzDe: '', datenschutzEn: '',
          kontaktDe: '', kontaktEn: '',
        },
      },
    )
    console.log('  platform-settings: migrated')
  } else {
    console.log('  platform-settings: skipped (none or already localized)')
  }

  console.log('\n✓ Localization migration complete.')
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * One-off migration: the Media `alt` field became localized (required in
 * German). Docs created before that store `alt` as a plain string, which the
 * localized field can no longer read. This copies every plain-string alt into
 * the German locale ({ de: <value> }) directly in MongoDB. Idempotent — docs
 * already migrated (alt is an object) are not matched. Run with:
 *
 *   npm run migrate:media-alt
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

async function run() {
  // Dynamic import: the config reads env vars at module load, which must
  // happen AFTER dotenv above (static imports would be hoisted before it).
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  const db = payload.db.connection.db
  if (!db) throw new Error('No database connection')

  const result = await db.collection('media').updateMany(
    { alt: { $type: 'string' } },
    [{ $set: { alt: { de: '$alt' } } }],
  )
  console.log(`media: migrated ${result.modifiedCount} doc(s) with plain-string alt to { de: ... }`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

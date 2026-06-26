/**
 * GET /api/methods-by-ids?ids=a,b,c&locale=de — batch-fetches published+draft
 * methods by id for the client-rendered "saved" view (which only holds ids in
 * localStorage). Locale-aware with a DE fallback.
 *
 * NOTE: no try/catch and no cap beyond `limit: 100` — a DB error surfaces as an
 * unhandled 500. Worth hardening to match /api/method-assistant before launch.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids')
  if (!ids) return NextResponse.json({ docs: [] })

  const localeParam = req.nextUrl.searchParams.get('locale')
  const locale = localeParam === 'en' ? 'en' : 'de'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { id: { in: ids.split(',') } },
    depth: 2,
    limit: 100,
    locale,
    fallbackLocale: 'de',
  })

  return NextResponse.json(result)
}

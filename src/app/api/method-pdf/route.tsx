// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

/**
 * GET /api/method-pdf?ids=a,b,c&locale=de — renders the requested published
 * methods as a downloadable PDF (one id → single-method handout, several ids →
 * collection document; order of `ids` is preserved). Fully server-side
 * (@react-pdf/renderer), text-only, standard Helvetica fonts — nothing is
 * fetched from third parties. Rate-limited per IP: PDF rendering costs CPU on
 * a public route.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { MethodsPdf } from '@/lib/pdf/MethodsPdf'
import { resolveColors } from '@/lib/theme'
import { rateLimit } from '@/lib/methodAssistant/rateLimit'
import type { Methode } from '@/types'

const MAX_IDS = 50
const RATE_LIMIT_PER_5_MIN = 30

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export async function GET(req: NextRequest) {
  const limit = rateLimit(clientIp(req), RATE_LIMIT_PER_5_MIN)
  if (!limit.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } })
  }

  const idsParam = req.nextUrl.searchParams.get('ids')
  if (!idsParam) return NextResponse.json({ error: 'missing_ids' }, { status: 400 })
  const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_IDS)
  if (ids.length === 0) return NextResponse.json({ error: 'missing_ids' }, { status: 400 })

  const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en' as const : 'de' as const

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'methods',
      // Local API bypasses access control — enforce published ourselves.
      where: { id: { in: ids }, status: { equals: 'published' } },
      depth: 2,
      limit: MAX_IDS,
      locale,
      fallbackLocale: 'de',
    })
    const docs = result.docs as unknown as Methode[]
    const methods = ids.map(id => docs.find(d => String(d.id) === id)).filter(Boolean) as Methode[]
    if (methods.length === 0) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const settings = await payload.findGlobal({ slug: 'platform-settings' as any })
    const colors = resolveColors(settings)
    const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? req.nextUrl.origin).replace(/\/$/, '')
    const now = new Date()
    const date = now.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const buffer = await renderToBuffer(
      <MethodsPdf methods={methods} locale={locale} colors={colors} baseUrl={baseUrl} date={date} />,
    )

    const stamp = now.toISOString().slice(0, 10)
    const filename = methods.length === 1
      ? `urban-kit-${methods[0].slug ?? 'methode'}.pdf`
      : `urban-kit-methoden-${stamp}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('method-pdf generation failed', err)
    return NextResponse.json({ error: 'pdf_failed' }, { status: 500 })
  }
}

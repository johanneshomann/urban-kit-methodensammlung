import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids')
  if (!ids) return NextResponse.json({ docs: [] })

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { id: { in: ids.split(',') } },
    depth: 2,
    limit: 100,
  })

  return NextResponse.json(result)
}

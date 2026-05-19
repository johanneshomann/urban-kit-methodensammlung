import FilterableMethodList from '@/components/FilterableMethodList'
import type { Methode } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'methods',
    where: {
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  const methods = result.docs as unknown as Methode[]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Method Archive</h1>
        <p className="text-gray-500">
          Discover and filter our collection of methods for urban projects.
        </p>
      </div>

      <FilterableMethodList methods={methods} />
    </div>
  )
}

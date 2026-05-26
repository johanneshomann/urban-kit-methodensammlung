import FilterableMethodList from '@/components/FilterableMethodList'
import type { Methode } from '@/types'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('home')

  const [result, iconsDoc] = await Promise.all([
    payload.find({
      collection: 'methods',
      where: { status: { equals: 'published' } },
      depth: 2,
      limit: 100,
      sort: '-createdAt',
    }),
    payload.findGlobal({ slug: 'filter-icons', depth: 1 }),
  ])

  const methods = result.docs as unknown as Methode[]

  type IconDoc = { url?: string } | null
  const filterIcons: Record<string, string | undefined> = {}
  const iconsGlobal = iconsDoc as Record<string, unknown> | undefined
  if (iconsGlobal) {
    for (const key of ['characteristics','durations','formats','goals','groupSizes','participationDepths','projectPhases','targetGroups'] as const) {
      const doc = iconsGlobal[key] as IconDoc
      if (doc?.url) filterIcons[key] = doc.url
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-[#a0a2e8] mb-6">{t('title')}</h1>
        <div className="max-w-2xl space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>{t('intro1')}</p>
          <p>{t('intro2')}</p>
          <p>{t('intro3')}</p>
          <p>{t('intro4')}</p>
          <p>{t('intro5')}</p>
        </div>
      </div>

      <FilterableMethodList methods={methods} filterIcons={filterIcons} />
    </div>
  )
}

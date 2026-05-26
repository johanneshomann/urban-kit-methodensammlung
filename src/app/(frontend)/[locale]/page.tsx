import FilterableMethodList from '@/components/FilterableMethodList'
import type { FilterItem, Methode } from '@/types'
import { FILTER_CONFIGS, type FilterKey } from '@/lib/filterConfig'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const COLLECTION_SLUGS: Record<FilterKey, string> = {
  participationDepths: 'participation-depths',
  projectPhases: 'project-phases',
  goals: 'goals',
  formats: 'formats',
  durations: 'durations',
  targetGroups: 'target-groups',
  groupSizes: 'group-sizes',
  characteristics: 'characteristics',
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('home')

  const [result, iconsDoc, ...filterResults] = await Promise.all([
    payload.find({
      collection: 'methods',
      where: { status: { equals: 'published' } },
      depth: 2,
      limit: 100,
      sort: '-createdAt',
    }),
    payload.findGlobal({ slug: 'filter-icons', depth: 1 }),
    ...FILTER_CONFIGS.map(({ key }) =>
      payload.find({ collection: COLLECTION_SLUGS[key] as any, limit: 200 })
    ),
  ])

  const allFilterItems: Record<FilterKey, FilterItem[]> = {} as Record<FilterKey, FilterItem[]>
  FILTER_CONFIGS.forEach(({ key }, i) => {
    allFilterItems[key] = filterResults[i].docs as unknown as FilterItem[]
  })

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

      <FilterableMethodList methods={methods} filterIcons={filterIcons} allFilterItems={allFilterItems} />
    </div>
  )
}

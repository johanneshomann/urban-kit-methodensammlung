import FilterableMethodList from '@/components/FilterableMethodList'
import type { CategoryItem, FilterItem, Methode } from '@/types'
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

const SETTINGS_SLUGS: Record<FilterKey, string> = {
  participationDepths: 'participation-depth-settings',
  projectPhases: 'project-phase-settings',
  goals: 'goal-settings',
  formats: 'format-settings',
  durations: 'duration-settings',
  targetGroups: 'target-group-settings',
  groupSizes: 'group-size-settings',
  characteristics: 'characteristics-settings',
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params: _params }: Props) {
  const payload = await getPayload({ config })
  const t = await getTranslations('home')

  const filterKeys = FILTER_CONFIGS.map((c) => c.key) as FilterKey[]

  const [result, projectPhaseCategoriesResult, durationCategoriesResult, ...rest] = await Promise.all([
    payload.find({
      collection: 'methods',
      where: { status: { equals: 'published' } },
      depth: 2,
      limit: 100,
      sort: '-createdAt',
    }),
    payload.find({ collection: 'project-phase-categories' as any, limit: 100 }),
    payload.find({ collection: 'duration-categories' as any, limit: 100 }),
    ...filterKeys.map((key) =>
      payload.find({ collection: COLLECTION_SLUGS[key] as any, limit: 200, depth: 1 })
    ),
    ...filterKeys.map((key) =>
      payload.findGlobal({ slug: SETTINGS_SLUGS[key] as any, depth: 1 })
    ),
  ])

  const filterResults = rest.slice(0, filterKeys.length)
  const settingsResults = rest.slice(filterKeys.length)

  const allFilterItems: Record<FilterKey, FilterItem[]> = {} as Record<FilterKey, FilterItem[]>
  filterKeys.forEach((key, i) => {
    allFilterItems[key] = filterResults[i].docs as unknown as FilterItem[]
  })

  const allCategoryItems: Partial<Record<FilterKey, CategoryItem[]>> = {
    projectPhases: projectPhaseCategoriesResult.docs as unknown as CategoryItem[],
    durations: durationCategoriesResult.docs as unknown as CategoryItem[],
  }

  type SettingsDoc = { icon?: { url?: string } | null; active?: boolean | null }
  const filterIcons: Record<string, string | undefined> = {}
  const activeFilterKeys = new Set<FilterKey>()

  filterKeys.forEach((key, i) => {
    const doc = settingsResults[i] as SettingsDoc
    if (doc?.icon?.url) filterIcons[key] = doc.icon.url
    if (doc?.active !== false) activeFilterKeys.add(key)
  })

  const methods = result.docs as unknown as Methode[]

  return (
    <div>
      <section
        className="relative flex flex-col justify-center py-16 overflow-hidden"
        style={{
          minHeight: 'calc(100svh - 5rem)',
          backgroundImage: 'radial-gradient(circle, #c8caff 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-60% to-white" />
        <div className="relative max-w-6xl mx-auto w-full px-4">
          <h1 className="font-bold text-[#a0a2e8] mb-8 leading-none" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            {t('title')}
          </h1>
          <div className="max-w-2xl space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>{t('intro1')}</p>
            <p>{t('intro2')}</p>
            <p>{t('intro3')}</p>
            <p>{t('intro4')}</p>
            <p>{t('intro5')}</p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="max-w-6xl mx-auto w-full px-4 py-8">
          <FilterableMethodList
            methods={methods}
            filterIcons={filterIcons}
            allFilterItems={allFilterItems}
            allCategoryItems={allCategoryItems}
            activeFilterKeys={activeFilterKeys}
          />
        </div>
      </div>
    </div>
  )
}

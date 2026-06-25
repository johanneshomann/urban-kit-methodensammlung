import FilterableMethodList from '@/components/FilterableMethodList'
import MethodAssistant from '@/components/MethodAssistant'
import { loadAssistantSettings } from '@/lib/methodAssistant/settings'
import type { CategoryItem, FilterItem, Methode } from '@/types'
import { FILTER_CONFIGS, type FilterKey } from '@/lib/filterConfig'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronDown, BookOpen } from 'lucide-react'
import { EyebrowBadge } from '@/components/EyebrowBadge'

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

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('home')
  const assistant = await loadAssistantSettings(locale as 'de' | 'en')

  const filterKeys = FILTER_CONFIGS.map((c) => c.key) as FilterKey[]

  const [result, projectPhaseCategoriesResult, durationCategoriesResult, ...rest] = await Promise.all([
    payload.find({
      collection: 'methods',
      where: { status: { equals: 'published' } },
      depth: 2,
      limit: 100,
      sort: '-createdAt',
      locale: locale as 'de' | 'en',
      fallbackLocale: 'de',
    }),
    payload.find({ collection: 'project-phase-categories' as any, limit: 100, locale: locale as 'de' | 'en', fallbackLocale: 'de' }),
    payload.find({ collection: 'duration-categories' as any, limit: 100, locale: locale as 'de' | 'en', fallbackLocale: 'de' }),
    ...filterKeys.map((key) =>
      payload.find({ collection: COLLECTION_SLUGS[key] as any, limit: 200, depth: 1, locale: locale as 'de' | 'en', fallbackLocale: 'de' })
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

  type SettingsDoc = { icon?: { url?: string } | null; lucideIcon?: string | null; active?: boolean | null }
  const filterIcons: Record<string, string | undefined> = {}
  const filterLucideIcons: Record<string, string | undefined> = {}
  const activeFilterKeys = new Set<FilterKey>()

  filterKeys.forEach((key, i) => {
    const doc = settingsResults[i] as SettingsDoc
    if (doc?.icon?.url) filterIcons[key] = doc.icon.url
    if (doc?.lucideIcon) filterLucideIcons[key] = doc.lucideIcon
    if (doc?.active !== false) activeFilterKeys.add(key)
  })

  const methods = result.docs as unknown as Methode[]

  return (
    <div>
      <section
        id="hero"
        className="relative flex-1 min-h-[calc(100svh-3.5rem)] flex flex-col overflow-hidden"
        style={{ background: 'var(--method-light)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-75% to-[var(--method-very-light)]" />
        <BookOpen
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-[45%] w-auto pointer-events-none"
          strokeWidth={1}
          aria-hidden="true"
          style={{ color: 'var(--method)', opacity: 0.15 }}
        />

        <a href="#methods" className="absolute bottom-6 left-6 md:left-1/2 md:-translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-text" style={{ color: 'var(--method)' }}>
            Hier beginnen
          </span>
          <ChevronDown
            className="w-14 h-14 animate-bounce"
            style={{ color: 'var(--method)' }}
            aria-label="Zu den Methoden"
          />
        </a>

        <div className="relative z-10 flex-1 flex flex-col justify-start px-6 pt-20 md:pt-28 md:px-16 lg:px-24">
          <EyebrowBadge label={t('eyebrow')} opacity={0.6} />

          <h1 className="text-hero font-black leading-none tracking-tight mb-5" style={{ color: 'var(--method-ink-accent)' }}>
            {t('title')}
          </h1>

          <p className="text-text leading-relaxed max-w-2xl" style={{ color: 'var(--method-ink)' }}>
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div id="methods" style={{ background: 'var(--method-very-light)' }}>
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16">
          <FilterableMethodList
            methods={methods}
            filterIcons={filterIcons}
            filterLucideIcons={filterLucideIcons}
            allFilterItems={allFilterItems}
            allCategoryItems={allCategoryItems}
            activeFilterKeys={activeFilterKeys}
            assistantSlot={
              assistant.configured ? <MethodAssistant enabled greeting={assistant.greeting} /> : null
            }
          />
        </div>
      </div>
    </div>
  )
}

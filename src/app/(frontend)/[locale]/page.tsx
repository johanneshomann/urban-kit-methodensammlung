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

  const result = await payload.find({
    collection: 'methods',
    locale: locale as 'en' | 'de',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </div>

      <FilterableMethodList methods={methods} />
    </div>
  )
}

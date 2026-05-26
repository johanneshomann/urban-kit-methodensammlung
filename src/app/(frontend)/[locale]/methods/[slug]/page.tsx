import SaveButton from '@/components/SaveButton'
import RichTextRenderer from '@/components/RichTextRenderer'
import type { FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { Link } from '@/navigation'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methods',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) return { title: 'Not found' }
  return { title: `${method.title} – Urban Kit` }
}

export const dynamic = 'force-dynamic'

export default async function MethodDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const payload = await getPayload({ config })
  const t = await getTranslations('methods')

  const result = await payload.find({
    collection: 'methods',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) notFound()

  const characteristics = (method.characteristics ?? []).map((c) =>
    typeof c === 'object' ? (c as FilterItem) : null,
  ).filter(Boolean) as FilterItem[]

  return (
    <div className="max-w-3xl">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        {t('allMethods')}
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{method.title}</h1>
        <SaveButton
          item={{
            id: String(method.id),
            slug: method.slug ?? '',
            title: method.title,
            characteristics: characteristics.map((c) => getLocalizedName(c, locale)),
          }}
        />
      </div>

      {characteristics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {characteristics.map((c) => (
            <span key={c.id} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {getLocalizedName(c, locale)}
            </span>
          ))}
        </div>
      )}

      {!!method.description && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h2>
          <RichTextRenderer
            content={method.description}
            className="text-gray-700 prose prose-sm max-w-none"
          />
        </section>
      )}

    </div>
  )
}

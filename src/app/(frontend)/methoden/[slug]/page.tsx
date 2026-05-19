import CartButton from '@/components/CartButton'
import RichTextRenderer from '@/components/RichTextRenderer'
import type { Methode, Tag } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'methoden',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) return { title: 'Nicht gefunden' }
  return { title: `${method.title} – Urban Kit` }
}

export const dynamic = 'force-dynamic'

export default async function MethodDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'methoden',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  const method = result.docs[0] as unknown as Methode | undefined
  if (!method) notFound()

  const tags = (method.tags ?? []).map((t) =>
    typeof t === 'object' ? (t as Tag) : null,
  ).filter(Boolean) as Tag[]

  return (
    <div className="max-w-3xl">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Alle Methoden
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{method.title}</h1>
        <CartButton
          item={{
            id: String(method.id),
            slug: method.slug ?? '',
            title: method.title,
            category: method.category ?? undefined,
            difficulty: method.difficulty ?? undefined,
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {method.category && (
          <span className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
            Kategorie {method.category}
          </span>
        )}
        {method.difficulty && (
          <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            {method.difficulty}
          </span>
        )}
        {tags.map((tag) => (
          <span key={tag.id} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            {tag.name}
          </span>
        ))}
      </div>

      {!!method.description && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h2>
          <RichTextRenderer
            content={method.description}
            className="text-gray-700 prose prose-sm max-w-none"
          />
        </section>
      )}

      {method.steps && method.steps.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Schritte</h2>
          <ol className="space-y-3">
            {method.steps.map((s, i) => (
              <li key={s.id ?? i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{s.step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

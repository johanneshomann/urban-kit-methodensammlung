import type { Methode, Tag } from '@/types'
import Link from 'next/link'
import CartButton from './CartButton'

type Props = {
  method: Methode
}

export default function MethodCard({ method }: Props) {
  const tags = Array.isArray(method.tags)
    ? method.tags.map((t) => (typeof t === 'object' ? t : null)).filter(Boolean) as Tag[]
    : []

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/methoden/${method.slug}`}
          className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug"
        >
          {method.title}
        </Link>
        <CartButton
          item={{
            id: String(method.id),
            slug: method.slug ?? '',
            title: method.title,
            tags: tags.map((t) => t.name),
          }}
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <Link href={`/methoden/${method.slug}`} className="text-xs text-blue-600 hover:underline mt-auto">
        Mehr erfahren →
      </Link>
    </div>
  )
}

import type { Methode } from '@/types'
import Link from 'next/link'
import CartButton from './CartButton'

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
}

const categoryColor: Record<string, string> = {
  A: 'bg-purple-100 text-purple-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-orange-100 text-orange-700',
}

type Props = {
  method: Methode
}

export default function MethodCard({ method }: Props) {
  const tags = Array.isArray(method.tags)
    ? method.tags.map((t) => (typeof t === 'object' ? t : null)).filter(Boolean)
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
            category: method.category ?? undefined,
            difficulty: method.difficulty ?? undefined,
          }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {method.category && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[method.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {method.category}
          </span>
        )}
        {method.difficulty && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[method.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
            {method.difficulty}
          </span>
        )}
        {tags.map((tag) => (
          <span key={tag!.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {tag!.name}
          </span>
        ))}
      </div>

      <Link href={`/methoden/${method.slug}`} className="text-xs text-blue-600 hover:underline mt-auto">
        Mehr erfahren →
      </Link>
    </div>
  )
}

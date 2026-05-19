import type { Characteristic, Methode } from '@/types'
import Link from 'next/link'
import CartButton from './CartButton'

type Props = {
  method: Methode
}

export default function MethodCard({ method }: Props) {
  const characteristics = Array.isArray(method.characteristics)
    ? method.characteristics.map((c) => (typeof c === 'object' ? c : null)).filter(Boolean) as Characteristic[]
    : []

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/methods/${method.slug}`}
          className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug"
        >
          {method.title}
        </Link>
        <CartButton
          item={{
            id: String(method.id),
            slug: method.slug ?? '',
            title: method.title,
            characteristics: characteristics.map((c) => c.name),
          }}
        />
      </div>

      {characteristics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {characteristics.map((c) => (
            <span key={c.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {c.name}
            </span>
          ))}
        </div>
      )}

      <Link href={`/methods/${method.slug}`} className="text-xs text-blue-600 hover:underline mt-auto">
        Learn more →
      </Link>
    </div>
  )
}

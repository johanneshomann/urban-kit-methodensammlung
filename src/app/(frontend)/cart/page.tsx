'use client'

import CartExport from '@/components/CartExport'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

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

export default function CartPage() {
  const { cart, remove, mounted } = useCart()

  if (!mounted) {
    return <div className="py-16 text-center text-gray-400">Laden…</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Merkliste</h1>
          <p className="text-gray-500">{cart.length} Methode{cart.length !== 1 ? 'n' : ''} gespeichert</p>
        </div>
        <CartExport items={cart} />
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Deine Merkliste ist leer.</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Methoden entdecken →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/methoden/${item.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {item.title}
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                  title="Entfernen"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {item.category && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.category}
                  </span>
                )}
                {item.difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[item.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.difficulty}
                  </span>
                )}
              </div>

              <Link
                href={`/methoden/${item.slug}`}
                className="text-xs text-blue-600 hover:underline mt-auto"
              >
                Details ansehen →
              </Link>
            </div>
          ))}
        </div>
      )}

      {cart.length > 1 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-medium text-gray-600">Methode</th>
                  <th className="text-left p-3 border border-gray-200 font-medium text-gray-600">Kategorie</th>
                  <th className="text-left p-3 border border-gray-200 font-medium text-gray-600">Schwierigkeit</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200">
                      <Link href={`/methoden/${item.slug}`} className="text-blue-600 hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="p-3 border border-gray-200">{item.category ?? '—'}</td>
                    <td className="p-3 border border-gray-200">{item.difficulty ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

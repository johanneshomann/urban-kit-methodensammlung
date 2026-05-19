'use client'

import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/lib/cart'

type Props = {
  item: CartItem
}

export default function CartButton({ item }: Props) {
  const { add, remove, inCart, mounted } = useCart()
  const saved = mounted && inCart(item.id)

  return (
    <button
      onClick={() => (saved ? remove(item.id) : add(item))}
      className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-medium ${
        saved
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-600'
      }`}
    >
      {saved ? '✓ Gespeichert' : '+ Merken'}
    </button>
  )
}

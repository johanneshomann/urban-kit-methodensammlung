'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  type CartItem,
  addToCart,
  getCart,
  isInCart,
  removeFromCart,
} from '@/lib/cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCart(getCart())
  }, [])

  const add = useCallback((item: CartItem) => {
    addToCart(item)
    setCart(getCart())
  }, [])

  const remove = useCallback((id: string) => {
    removeFromCart(id)
    setCart(getCart())
  }, [])

  const inCart = useCallback(
    (id: string) => (mounted ? isInCart(id) : false),
    [mounted],
  )

  return { cart, add, remove, inCart, mounted }
}

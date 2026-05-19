const CART_KEY = 'uk-cart'

export type CartItem = {
  id: string
  slug: string
  title: string
  tags?: string[]
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: CartItem): void {
  const cart = getCart()
  if (!cart.find((i) => i.id === item.id)) {
    saveCart([...cart, item])
  }
}

export function removeFromCart(id: string): void {
  saveCart(getCart().filter((i) => i.id !== id))
}

export function isInCart(id: string): boolean {
  return getCart().some((i) => i.id === id)
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
}

'use client'

import { usePathname } from '@/navigation'

/**
 * Renders the site footer, except on routes that provide their own legal links
 * (e.g. the assistant page, which puts them under the chat input).
 */
const HIDDEN_ON = new Set(['/assistant'])

export default function SiteFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (HIDDEN_ON.has(pathname)) return null
  return <footer className="border-t mt-auto">{children}</footer>
}

// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

/**
 * Route transition wrapper: fades each page in on navigation (globals.css
 * `.page-in`). Keyed by the full pathname because a bare template does not
 * re-mount when only a dynamic param changes (method → method navigation).
 * Disabled via prefers-reduced-motion in CSS.
 */
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  )
}

'use client'

import { Link, useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Bottom sidebar section (rendered via afterNavLinks): plain links for
 * Platform Settings and the Documentation view, set off by a divider.
 */
export function BottomNav() {
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const pathname = usePathname()

  const admin = config.routes.admin
  const de = i18n.language === 'de'
  const isAdmin = (user as { role?: string } | null)?.role === 'admin'

  const items = [
    // Platform Settings and the legal texts — admins only.
    ...(isAdmin
      ? [
          {
            id: 'nav-platform-settings',
            href: `${admin}/globals/platform-settings`,
            label: de ? 'Plattform-Einstellungen' : 'Platform Settings',
          },
          {
            id: 'nav-legal',
            href: `${admin}/globals/legal`,
            label: de ? 'Rechtliches' : 'Legal',
          },
          {
            id: 'nav-assistant',
            href: `${admin}/globals/assistant`,
            label: de ? 'Assistent' : 'Assistant',
          },
        ]
      : []),
    {
      id: 'nav-documentation',
      href: `${admin}/dokumentation`,
      label: de ? 'Dokumentation' : 'Documentation',
    },
  ]

  return (
    <div className="uk-bottom-nav">
      {items.map(({ id, href, label }) => {
        const isActive = pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
        const Label = (
          <>
            {isActive && <div className="nav__link-indicator" />}
            <span className="nav__link-label">{label}</span>
          </>
        )
        return pathname === href ? (
          <div className="nav__link" id={id} key={id}>
            {Label}
          </div>
        ) : (
          <Link className="nav__link" href={href} id={id} key={id} prefetch={false}>
            {Label}
          </Link>
        )
      })}
    </div>
  )
}

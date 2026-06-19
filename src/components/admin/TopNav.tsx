'use client'

import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Top sidebar item (rendered via beforeNavLinks): the Methods collection as a
 * plain link instead of a single-item dropdown.
 */
export function TopNav() {
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const pathname = usePathname()

  const admin = config.routes.admin
  const de = i18n.language === 'de'

  const href = `${admin}/collections/methods`
  const id = 'nav-methods'
  const label = de ? 'Methodensammlung' : 'Methods Archive'

  const isActive = pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
  const Label = (
    <>
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">{label}</span>
    </>
  )

  return (
    <div className="uk-top-nav">
      {pathname === href ? (
        <div className="nav__link" id={id}>
          {Label}
        </div>
      ) : (
        <Link className="nav__link" href={href} id={id} prefetch={false}>
          {Label}
        </Link>
      )}
    </div>
  )
}

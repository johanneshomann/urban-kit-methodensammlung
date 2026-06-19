import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import React from 'react'
import { DocumentationContent } from './DocumentationContent'

export function Documentation({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  const lang = req.i18n.language === 'de' ? 'de' : 'en'

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      req={req}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <DocumentationContent lang={lang} />
    </DefaultTemplate>
  )
}

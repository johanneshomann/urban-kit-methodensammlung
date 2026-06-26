// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useRowLabel } from '@payloadcms/ui'

type RowData = { sectionTitle?: string }

export function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<RowData>()
  const title = data?.sectionTitle?.trim()
  const fallback = `Abschnitt ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  return <span>{title || fallback}</span>
}

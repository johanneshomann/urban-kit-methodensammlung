// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useFormFields } from '@payloadcms/ui'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = { path: string }

export function LucideIconPreview({ path }: Props) {
  const value = useFormFields(([fields]) => fields[path]?.value as string | undefined)

  if (!value) return null

  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[value]

  if (!Icon) {
    return (
      <div style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>
        Icon &quot;{value}&quot; not found — check lucide.dev
      </div>
    )
  }

  return (
    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280' }}>
      <Icon size={20} strokeWidth={1.5} />
      <span style={{ fontSize: 12 }}>{value}</span>
    </div>
  )
}

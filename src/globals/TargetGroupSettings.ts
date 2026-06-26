// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { GlobalConfig } from 'payload'

// Per-filter display settings — same shape as the other `*Settings` globals.
// See CharacteristicsSettings.ts for the shared rationale + factory note.
export const TargetGroupSettings: GlobalConfig = {
  slug: 'target-group-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Filter: Target Groups', de: 'Filter: Zielgruppen' },
  },
  fields: [
    {
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'lucideIcon',
      label: { en: 'Lucide Icon', de: 'Lucide Icon' },
      type: 'text',
      defaultValue: 'Users',
      admin: {
        description: { en: 'Fallback icon name from lucide.dev (e.g. "Clock")', de: 'Fallback Icon-Name von lucide.dev (z.B. "Clock")' },
        components: { afterInput: ['@/components/admin/LucideIconPreview#LucideIconPreview'] },
      },
    },
        {
      name: 'active',
      label: { en: 'Active', de: 'Aktiv' },
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

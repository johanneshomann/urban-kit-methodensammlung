// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { CollectionConfig } from 'payload'
import { requiredTextInDefaultLocale } from '../lib/requiredInDefaultLocale'

export const TargetGroups: CollectionConfig = {
  slug: 'target-groups',
  labels: {
    singular: { en: 'Target Group', de: 'Zielgruppe' },
    plural: { en: 'Target Groups', de: 'Zielgruppen' },
  },
  admin: { useAsTitle: 'name', group: { en: 'Filter: Target Groups', de: 'Filter: Zielgruppen' } },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', de: 'Name' },
      type: 'text',
      localized: true,
      validate: requiredTextInDefaultLocale,
    },
    {
      name: 'explanation',
      type: 'textarea',
      label: { en: 'Explanation', de: 'Erläuterung' },
      localized: true,
      maxLength: 250,
      admin: { description: { en: 'Max. 250 characters', de: 'Max. 250 Zeichen' } },
    },
    {
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
      admin: { position: 'sidebar' },
    },
    {
      name: 'lucideIcon',
      label: { en: 'Lucide Icon', de: 'Lucide Icon' },
      type: 'text',
      admin: {
        position: 'sidebar',
        description: { en: 'Icon name from lucide.dev (e.g. Clock). Fallback if no icon uploaded.', de: 'Icon-Name von lucide.dev (z.B. Clock). Fallback, wenn kein Icon hochgeladen.' },
        components: { afterInput: ['@/components/admin/LucideIconPreview#LucideIconPreview'] },
      },
    },
  ],
}

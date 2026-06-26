// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { CollectionConfig } from 'payload'
import { requiredTextInDefaultLocale } from '../lib/requiredInDefaultLocale'

export const ParticipationDepths: CollectionConfig = {
  slug: 'participation-depths',
  labels: {
    singular: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
    plural: { en: 'Participation Depths', de: 'Beteiligungstiefen' },
  },
  admin: { useAsTitle: 'name', group: { en: 'Filter: Participation Depth', de: 'Filter: Beteiligungstiefe' } },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', de: 'Name' },
      type: 'text',
      localized: true,
      validate: requiredTextInDefaultLocale,
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

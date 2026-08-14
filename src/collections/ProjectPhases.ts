// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { CollectionConfig } from 'payload'
import { requiredTextInDefaultLocale } from '../lib/requiredInDefaultLocale'

export const ProjectPhases: CollectionConfig = {
  slug: 'project-phases',
  labels: {
    singular: { en: 'Project Phase', de: 'Projektphase' },
    plural: { en: 'Project Phases', de: 'Projektphasen' },
  },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category'], group: { en: 'Filter: Project Phases', de: 'Filter: Projektphasen' } },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', de: 'Name' },
      type: 'text',
      localized: true,
      validate: requiredTextInDefaultLocale,
    },
    {
      // Stable machine identifier — external consumers (e.g. the UrbanKIT
      // platform's phase-based method suggestions) match phases by this slug,
      // so renaming the display name never breaks the integration.
      name: 'slug',
      label: { en: 'Slug (stable ID)', de: 'Slug (stabile ID)' },
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Stable identifier for external integrations (the UrbanKIT platform matches phases by this slug). Do not change once set.',
          de: 'Stabile Kennung für externe Integrationen (die UrbanKIT-Plattform ordnet Phasen über diesen Slug zu). Nach dem Setzen nicht mehr ändern.',
        },
      },
    },
    {
      name: 'category',
      label: { en: 'Category', de: 'Kategorie' },
      type: 'relationship',
      relationTo: 'project-phase-categories',
      required: true,
      admin: { position: 'sidebar' },
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
        description: { en: 'Icon name from lucide.dev (e.g. "Play"). Fallback if no icon uploaded.', de: 'Icon-Name von lucide.dev (z.B. "Play"). Fallback, wenn kein Icon hochgeladen.' },
        components: { afterInput: ['@/components/admin/LucideIconPreview#LucideIconPreview'] },
      },
    },
  ],
}

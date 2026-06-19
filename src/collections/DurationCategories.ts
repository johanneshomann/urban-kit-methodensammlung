import type { CollectionConfig } from 'payload'
import { requiredTextInDefaultLocale } from '../lib/requiredInDefaultLocale'

export const DurationCategories: CollectionConfig = {
  slug: 'duration-categories',
  labels: {
    singular: { en: 'Duration Category', de: 'Zeitrahmen-Kategorie' },
    plural: { en: 'Duration Categories', de: 'Zeitrahmen-Kategorien' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    group: { en: 'Filter: Durations', de: 'Filter: Zeitrahmen' },
  },
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

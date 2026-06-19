import type { CollectionConfig } from 'payload'
import { requiredTextInDefaultLocale } from '../lib/requiredInDefaultLocale'

export const Durations: CollectionConfig = {
  slug: 'durations',
  labels: {
    singular: { en: 'Duration', de: 'Dauer' },
    plural: { en: 'Durations', de: 'Zeitrahmen' },
  },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category'], group: { en: 'Filter: Durations', de: 'Filter: Zeitrahmen' } },
  fields: [
    {
      name: 'name',
      label: { en: 'Name', de: 'Name' },
      type: 'text',
      localized: true,
      validate: requiredTextInDefaultLocale,
    },
    {
      name: 'category',
      label: { en: 'Category', de: 'Kategorie' },
      type: 'relationship',
      relationTo: 'duration-categories',
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
        description: { en: 'Icon name from lucide.dev (e.g. Clock). Fallback if no icon uploaded.', de: 'Icon-Name von lucide.dev (z.B. Clock). Fallback, wenn kein Icon hochgeladen.' },
        components: { afterInput: ['@/components/admin/LucideIconPreview#LucideIconPreview'] },
      },
    },
  ],
}

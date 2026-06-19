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

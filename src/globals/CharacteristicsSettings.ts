import type { GlobalConfig } from 'payload'

export const CharacteristicsSettings: GlobalConfig = {
  slug: 'characteristics-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Filter: Characteristics', de: 'Filter: Merkmale' },
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
      defaultValue: 'Tags',
      admin: {
        description: { en: 'Fallback icon name from lucide.dev (e.g. "Star")', de: 'Fallback Icon-Name von lucide.dev (z.B. "Star")' },
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

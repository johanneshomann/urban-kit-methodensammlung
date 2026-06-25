import type { GlobalConfig } from 'payload'

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

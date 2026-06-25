import type { GlobalConfig } from 'payload'

export const GroupSizeSettings: GlobalConfig = {
  slug: 'group-size-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Filter: Group Sizes', de: 'Filter: Gruppengrößen' },
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
      defaultValue: 'UsersRound',
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

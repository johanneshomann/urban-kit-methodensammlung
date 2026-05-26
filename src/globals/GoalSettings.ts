import type { GlobalConfig } from 'payload'

export const GoalSettings: GlobalConfig = {
  slug: 'goal-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Goals', de: 'Ziele' },
  },
  fields: [
    {
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
    },
    {
      name: 'active',
      label: { en: 'Active', de: 'Aktiv' },
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

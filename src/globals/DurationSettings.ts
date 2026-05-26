import type { GlobalConfig } from 'payload'

export const DurationSettings: GlobalConfig = {
  slug: 'duration-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Durations', de: 'Zeitrahmen' },
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

import type { GlobalConfig } from 'payload'

export const FormatSettings: GlobalConfig = {
  slug: 'format-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Formats', de: 'Formate' },
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

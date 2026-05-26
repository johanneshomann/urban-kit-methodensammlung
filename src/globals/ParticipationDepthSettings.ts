import type { GlobalConfig } from 'payload'

export const ParticipationDepthSettings: GlobalConfig = {
  slug: 'participation-depth-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
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

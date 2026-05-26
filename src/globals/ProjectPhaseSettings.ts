import type { GlobalConfig } from 'payload'

export const ProjectPhaseSettings: GlobalConfig = {
  slug: 'project-phase-settings',
  label: { en: 'Settings', de: 'Einstellungen' },
  admin: {
    group: { en: 'Project Phases', de: 'Projektphasen' },
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

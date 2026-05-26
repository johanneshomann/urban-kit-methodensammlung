import type { CollectionConfig } from 'payload'

export const ProjectPhases: CollectionConfig = {
  slug: 'project-phases',
  labels: {
    singular: { en: 'Project Phase', de: 'Projektphase' },
    plural: { en: 'Project Phases', de: 'Projektphasen' },
  },
  admin: { useAsTitle: 'nameDe', defaultColumns: ['nameDe', 'category'], group: { en: 'Filter Collections', de: 'Filter' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'DE',
          fields: [{ name: 'nameDe', label: { en: 'Name', de: 'Name' }, type: 'text', required: true }],
        },
        {
          label: 'EN',
          fields: [{ name: 'nameEn', label: { en: 'Name', de: 'Name' }, type: 'text' }],
        },
      ],
    },
    {
      name: 'category',
      label: { en: 'Category', de: 'Kategorie' },
      type: 'select',
      required: true,
      options: [
        { label: { en: 'Preparation', de: 'Vorbereitung' }, value: 'preparation' },
        { label: { en: 'Implementation', de: 'Durchführung' }, value: 'implementation' },
        { label: { en: 'Follow-up', de: 'Nachbereitung' }, value: 'follow-up' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

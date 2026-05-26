import type { CollectionConfig } from 'payload'

export const ProjectPhaseCategories: CollectionConfig = {
  slug: 'project-phase-categories',
  labels: {
    singular: { en: 'Project Phase Category', de: 'Projektphasen-Kategorie' },
    plural: { en: 'Project Phase Categories', de: 'Projektphasen-Kategorien' },
  },
  admin: {
    useAsTitle: 'nameDe',
    defaultColumns: ['nameDe', 'nameEn'],
    group: { en: 'Project Phases', de: 'Projektphasen' },
  },
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
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
      admin: { position: 'sidebar' },
    },
  ],
}

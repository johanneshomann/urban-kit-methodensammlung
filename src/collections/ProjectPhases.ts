import type { CollectionConfig } from 'payload'

export const ProjectPhases: CollectionConfig = {
  slug: 'project-phases',
  labels: {
    singular: 'Project Phase',
    plural: 'Project Phases',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
    group: 'Filter Collections',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Preparation', value: 'preparation' },
        { label: 'Implementation', value: 'implementation' },
        { label: 'Follow-up', value: 'follow-up' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

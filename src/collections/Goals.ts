import type { CollectionConfig } from 'payload'

export const Goals: CollectionConfig = {
  slug: 'goals',
  labels: {
    singular: 'Goal',
    plural: 'Goals',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Filter Collections',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

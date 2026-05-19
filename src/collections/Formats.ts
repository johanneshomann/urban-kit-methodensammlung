import type { CollectionConfig } from 'payload'

export const Formats: CollectionConfig = {
  slug: 'formats',
  labels: {
    singular: 'Format',
    plural: 'Formats',
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

import type { CollectionConfig } from 'payload'

export const Durations: CollectionConfig = {
  slug: 'durations',
  labels: {
    singular: 'Duration',
    plural: 'Durations',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'category'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Short', value: 'short' },
        { label: 'Medium', value: 'medium' },
        { label: 'Long', value: 'long' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

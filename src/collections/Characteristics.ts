import type { CollectionConfig } from 'payload'

export const Characteristics: CollectionConfig = {
  slug: 'characteristics',
  labels: {
    singular: 'Characteristic',
    plural: 'Characteristics',
  },
  admin: {
    useAsTitle: 'name',
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

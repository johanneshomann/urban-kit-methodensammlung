import type { CollectionConfig } from 'payload'

export const GroupSizes: CollectionConfig = {
  slug: 'group-sizes',
  labels: {
    singular: 'Group Size',
    plural: 'Group Sizes',
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

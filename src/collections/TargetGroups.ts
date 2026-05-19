import type { CollectionConfig } from 'payload'

export const TargetGroups: CollectionConfig = {
  slug: 'target-groups',
  labels: {
    singular: 'Target Group',
    plural: 'Target Groups',
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
    {
      name: 'explanation',
      type: 'richText',
      label: 'Explanation',
    },
  ],
}

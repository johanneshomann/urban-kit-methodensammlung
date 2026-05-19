import type { CollectionConfig } from 'payload'

export const ParticipationDepths: CollectionConfig = {
  slug: 'participation-depths',
  labels: {
    singular: 'Participation Depth',
    plural: 'Participation Depths',
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

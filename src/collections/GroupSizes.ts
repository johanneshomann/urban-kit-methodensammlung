import type { CollectionConfig } from 'payload'

export const GroupSizes: CollectionConfig = {
  slug: 'group-sizes',
  labels: { singular: 'Group Size', plural: 'Group Sizes' },
  admin: { useAsTitle: 'name', group: 'Filter Collections' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Sprache oben wechseln um zu übersetzen · Switch language above to translate' },
    },
  ],
}

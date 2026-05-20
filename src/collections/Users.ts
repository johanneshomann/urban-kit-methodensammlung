import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: {
    singular: { en: 'User', de: 'Benutzer' },
    plural: { en: 'Users', de: 'Benutzer' },
  },
  admin: {
    useAsTitle: 'email',
    group: { en: 'Administration', de: 'Administration' },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [{ label: 'Admin', value: 'admin' }],
      defaultValue: 'admin',
      required: true,
    },
  ],
}

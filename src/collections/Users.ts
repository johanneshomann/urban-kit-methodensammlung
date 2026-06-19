import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: adminOnlyCollection,
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
      options: [
        { label: { en: 'Admin', de: 'Admin' }, value: 'admin' },
        { label: { en: 'Editor', de: 'Redakteur:in' }, value: 'editor' },
      ],
      defaultValue: 'admin',
      required: true,
      admin: {
        description: {
          en: 'Admin: full access. Editor: methods and filters only — no users, API clients or legal texts.',
          de: 'Admin: voller Zugriff. Redakteur:in: nur Methoden und Filter – keine Benutzer, API-Clients oder rechtlichen Texte.',
        },
      },
    },
  ],
}

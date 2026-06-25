import type { CollectionConfig } from 'payload'
import { usersCollectionAccess, adminFieldAccess } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: usersCollectionAccess,
  labels: {
    singular: { en: 'User', de: 'Benutzer' },
    plural: { en: 'Users', de: 'Benutzer' },
  },
  admin: {
    useAsTitle: 'email',
    group: { en: 'Administration', de: 'Administration' },
    // Editors can still reach their own account page, but the user list stays
    // hidden from their nav — only admins manage users.
    hidden: ({ user }) => (user as { role?: string } | null | undefined)?.role !== 'admin',
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
      // Only admins may set/change a role — prevents an editor self-escalating.
      access: { create: adminFieldAccess, update: adminFieldAccess },
      admin: {
        description: {
          en: 'Admin: full access. Editor: methods and filters only — no users, API clients or legal texts.',
          de: 'Admin: voller Zugriff. Redakteur:in: nur Methoden und Filter – keine Benutzer, API-Clients oder rechtlichen Texte.',
        },
      },
    },
  ],
}

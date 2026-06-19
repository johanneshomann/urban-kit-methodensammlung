import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/access'

/**
 * Read-only API keys for external integrations.
 *
 * `useAPIKey` adds Payload's built-in "Enable API Key" + generate control to
 * each record. `disableLocalStrategy` removes email/password — these records
 * authenticate ONLY via their API key (no admin login). Writes everywhere are
 * locked to admin users, so a key can read content but never change it.
 *
 * Usage: send `Authorization: api-clients API-Key <key>` with each request.
 */
export const ApiClients: CollectionConfig = {
  slug: 'api-clients',
  labels: {
    singular: { en: 'API Client', de: 'API-Client' },
    plural: { en: 'API Clients', de: 'API-Clients' },
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  access: adminOnlyCollection,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'enableAPIKey', 'updatedAt'],
    group: { en: 'Administration', de: 'Administration' },
    description: {
      en: 'Read-only API keys for external integrations. Enable a key per client, then send it in the Authorization header.',
      de: 'Schreibgeschützte API-Schlüssel für externe Integrationen. Pro Client einen Schlüssel aktivieren und im Authorization-Header senden.',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Name', de: 'Name' },
      admin: { description: { en: 'Identifies the integration this key is for (e.g. “Partner website”).', de: 'Bezeichnung der Integration, für die der Schlüssel gilt (z. B. „Partner-Website“).' } },
    },
    {
      name: 'note',
      type: 'textarea',
      label: { en: 'Note', de: 'Notiz' },
      admin: { description: { en: 'Optional: who uses it, contact, purpose.', de: 'Optional: wer ihn nutzt, Kontakt, Zweck.' } },
    },
  ],
}

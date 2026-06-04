import type { GlobalConfig } from 'payload'

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: { en: 'Platform Settings', de: 'Plattform-Einstellungen' },
  admin: {
    group: { en: 'Platform', de: 'Plattform' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Impressum', de: 'Impressum' },
          fields: [
            {
              name: 'impressumDe',
              type: 'richText',
              label: { en: 'Content (German)', de: 'Inhalt (Deutsch)' },
            },
            {
              name: 'impressumEn',
              type: 'richText',
              label: { en: 'Content (English)', de: 'Inhalt (Englisch)' },
            },
          ],
        },
        {
          label: { en: 'Privacy Policy', de: 'Datenschutz' },
          fields: [
            {
              name: 'datenschutzDe',
              type: 'richText',
              label: { en: 'Content (German)', de: 'Inhalt (Deutsch)' },
            },
            {
              name: 'datenschutzEn',
              type: 'richText',
              label: { en: 'Content (English)', de: 'Inhalt (Englisch)' },
            },
          ],
        },
        {
          label: { en: 'Contact', de: 'Kontakt' },
          fields: [
            {
              name: 'kontaktEmail',
              type: 'email',
              label: { en: 'Email address', de: 'E-Mail-Adresse' },
            },
            {
              name: 'kontaktDe',
              type: 'richText',
              label: { en: 'Content (German)', de: 'Inhalt (Deutsch)' },
            },
            {
              name: 'kontaktEn',
              type: 'richText',
              label: { en: 'Content (English)', de: 'Inhalt (Englisch)' },
            },
          ],
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

/**
 * Legal texts shown on the public site: imprint, privacy policy and the cookie
 * policy. Each is a localized rich-text field, edited under its own tab.
 */
export const Legal: GlobalConfig = {
  slug: 'legal',
  label: { en: 'Legal', de: 'Rechtliches' },
  admin: {
    // Rendered as a plain link via the nav; `false` keeps it out of the default
    // grouping while keeping its route accessible.
    group: false,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Imprint', de: 'Impressum' },
          fields: [
            {
              name: 'impressum',
              type: 'richText',
              localized: true,
              label: { en: 'Content', de: 'Inhalt' },
            },
          ],
        },
        {
          label: { en: 'Privacy Policy', de: 'Datenschutz' },
          fields: [
            {
              name: 'datenschutz',
              type: 'richText',
              localized: true,
              label: { en: 'Content', de: 'Inhalt' },
            },
          ],
        },
        {
          label: { en: 'Cookie Policy', de: 'Cookie-Richtlinie' },
          fields: [
            {
              name: 'cookies',
              type: 'richText',
              localized: true,
              label: { en: 'Content', de: 'Inhalt' },
            },
          ],
        },
      ],
    },
  ],
}

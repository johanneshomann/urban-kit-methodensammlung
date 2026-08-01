// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

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
        {
          label: { en: 'Accessibility Statement', de: 'Barrierefreiheit' },
          fields: [
            {
              name: 'barrierefreiheit',
              type: 'richText',
              localized: true,
              label: { en: 'Content', de: 'Inhalt' },
              admin: {
                description: {
                  de: 'Erklärung zur Barrierefreiheit nach BITV 2.0 / EU-Mustererklärung. Platzhalter in eckigen Klammern (Feedback-Adresse, zuständige Ombudsstelle) bitte ergänzen.',
                  en: 'Accessibility statement per BITV 2.0 / the EU model declaration. Please fill in the bracketed placeholders (feedback address, responsible enforcement body).',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}

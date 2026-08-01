// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { GlobalConfig, Field } from 'payload'
import { COLOR_DEFAULTS } from '@/lib/theme'

/**
 * A brand color field rendered with the native color-picker UI. Empty falls
 * back to the per-field default in src/lib/theme.ts when injected into the
 * public site, so partial customization is safe.
 */
const colorField = (
  name: string,
  label: { en: string; de: string },
  defaultValue: string,
  description: { en: string; de: string },
): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    placeholder: defaultValue,
    description,
    components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
  },
})

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  label: { en: 'Platform Settings', de: 'Plattform-Einstellungen' },
  admin: {
    // Rendered as a plain link via BottomNav (afterNavLinks); `false` removes it
    // from the default nav grouping while keeping its route accessible.
    group: false,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Colors', de: 'Farben' },
          description: {
            en: 'Brand and text colors for the public site. Leave a field empty to use its default. Changes apply on the next page load.',
            de: 'Marken- und Textfarben der öffentlichen Seite. Ein leeres Feld nutzt den Standardwert. Änderungen greifen beim nächsten Seitenaufruf.',
          },
          fields: [
            colorField('colorMethodMain', { en: 'Main / Primary', de: 'Haupt / Primär' }, COLOR_DEFAULTS.methodMain, {
              en: 'Primary brand color — the "KIT" accent and key UI highlights.',
              de: 'Primäre Markenfarbe — der „KIT“-Akzent und zentrale UI-Highlights.',
            }),
            colorField('colorMethodAccent', { en: 'Accent', de: 'Akzent' }, COLOR_DEFAULTS.methodAccent, {
              en: 'Secondary accent for hovers and highlights.',
              de: 'Sekundärer Akzent für Hover-Zustände und Hervorhebungen.',
            }),
            colorField('colorMethodDark', { en: 'Dark', de: 'Dunkel' }, COLOR_DEFAULTS.methodDark, {
              en: 'Darkest brand shade for strong accents.',
              de: 'Dunkelste Markenschattierung für kräftige Akzente.',
            }),
            colorField('colorMethodLight', { en: 'Light', de: 'Hell' }, COLOR_DEFAULTS.methodLight, {
              en: 'Light brand tint — also used for all borders.',
              de: 'Heller Markenton — wird auch für alle Rahmen verwendet.',
            }),
            colorField('colorMethodVeryLight', { en: 'Very Light', de: 'Sehr hell' }, COLOR_DEFAULTS.methodVeryLight, {
              en: 'Recessed section and background surfaces.',
              de: 'Zurückgesetzte Abschnitts- und Hintergrundflächen.',
            }),
            colorField('colorInk', { en: 'Body text', de: 'Fließtext' }, COLOR_DEFAULTS.ink, {
              en: 'Default body copy color.',
              de: 'Standardfarbe für Fließtext.',
            }),
            colorField('colorInkAccent', { en: 'Heading text', de: 'Überschriften' }, COLOR_DEFAULTS.inkAccent, {
              en: 'Color for all headings (h1–h6).',
              de: 'Farbe für alle Überschriften (h1–h6).',
            }),
            {
              name: 'resetColors',
              type: 'ui',
              admin: { components: { Field: '@/components/admin/ColorResetButton#ColorResetButton' } },
            },
          ],
        },
        {
          label: { en: 'Branding', de: 'Identität' },
          description: {
            en: 'Logo, favicon and sharing image. Leave a field empty to use the built-in default.',
            de: 'Logo, Favicon und Vorschaubild. Ein leeres Feld nutzt den mitgelieferten Standardwert.',
          },
          fields: [
            {
              name: 'adminLogo',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Admin logo', de: 'Admin-Logo' },
              admin: {
                description: {
                  en: 'Shown in the admin panel (login screen + navigation). SVG or PNG recommended. Default: built-in Urban Kit logo.',
                  de: 'Wird im Admin-Bereich angezeigt (Login + Navigation). SVG oder PNG empfohlen. Standard: integriertes Urban-Kit-Logo.',
                },
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Favicon', de: 'Favicon' },
              admin: {
                description: {
                  en: 'Browser tab icon for the public site. Square SVG or PNG (e.g. 64×64 or 512×512). Default: built-in icon.',
                  de: 'Symbol im Browser-Tab der öffentlichen Seite. Quadratisches SVG oder PNG (z. B. 64×64 oder 512×512). Standard: integriertes Symbol.',
                },
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Sharing image (Open Graph)', de: 'Vorschaubild (Open Graph)' },
              admin: {
                description: {
                  en: 'Preview image shown when a page is shared (social / chat). JPG or PNG at 1200×630 recommended. Default: built-in image.',
                  de: 'Vorschaubild beim Teilen einer Seite (Social / Chat). JPG oder PNG mit 1200×630 empfohlen. Standard: integriertes Bild.',
                },
              },
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
              name: 'kontakt',
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

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
        {
          label: { en: 'Mail', de: 'E-Mail' },
          description: {
            en: 'Settings for the contact form. SMTP credentials are configured via environment variables on the server.',
            de: 'Einstellungen für das Kontaktformular. Die SMTP-Zugangsdaten werden serverseitig über Umgebungsvariablen konfiguriert.',
          },
          fields: [
            {
              name: 'mailEnabled',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Enable contact form sending', de: 'Versand über Kontaktformular aktivieren' },
              admin: {
                description: {
                  en: 'When off, the contact form is disabled and no emails are sent.',
                  de: 'Wenn deaktiviert, ist das Kontaktformular gesperrt und es werden keine E-Mails versendet.',
                },
              },
            },
            {
              name: 'mailRecipient',
              type: 'email',
              label: { en: 'Recipient address', de: 'Empfänger-Adresse' },
              admin: {
                description: {
                  en: 'Where contact form submissions are delivered. Falls back to the contact email address if empty.',
                  de: 'Wohin Kontaktanfragen zugestellt werden. Fällt auf die Kontakt-E-Mail-Adresse zurück, wenn leer.',
                },
              },
            },
            {
              name: 'mailFromName',
              type: 'text',
              label: { en: 'Sender display name', de: 'Anzeigename des Absenders' },
              admin: {
                description: {
                  en: 'Optional. Overrides the default sender name (SMTP_FROM_NAME) for contact emails.',
                  de: 'Optional. Überschreibt den Standard-Absendernamen (SMTP_FROM_NAME) für Kontakt-E-Mails.',
                },
              },
            },
            {
              name: 'mailSubjectPrefix',
              type: 'text',
              label: { en: 'Subject prefix', de: 'Betreff-Präfix' },
              admin: {
                placeholder: '[Urban Kit Kontakt]',
                description: {
                  en: 'Optional. Prepended to the email subject, e.g. "[Urban Kit Kontakt]".',
                  de: 'Optional. Wird dem Betreff vorangestellt, z. B. „[Urban Kit Kontakt]“.',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}

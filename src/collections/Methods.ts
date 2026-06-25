import type { CollectionConfig } from 'payload'
import {
  requiredArrayInDefaultLocale,
  requiredTextInDefaultLocale,
  requiredValueInDefaultLocale,
} from '../lib/requiredInDefaultLocale'

const sectionFields = [
  {
    name: 'sectionTitle',
    type: 'text' as const,
    label: { en: 'Title', de: 'Titel' },
    admin: { description: { en: 'Heading for this section (e.g. “Step 1”).', de: 'Überschrift des Abschnitts (z. B. „Schritt 1“).' } },
  },
  {
    name: 'content',
    type: 'richText' as const,
    label: { en: 'Content', de: 'Inhalt' },
    admin: { description: { en: 'Content of this section.', de: 'Inhalt dieses Abschnitts.' } },
  },
]

const sectionArrayAdmin = {
  initCollapsed: true,
  components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
}

export const Methods: CollectionConfig = {
  slug: 'methods',
  labels: {
    singular: { en: 'Method', de: 'Methode' },
    plural: { en: 'Methods', de: 'Methoden' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'characteristics', 'status', 'updatedAt'],
    // Rendered as a plain link via TopNav (beforeNavLinks); `false` removes it
    // from the default nav grouping while keeping its route accessible.
    group: false,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Allgemein ───────────────────────────────────────────────────────
        {
          label: { en: 'General', de: 'Allgemein' },
          fields: [
            {
              name: 'status',
              type: 'select',
              label: { en: 'Status', de: 'Status' },
              options: [
                { label: { en: 'Draft', de: 'Entwurf' }, value: 'draft' },
                { label: { en: 'Published', de: 'Veröffentlicht' }, value: 'published' },
              ],
              defaultValue: 'draft',
              required: true,
              admin: {
                description: { en: 'Only “Published” appears on the website; “Draft” stays hidden.', de: 'Nur „Veröffentlicht“ erscheint auf der Website; „Entwurf“ bleibt verborgen.' },
              },
            },
            {
              name: 'title',
              type: 'text',
              label: { en: 'Title', de: 'Titel' },
              localized: true,
              validate: requiredTextInDefaultLocale,
              admin: { description: { en: 'Name of the method — shown on the card, the detail page and in the URL.', de: 'Name der Methode – erscheint auf der Karte, der Detailseite und in der URL.' } },
            },
            {
              name: 'auszug',
              type: 'textarea',
              label: { en: 'Excerpt', de: 'Auszug' },
              localized: true,
              validate: requiredTextInDefaultLocale,
              admin: { description: { en: 'Short 1–2 sentence summary for the method card.', de: 'Kurze Zusammenfassung in 1–2 Sätzen für die Methodenkarte.' } },
            },
            {
              name: 'zielDerMethode',
              type: 'richText',
              label: { en: 'Goal of the method', de: 'Ziel der Methode' },
              localized: true,
              validate: requiredValueInDefaultLocale,
              admin: { description: { en: 'What the method helps you achieve — in 1–2 sentences.', de: 'Was sich mit der Methode erreichen lässt – in 1–2 Sätzen.' } },
            },
          ],
        },
        // ── Ablauf ──────────────────────────────────────────────────────────
        {
          label: { en: 'Procedure', de: 'Ablauf' },
          fields: [
            {
              name: 'vorbereitung',
              type: 'array',
              label: { en: 'Preparation', de: 'Vorbereitung' },
              localized: true,
              validate: requiredArrayInDefaultLocale,
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: { ...sectionArrayAdmin, description: { en: 'What to do beforehand. Each section has a title + content; reorder by drag-and-drop.', de: 'Was vorab zu tun ist. Pro Abschnitt Titel + Inhalt, per Drag-and-drop sortierbar.' } },
              fields: sectionFields,
            },
            {
              name: 'durchfuehrung',
              type: 'array',
              label: { en: 'Execution', de: 'Durchführung' },
              localized: true,
              validate: requiredArrayInDefaultLocale,
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: { ...sectionArrayAdmin, description: { en: 'The actual procedure of the method, step by step.', de: 'Der eigentliche Ablauf der Methode, Schritt für Schritt.' } },
              fields: sectionFields,
            },
            {
              name: 'auswertung',
              type: 'array',
              label: { en: 'Evaluation', de: 'Auswertung' },
              localized: true,
              validate: requiredArrayInDefaultLocale,
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: { ...sectionArrayAdmin, description: { en: 'Follow-up, reflection and securing the results.', de: 'Nachbereitung, Reflexion und Sicherung der Ergebnisse.' } },
              fields: sectionFields,
            },
          ],
        },
        // ── Hinweise ────────────────────────────────────────────────────────
        {
          label: { en: 'Notes', de: 'Hinweise' },
          fields: [
            { name: 'wannSinnvoll', type: 'richText', label: { en: 'When useful?', de: 'Wann sinnvoll?' }, localized: true, admin: { description: { en: 'Situations where the method works particularly well.', de: 'In welchen Situationen die Methode besonders gut passt.' } } },
            { name: 'wannNichtSinnvoll', type: 'richText', label: { en: 'When not useful?', de: 'Wann nicht sinnvoll?' }, localized: true, admin: { description: { en: 'When the method is rather unsuitable.', de: 'Wann die Methode eher ungeeignet ist.' } } },
            { name: 'tipps', type: 'richText', label: { en: 'Tips', de: 'Tipps' }, localized: true, admin: { description: { en: 'Practical hints for a successful run.', de: 'Praktische Hinweise für eine gelungene Umsetzung.' } } },
            { name: 'ungeeignetFuer', type: 'richText', label: { en: 'Not suitable for', de: 'Ungeeignet für' }, localized: true, admin: { description: { en: 'Contexts or target groups the method is not intended for.', de: 'Kontexte oder Zielgruppen, für die die Methode nicht gedacht ist.' } } },
          ],
        },
        // ── Verknüpfungen ───────────────────────────────────────────────────
        {
          label: { en: 'Links', de: 'Verknüpfungen' },
          fields: [
            {
              name: 'aehnlicheMethoden',
              label: { en: 'Similar methods', de: 'Ähnliche Methoden' },
              type: 'relationship',
              relationTo: 'methods',
              hasMany: true,
              admin: { description: { en: 'Related methods — linked on the detail page.', de: 'Verwandte Methoden – werden auf der Detailseite verlinkt.' } },
            },
            {
              name: 'wieKannEsWeiterGehen',
              label: { en: 'What can follow?', de: 'Wie kann es weiter gehen?' },
              type: 'relationship',
              relationTo: 'methods',
              hasMany: true,
              admin: { description: { en: 'Methods that can sensibly follow (the “Afterwards” section).', de: 'Methoden, die sich sinnvoll anschließen (Abschnitt „Im Anschluss“).' } },
            },
          ],
        },
        // ── Bilder ──────────────────────────────────────────────────────────
        {
          label: { en: 'Images', de: 'Bilder' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Cover image', de: 'Titelbild' },
              admin: { description: { en: 'Cover image of the method (card and detail-page hero).', de: 'Titelbild der Methode (Karte und Detailseite-Hero).' } },
            },
            {
              name: 'gallery',
              label: { en: 'Gallery', de: 'Galerie' },
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: { en: 'Additional images for the gallery on the detail page.', de: 'Weitere Bilder zur Methode für die Galerie auf der Detailseite.' } },
            },
          ],
        },
        // ── Zuordnung (Filter) ──────────────────────────────────────────────
        {
          label: { en: 'Classification', de: 'Zuordnung' },
          description: { en: 'Filters this method appears under on the website. Multiple selection; values come from the “Filter: …” collections.', de: 'Filter, unter denen die Methode auf der Website erscheint. Mehrfachauswahl möglich; Werte stammen aus den „Filter: …“-Sammlungen.' },
          fields: [
            { name: 'participationDepths', label: { en: 'Participation Depths', de: 'Beteiligungstiefen' }, type: 'relationship', relationTo: 'participation-depths', hasMany: true, admin: { description: { en: 'How strongly participants are involved (from informing to co-deciding).', de: 'Wie stark Beteiligte einbezogen werden (informieren bis mitbestimmen).' } } },
            { name: 'projectPhases', label: { en: 'Project Phases', de: 'Projektphasen' }, type: 'relationship', relationTo: 'project-phases', hasMany: true, admin: { description: { en: 'Which project phase the method can be used in.', de: 'In welcher Projektphase die Methode einsetzbar ist.' } } },
            { name: 'goals', label: { en: 'Goals', de: 'Ziele' }, type: 'relationship', relationTo: 'goals', hasMany: true, admin: { description: { en: 'Which goal the method supports.', de: 'Welches Ziel die Methode unterstützt.' } } },
            { name: 'formats', label: { en: 'Formats', de: 'Formate' }, type: 'relationship', relationTo: 'formats', hasMany: true, admin: { description: { en: 'Analogue, digital or hybrid.', de: 'Analog, digital oder hybrid.' } } },
            { name: 'durations', label: { en: 'Durations', de: 'Zeitrahmen' }, type: 'relationship', relationTo: 'durations', hasMany: true, admin: { description: { en: 'Roughly how much time the method needs.', de: 'Wie viel Zeit die Methode ungefähr braucht.' } } },
            { name: 'targetGroups', label: { en: 'Target Groups', de: 'Zielgruppen' }, type: 'relationship', relationTo: 'target-groups', hasMany: true, admin: { description: { en: 'Which target groups the method suits.', de: 'Für welche Zielgruppen die Methode geeignet ist.' } } },
            { name: 'groupSizes', label: { en: 'Group Sizes', de: 'Gruppengrößen' }, type: 'relationship', relationTo: 'group-sizes', hasMany: true, admin: { description: { en: 'Which group size the method works for.', de: 'Für welche Gruppengröße die Methode passt.' } } },
            { name: 'characteristics', label: { en: 'Characteristics', de: 'Merkmale' }, type: 'relationship', relationTo: 'characteristics', hasMany: true, admin: { description: { en: 'Character of the method (e.g. playful, structured).', de: 'Charakter der Methode (z. B. spielerisch, strukturiert).' } } },
          ],
        },
        // ── Weiteres ────────────────────────────────────────────────────────
        {
          label: { en: 'More', de: 'Weiteres' },
          fields: [
            {
              name: 'slug',
              type: 'text',
              label: { en: 'Slug (auto-generated)', de: 'Slug (automatisch generiert)' },
              unique: true,
              index: true,
              admin: {
                description: {
                  en: 'Generated automatically from the title — used in the page URL. You can override it.',
                  de: 'Wird automatisch aus dem Titel generiert – Teil der Seiten-URL. Kann überschrieben werden.',
                },
              },
              hooks: {
                beforeValidate: [
                  ({ value, data, req }) => {
                    // Only (re)generate from the German title, and never while editing a non-default locale.
                    const localization = req?.payload?.config?.localization
                    const defaultLocale = (localization && localization.defaultLocale) || 'de'
                    if ((req?.locale ?? defaultLocale) !== defaultLocale) return value
                    const source = (value || data?.title) as string | undefined
                    if (!source) return value
                    return source
                      .toLowerCase()
                      .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] ?? c))
                      .replace(/ß/g, 'ss')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '')
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
}

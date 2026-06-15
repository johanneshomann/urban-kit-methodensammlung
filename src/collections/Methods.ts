import type { CollectionConfig } from 'payload'

export const Methods: CollectionConfig = {
  slug: 'methods',
  labels: {
    singular: { en: 'Method', de: 'Methode' },
    plural: { en: 'Methods', de: 'Methoden' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'characteristics', 'status', 'updatedAt'],
    group: { en: 'Methods Archive', de: 'Methodensammlung' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'DE',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: { en: 'Title', de: 'Titel' },
              required: true,
            },
            {
              type: 'collapsible',
              label: { en: 'Excerpt', de: 'Auszug' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'auszug',
                  type: 'textarea',
                  label: { en: 'Excerpt', de: 'Auszug' },
                  admin: { description: { en: 'Short summary of the method', de: 'Kurze Zusammenfassung der Methode' } },
                },
              ],
            },
            {
              type: 'collapsible',
              label: { en: 'Goal of the method', de: 'Ziel der Methode' },
              admin: { initCollapsed: true },
              fields: [{ name: 'zielDerMethode', type: 'richText', label: { en: 'Goal of the method', de: 'Ziel der Methode' } }],
            },
            {
              type: 'collapsible',
              label: { en: 'When useful & when not?', de: 'Wann sinnvoll & wann nicht?' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'wannSinnvoll', type: 'richText', label: { en: 'When useful?', de: 'Wann sinnvoll?' } },
                { name: 'wannNichtSinnvoll', type: 'richText', label: { en: 'When not useful?', de: 'Wann nicht sinnvoll?' } },
              ],
            },
            {
              name: 'vorbereitung',
              type: 'array',
              label: { en: 'Preparation', de: 'Vorbereitung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              name: 'durchfuehrung',
              type: 'array',
              label: { en: 'Execution', de: 'Durchführung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              name: 'auswertung',
              type: 'array',
              label: { en: 'Evaluation', de: 'Auswertung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              type: 'collapsible',
              label: { en: 'Tips', de: 'Tipps' },
              admin: { initCollapsed: true },
              fields: [{ name: 'tipps', type: 'richText', label: { en: 'Tips', de: 'Tipps' } }],
            },
            {
              type: 'collapsible',
              label: { en: 'Not suitable for', de: 'Ungeeignet für' },
              admin: { initCollapsed: true },
              fields: [{ name: 'ungeeignetFuer', type: 'richText', label: { en: 'Not suitable for', de: 'Ungeeignet für' } }],
            },
          ],
        },
        {
          label: 'EN',
          fields: [
            {
              name: 'titleEn',
              type: 'text',
              label: { en: 'Title', de: 'Titel' },
            },
            {
              type: 'collapsible',
              label: { en: 'Excerpt', de: 'Auszug' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'auszugEn',
                  type: 'textarea',
                  label: { en: 'Excerpt', de: 'Auszug' },
                  admin: { description: { en: 'Short summary of the method', de: 'Kurze Zusammenfassung der Methode' } },
                },
              ],
            },
            {
              type: 'collapsible',
              label: { en: 'Goal of the method', de: 'Ziel der Methode' },
              admin: { initCollapsed: true },
              fields: [{ name: 'zielDerMethodeEn', type: 'richText', label: { en: 'Goal of the method', de: 'Ziel der Methode' } }],
            },
            {
              type: 'collapsible',
              label: { en: 'When useful & when not?', de: 'Wann sinnvoll & wann nicht?' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'wannSinnvollEn', type: 'richText', label: { en: 'When useful?', de: 'Wann sinnvoll?' } },
                { name: 'wannNichtSinnvollEn', type: 'richText', label: { en: 'When not useful?', de: 'Wann nicht sinnvoll?' } },
              ],
            },
            {
              name: 'vorbereitungEn',
              type: 'array',
              label: { en: 'Preparation', de: 'Vorbereitung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              name: 'durchfuehrungEn',
              type: 'array',
              label: { en: 'Execution', de: 'Durchführung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              name: 'auswertungEn',
              type: 'array',
              label: { en: 'Evaluation', de: 'Auswertung' },
              labels: { singular: { en: 'Section', de: 'Abschnitt' }, plural: { en: 'Sections', de: 'Abschnitte' } },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' },
              },
              fields: [
                { name: 'sectionTitle', type: 'text', label: { en: 'Title', de: 'Titel' } },
                { name: 'content', type: 'richText', label: { en: 'Content', de: 'Inhalt' } },
              ],
            },
            {
              type: 'collapsible',
              label: { en: 'Tips', de: 'Tipps' },
              admin: { initCollapsed: true },
              fields: [{ name: 'tippsEn', type: 'richText', label: { en: 'Tips', de: 'Tipps' } }],
            },
            {
              type: 'collapsible',
              label: { en: 'Not suitable for', de: 'Ungeeignet für' },
              admin: { initCollapsed: true },
              fields: [{ name: 'ungeeignetFuerEn', type: 'richText', label: { en: 'Not suitable for', de: 'Ungeeignet für' } }],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: { en: 'Similar methods', de: 'Ähnliche Methoden' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'aehnlicheMethoden',
          label: { en: 'Similar methods', de: 'Ähnliche Methoden' },
          type: 'relationship',
          relationTo: 'methods',
          hasMany: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: { en: 'What can follow?', de: 'Wie kann es weiter gehen?' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'wieKannEsWeiterGehen',
          label: { en: 'What can follow?', de: 'Wie kann es weiter gehen?' },
          type: 'relationship',
          relationTo: 'methods',
          hasMany: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: { en: 'Gallery', de: 'Galerie' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'gallery',
          label: { en: 'Gallery', de: 'Galerie' },
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: { en: 'Auto-generated from title. You can override it.', de: 'Automatisch aus dem Titel generiert. Kann überschrieben werden.' },
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
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
    {
      name: 'status',
      type: 'select',
      options: [
        { label: { en: 'Draft', de: 'Entwurf' }, value: 'draft' },
        { label: { en: 'Published', de: 'Veröffentlicht' }, value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'participationDepths',
      label: { en: 'Participation Depths', de: 'Beteiligungstiefen' },
      type: 'relationship',
      relationTo: 'participation-depths',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'projectPhases',
      label: { en: 'Project Phases', de: 'Projektphasen' },
      type: 'relationship',
      relationTo: 'project-phases',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'goals',
      label: { en: 'Goals', de: 'Ziele' },
      type: 'relationship',
      relationTo: 'goals',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'formats',
      label: { en: 'Formats', de: 'Formate' },
      type: 'relationship',
      relationTo: 'formats',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'durations',
      label: { en: 'Durations', de: 'Zeitrahmen' },
      type: 'relationship',
      relationTo: 'durations',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'targetGroups',
      label: { en: 'Target Groups', de: 'Zielgruppen' },
      type: 'relationship',
      relationTo: 'target-groups',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'groupSizes',
      label: { en: 'Group Sizes', de: 'Gruppengrößen' },
      type: 'relationship',
      relationTo: 'group-sizes',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'characteristics',
      label: { en: 'Characteristics', de: 'Merkmale' },
      type: 'relationship',
      relationTo: 'characteristics',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}

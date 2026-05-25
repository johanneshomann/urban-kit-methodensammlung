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
              name: 'auszug',
              type: 'richText',
              label: { en: 'Excerpt', de: 'Auszug' },
                            admin: { description: { en: 'Short summary of the method', de: 'Kurze Zusammenfassung der Methode' } },
            },
            {
              name: 'description',
              type: 'richText',
              label: { en: 'Description', de: 'Beschreibung' },
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
              name: 'auszugEn',
              type: 'richText',
              label: { en: 'Excerpt', de: 'Auszug' },
                            admin: { description: { en: 'Short summary of the method', de: 'Kurze Zusammenfassung der Methode' } },
            },
            {
              name: 'descriptionEn',
              type: 'richText',
              label: { en: 'Description', de: 'Beschreibung' },
                          },
          ],
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
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] ?? c))
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
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
      name: 'characteristics',
      label: { en: 'Characteristics', de: 'Merkmale' },
      type: 'relationship',
      relationTo: 'characteristics',
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
      name: 'formats',
      label: { en: 'Formats', de: 'Formate' },
      type: 'relationship',
      relationTo: 'formats',
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
      name: 'groupSizes',
      label: { en: 'Group Sizes', de: 'Gruppengrößen' },
      type: 'relationship',
      relationTo: 'group-sizes',
      hasMany: true,
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
      name: 'targetGroups',
      label: { en: 'Target Groups', de: 'Zielgruppen' },
      type: 'relationship',
      relationTo: 'target-groups',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}

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
      name: 'title',
      type: 'text',
      required: true,
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: { en: 'Description', de: 'Beschreibung' },
    },
    {
      name: 'steps',
      type: 'array',
      label: { en: 'Steps', de: 'Schritte' },
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'characteristics',
      label: { en: 'Characteristics', de: 'Merkmale' },
      type: 'relationship',
      relationTo: 'characteristics',
      hasMany: true,
    },
  ],
}

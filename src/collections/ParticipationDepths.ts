import type { CollectionConfig } from 'payload'

export const ParticipationDepths: CollectionConfig = {
  slug: 'participation-depths',
  labels: {
    singular: { en: 'Participation Depth', de: 'Beteiligungstiefe' },
    plural: { en: 'Participation Depths', de: 'Beteiligungstiefen' },
  },
  admin: { useAsTitle: 'nameDe', group: { en: 'Participation Depth', de: 'Beteiligungstiefe' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'DE',
          fields: [{ name: 'nameDe', label: { en: 'Name', de: 'Name' }, type: 'text', required: true }],
        },
        {
          label: 'EN',
          fields: [{ name: 'nameEn', label: { en: 'Name', de: 'Name' }, type: 'text' }],
        },
      ],
    },
    {
      name: 'icon',
      label: { en: 'Icon', de: 'Icon' },
      type: 'upload',
      relationTo: 'icons',
      admin: { position: 'sidebar' },
    },
    {
      name: 'lucideIcon',
      label: { en: 'Lucide Icon', de: 'Lucide Icon' },
      type: 'text',
      admin: {
        position: 'sidebar',
        description: { en: 'Icon name from lucide.dev (e.g. Clock). Fallback if no icon uploaded.', de: 'Icon-Name von lucide.dev (z.B. Clock). Fallback, wenn kein Icon hochgeladen.' },
        components: { afterInput: ['@/components/admin/LucideIconPreview#LucideIconPreview'] },
      },
    },
  ],
}

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import {
  lexicalEditor,
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { CharacteristicsSettings } from './globals/CharacteristicsSettings'
import { PlatformSettings } from './globals/PlatformSettings'
import { DurationSettings } from './globals/DurationSettings'
import { FormatSettings } from './globals/FormatSettings'
import { GoalSettings } from './globals/GoalSettings'
import { GroupSizeSettings } from './globals/GroupSizeSettings'
import { ParticipationDepthSettings } from './globals/ParticipationDepthSettings'
import { ProjectPhaseSettings } from './globals/ProjectPhaseSettings'
import { TargetGroupSettings } from './globals/TargetGroupSettings'

import { Characteristics } from './collections/Characteristics'
import { DurationCategories } from './collections/DurationCategories'
import { Durations } from './collections/Durations'
import { Formats } from './collections/Formats'
import { Goals } from './collections/Goals'
import { GroupSizes } from './collections/GroupSizes'
import { Icons } from './collections/Icons'
import { Media } from './collections/Media'
import { Methods } from './collections/Methods'
import { ParticipationDepths } from './collections/ParticipationDepths'
import { ProjectPhaseCategories } from './collections/ProjectPhaseCategories'
import { ProjectPhases } from './collections/ProjectPhases'
import { TargetGroups } from './collections/TargetGroups'
import { Users } from './collections/Users'
import { ApiClients } from './collections/ApiClients'
import {
  lockWritesToEditors,
  lockGlobalWritesToAdmins,
  lockGlobalWritesToEditors,
} from './lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: [
        '@/components/admin/TopNav#TopNav',
        '@/components/admin/CollapseFilterGroups#CollapseFilterGroups',
      ],
      afterNavLinks: ['@/components/admin/BottomNav#BottomNav'],
      views: {
        documentation: {
          Component: '@/components/admin/views/Documentation#Documentation',
          path: '/dokumentation',
        },
      },
    },
  },
  i18n: {
    supportedLanguages: { en, de },
    fallbackLanguage: 'de',
  },
  localization: {
    locales: [
      { label: 'Deutsch', code: 'de' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  collections: [
    // Content, filters & assets — read for authenticated entities, writes for admins + editors.
    ...[
      // Content
      Methods,
      // Filter Collections
      ParticipationDepths,
      ProjectPhases, ProjectPhaseCategories,
      Goals,
      Formats,
      Durations, DurationCategories,
      TargetGroups,
      GroupSizes,
      Characteristics,
      // Assets
      Icons, Media,
    ].map((c) => ({ ...c, access: { ...lockWritesToEditors, ...c.access } })),
    // Administration (last) — fully admin-only
    Users,
    ApiClients,
  ],
  globals: [
    // Legal platform texts (imprint, privacy, contact) — admin-only.
    { ...PlatformSettings, access: { ...lockGlobalWritesToAdmins, ...PlatformSettings.access } },
    // Filter settings (icons etc.) — editable by admins + editors.
    ...[
      ParticipationDepthSettings,
      ProjectPhaseSettings,
      GoalSettings,
      FormatSettings,
      DurationSettings,
      TargetGroupSettings,
      GroupSizeSettings,
      CharacteristicsSettings,
    ].map((g) => ({ ...g, access: { ...lockGlobalWritesToEditors, ...g.access } })),
  ],
  editor: lexicalEditor({
    features: [
      AlignFeature(),
      BlockquoteFeature(),
      BoldFeature(),
      HeadingFeature(),
      HorizontalRuleFeature(),
      IndentFeature(),
      InlineCodeFeature(),
      InlineToolbarFeature(),
      ItalicFeature(),
      LinkFeature(),
      OrderedListFeature(),
      ParagraphFeature(),
      RelationshipFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      UploadFeature(),
    ],
  }),
  // Email is configured via the Nodemailer adapter. SMTP credentials are read
  // from env vars at startup; non-secret operational values (recipient, etc.)
  // live in the Platform Settings global and are read per-request in the route.
  // With no SMTP_HOST set, Payload falls back to an ethereal.email mock in dev.
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS ?? 'noreply@urban-kit.local',
    defaultFromName: process.env.SMTP_FROM_NAME ?? 'Urban Kit',
    transportOptions: process.env.SMTP_HOST
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth:
            process.env.SMTP_USER || process.env.SMTP_PASS
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
        }
      : undefined,
  }),
  secret: process.env.PAYLOAD_SECRET ?? 'fallback-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/urban-kit',
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
})

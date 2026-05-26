import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { CharacteristicsSettings } from './globals/CharacteristicsSettings'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { en, de },
    fallbackLanguage: 'de',
  },
  collections: [
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
    // Administration (last)
    Users,
  ],
  globals: [
    ParticipationDepthSettings,
    ProjectPhaseSettings,
    GoalSettings,
    FormatSettings,
    DurationSettings,
    TargetGroupSettings,
    GroupSizeSettings,
    CharacteristicsSettings,
  ],
  editor: lexicalEditor(),
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

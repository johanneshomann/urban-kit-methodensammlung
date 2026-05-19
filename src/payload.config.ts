import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Methods } from './collections/Methods'
import { Characteristics } from './collections/Characteristics'
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
  collections: [Users, Characteristics, Media, Methods],
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

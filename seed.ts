import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const characteristicNames = ['simple', 'structured', 'playful', 'activating', 'creative']

const targetGroups = [
  {
    name: 'Interested public',
    explanation: [
      'Is there an interest in the topic without any direct personal impact?',
      'Would the person inform themselves or express an opinion without personally bearing any consequences?',
      'Is their involvement more voluntary and not driven by their own direct stake or affectedness?',
    ],
  },
  {
    name: 'Directly affected individuals',
    explanation: [
      'Is the person spatially or functionally directly affected by the project?',
      'Does the project concretely change their daily life, their use patterns, or their living situation?',
      'Does the person have to directly live with or deal with the consequences of the decision?',
    ],
  },
  {
    name: 'Hard-to-reach groups',
    explanation: [
      'Is the person difficult to reach through conventional participation formats?',
      'Are there barriers that make participation difficult (e.g., access, language, time, trust)?',
      'Would the person likely not participate without targeted outreach?',
    ],
  },
  {
    name: 'Organized stakeholders',
    explanation: [
      'Does the person speak not only for themselves, but for a group, organization, or institution?',
      'Do they bring bundled interests or official positions?',
      'Do they have a defined role in the process (e.g., association, initiative, institution)?',
    ],
  },
]

const durations = [
  { label: 'Under 1 hour', category: 'short' },
  { label: '1–3 hours', category: 'short' },
  { label: '1 day', category: 'medium' },
  { label: '1 day – 1 week', category: 'medium' },
  { label: 'Several weeks', category: 'long' },
  { label: 'Several months', category: 'long' },
]

const groupSizeNames = [
  'Small Group (up to 15 people)',
  'Medium Group (up to 30 people)',
  'Big Group (above 30 people)',
  'As much as possible',
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // Create predefined characteristics
  for (const name of characteristicNames) {
    const existing = await payload.find({
      collection: 'characteristics',
      where: { name: { equals: name } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  Characteristic exists: ${name}`)
    } else {
      await payload.create({ collection: 'characteristics', data: { name } })
      console.log(`  Created characteristic: ${name}`)
    }
  }

  // Create predefined target groups
  for (const { name, explanation } of targetGroups) {
    const existing = await payload.find({
      collection: 'target-groups',
      where: { name: { equals: name } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  Target group exists: ${name}`)
    } else {
      const paragraphs = Array.isArray(explanation) ? explanation : [explanation]
      await payload.create({
        collection: 'target-groups',
        data: {
          name,
          explanation: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: paragraphs.map((text) => ({
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text,
                    version: 1,
                  },
                ],
                textFormat: 0,
                textStyle: '',
                direction: 'ltr',
              })),
              direction: 'ltr',
            },
          },
        },
      })
      console.log(`  Created target group: ${name}`)
    }
  }

  // Create predefined durations
  for (const { label, category } of durations) {
    const existing = await payload.find({
      collection: 'durations',
      where: { label: { equals: label } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  Duration exists: ${label}`)
    } else {
      await payload.create({ collection: 'durations', data: { label, category } })
      console.log(`  Created duration: ${label}`)
    }
  }

  // Create predefined group sizes
  for (const name of groupSizeNames) {
    const existing = await payload.find({
      collection: 'group-sizes',
      where: { name: { equals: name } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  Group size exists: ${name}`)
    } else {
      await payload.create({ collection: 'group-sizes', data: { name } })
      console.log(`  Created group size: ${name}`)
    }
  }

  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

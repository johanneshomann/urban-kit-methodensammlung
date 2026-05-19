import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const characteristicNames = ['simple', 'structured', 'playful', 'activating', 'creative']

const methods = [
  {
    title: 'World Café',
    characteristics: ['activating', 'playful'],
    steps: [
      'Set up tables with paper tablecloths',
      'Distribute participants across tables',
      'Discuss questions and note ideas',
      'Rotate groups between tables',
      'Summarise results in plenary',
    ],
    description: 'World Café is a structured conversation method in which small groups discuss topics at different tables and then rotate.',
  },
  {
    title: 'Design Thinking Sprint',
    characteristics: ['creative', 'structured'],
    steps: [
      'Define and understand the problem',
      'Research user needs',
      'Generate ideas (brainstorming)',
      'Develop a prototype',
      'Test and collect feedback',
    ],
    description: 'A structured process for solving complex problems in a short time through human-centred design.',
  },
  {
    title: 'Stakeholder Mapping',
    characteristics: ['structured', 'simple'],
    steps: [
      'Identify all relevant stakeholders',
      'Assess interests and influence',
      'Create a matrix (influence vs. interest)',
      'Derive a communication strategy',
    ],
    description: 'Stakeholder mapping helps systematically capture all parties involved in a project and understand their relationships.',
  },
  {
    title: 'Future Workshop',
    characteristics: ['activating', 'creative'],
    steps: [
      'Critique phase: name problems',
      'Utopia phase: formulate wishes',
      'Realisation phase: plan implementation',
      'Document and distribute results',
    ],
    description: 'The future workshop is a method for democratic future-shaping in which citizens actively participate in solving societal problems.',
  },
  {
    title: 'Open Space Technology',
    characteristics: ['activating', 'playful'],
    steps: [
      'Announce the framing theme',
      'Let participants create the agenda',
      'Run parallel sessions',
      'Allow free movement between sessions',
      'Closing plenary with results',
    ],
    description: 'Open Space is a self-organising conference method in which the agenda is shaped by the participants themselves.',
  },
  {
    title: 'Community Walk',
    characteristics: ['simple', 'activating'],
    steps: [
      'Define the area of investigation',
      'Invite participants',
      'Walk through the urban space together',
      'Document observations and impressions',
      'Share insights afterwards',
    ],
    description: 'In a community walk, residents explore their neighbourhood together and exchange perceptions about public spaces.',
  },
  {
    title: 'Digital Participation Platform',
    characteristics: ['structured', 'creative'],
    steps: [
      'Define requirements and target group',
      'Select or develop a platform',
      'Design content and participation formats',
      'Activate and support the community',
      'Evaluate and communicate results',
    ],
    description: 'Digital platforms allow citizens to participate in planning and decision-making processes regardless of location.',
  },
  {
    title: 'Fishbowl Discussion',
    characteristics: ['structured', 'simple'],
    steps: [
      'Set up an inner circle with 4–5 chairs',
      'Explain the topic and rules',
      'Start the discussion in the inner circle',
      'Allow observers to swap seats',
      'Summarise insights in plenary',
    ],
    description: 'The fishbowl method enables structured discussions in which a small circle actively debates while the rest observes.',
  },
  {
    title: 'Rapid Prototyping in Urban Space',
    characteristics: ['playful', 'creative'],
    steps: [
      'Identify a problem in the urban space',
      'Source inexpensive materials',
      'Build a temporary intervention',
      'Observe and document reactions',
      'Decide on iteration or continuation',
    ],
    description: 'Through temporary, low-cost interventions in urban space, ideas are tested quickly and user feedback is gathered.',
  },
  {
    title: 'Citizens Panel',
    characteristics: ['structured', 'activating'],
    steps: [
      'Random selection of citizens',
      'Information phase on the topic',
      'Deliberation in small groups',
      'Vote on recommendations',
      'Hand results to decision-makers',
    ],
    description: 'A citizens panel is a representative group of citizens who deliberate on a specific topic and develop recommendations.',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // Create predefined characteristics
  const characteristicMap: Record<string, string> = {}
  for (const name of characteristicNames) {
    const existing = await payload.find({
      collection: 'characteristics',
      where: { name: { equals: name } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      characteristicMap[name] = String(existing.docs[0].id)
      console.log(`  Characteristic exists: ${name}`)
    } else {
      const created = await payload.create({ collection: 'characteristics', data: { name } })
      characteristicMap[name] = String(created.id)
      console.log(`  Created characteristic: ${name}`)
    }
  }

  // Create methods
  for (const method of methods) {
    const slug = method.title
      .toLowerCase()
      .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] ?? c))
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const existing = await payload.find({
      collection: 'methods',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Method exists: ${method.title}`)
      continue
    }

    const descriptionContent = {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
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
                text: method.description,
                version: 1,
              },
            ],
            textFormat: 0,
            textStyle: '',
            direction: 'ltr',
          },
        ],
        direction: 'ltr',
      },
    }

    await payload.create({
      collection: 'methods',
      data: {
        title: method.title,
        slug,
        status: 'published',
        description: descriptionContent,
        steps: method.steps.map((step) => ({ step })),
        characteristics: method.characteristics.map((c) => characteristicMap[c]).filter(Boolean),
      },
    })
    console.log(`  Created method: ${method.title}`)
  }

  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

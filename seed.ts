import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const tags = [
  'experimental',
  'standard',
  'partizipativ',
  'digital',
  'analog',
  'kreativ',
  'analytisch',
]

const methods = [
  {
    title: 'World Café',
    category: 'A' as const,
    difficulty: 'Easy' as const,
    tags: ['partizipativ', 'analog'],
    steps: [
      'Tische mit Papiertischdecken aufstellen',
      'Teilnehmende auf Tische verteilen',
      'Fragen diskutieren und Ideen notieren',
      'Gruppen rotieren lassen',
      'Ergebnisse zusammenfassen',
    ],
    description: 'Das World Café ist eine strukturierte Gesprächsmethode, bei der kleine Gruppen an verschiedenen Tischen über Themen diskutieren und dann die Tische wechseln.',
  },
  {
    title: 'Design Thinking Sprint',
    category: 'B' as const,
    difficulty: 'Hard' as const,
    tags: ['kreativ', 'experimental'],
    steps: [
      'Problem definieren und verstehen',
      'Nutzerbedürfnisse erforschen',
      'Ideen generieren (Brainstorming)',
      'Prototype entwickeln',
      'Testen und Feedback einholen',
    ],
    description: 'Ein strukturierter Prozess zur Lösung komplexer Probleme in kurzer Zeit durch menschenzentriertes Design.',
  },
  {
    title: 'Stakeholder-Mapping',
    category: 'A' as const,
    difficulty: 'Medium' as const,
    tags: ['analytisch', 'standard'],
    steps: [
      'Alle relevanten Stakeholder identifizieren',
      'Interessen und Einfluss einschätzen',
      'Matrix erstellen (Einfluss vs. Interesse)',
      'Kommunikationsstrategie ableiten',
    ],
    description: 'Stakeholder-Mapping hilft dabei, alle beteiligten Personen und Gruppen eines Projekts systematisch zu erfassen und ihre Beziehungen zu verstehen.',
  },
  {
    title: 'Zukunftswerkstatt',
    category: 'C' as const,
    difficulty: 'Medium' as const,
    tags: ['partizipativ', 'kreativ'],
    steps: [
      'Kritikphase: Probleme benennen',
      'Utopiephase: Wünsche formulieren',
      'Realisierungsphase: Umsetzung planen',
      'Ergebnisse dokumentieren und verteilen',
    ],
    description: 'Die Zukunftswerkstatt ist eine Methode zur demokratischen Zukunftsgestaltung, bei der Bürgerinnen und Bürger aktiv an der Lösung gesellschaftlicher Probleme teilnehmen.',
  },
  {
    title: 'Open Space Technology',
    category: 'B' as const,
    difficulty: 'Easy' as const,
    tags: ['partizipativ', 'experimental'],
    steps: [
      'Rahmenthema bekannt geben',
      'Agenda von Teilnehmenden erstellen lassen',
      'Parallele Sessions durchführen',
      'Freies Wandern zwischen Sessions ermöglichen',
      'Abschlussplenium mit Ergebnissen',
    ],
    description: 'Open Space ist eine selbstorganisierende Konferenzmethode, bei der die Agenda von den Teilnehmenden selbst gestaltet wird.',
  },
  {
    title: 'Community Walk',
    category: 'C' as const,
    difficulty: 'Easy' as const,
    tags: ['analog', 'partizipativ'],
    steps: [
      'Untersuchungsgebiet festlegen',
      'Teilnehmende einladen',
      'Gemeinsam durch den Stadtraum gehen',
      'Beobachtungen und Eindrücke dokumentieren',
      'Erkenntnisse im Nachgang teilen',
    ],
    description: 'Beim Community Walk erkunden Bewohnerinnen und Bewohner gemeinsam ihr Quartier und tauschen Wahrnehmungen über öffentliche Räume aus.',
  },
  {
    title: 'Digitale Partizipationsplattform',
    category: 'B' as const,
    difficulty: 'Hard' as const,
    tags: ['digital', 'experimental'],
    steps: [
      'Anforderungen und Zielgruppe definieren',
      'Plattform auswählen oder entwickeln',
      'Inhalte und Beteiligungsformate gestalten',
      'Community aktivieren und begleiten',
      'Ergebnisse auswerten und kommunizieren',
    ],
    description: 'Digitale Plattformen ermöglichen es, Bürgerinnen und Bürger ortsunabhängig in Planungs- und Entscheidungsprozesse einzubinden.',
  },
  {
    title: 'Fishbowl-Diskussion',
    category: 'A' as const,
    difficulty: 'Easy' as const,
    tags: ['standard', 'analog'],
    steps: [
      'Innenkreis mit 4–5 Stühlen aufstellen',
      'Thema und Regeln erklären',
      'Diskussion im Innenkreis starten',
      'Außenstehende können Platz tauschen',
      'Erkenntnisse im Plenum zusammenfassen',
    ],
    description: 'Die Fishbowl-Methode ermöglicht strukturierte Diskussionen, bei denen ein kleiner Kreis aktiv diskutiert und der Rest beobachtet.',
  },
  {
    title: 'Rapid Prototyping im Stadtraum',
    category: 'C' as const,
    difficulty: 'Hard' as const,
    tags: ['experimental', 'kreativ'],
    steps: [
      'Problemstellung im Stadtraum identifizieren',
      'Günstige Materialien beschaffen',
      'Temporäre Intervention aufbauen',
      'Reaktionen beobachten und dokumentieren',
      'Iteration oder Verstetigung entscheiden',
    ],
    description: 'Durch temporäre, kostengünstige Eingriffe in den Stadtraum werden Ideen schnell getestet und Feedback von Nutzerinnen und Nutzern gesammelt.',
  },
  {
    title: 'Bürgerpanel',
    category: 'A' as const,
    difficulty: 'Medium' as const,
    tags: ['standard', 'partizipativ'],
    steps: [
      'Zufällige Auswahl von Bürgerinnen und Bürgern',
      'Informationsphase zu Thema durchführen',
      'Deliberation in Kleingruppen',
      'Abstimmung über Empfehlungen',
      'Ergebnisse an Entscheidungsträger übergeben',
    ],
    description: 'Ein Bürgerpanel ist eine repräsentative Gruppe von Bürgerinnen und Bürgern, die zu einem spezifischen Thema beraten und Empfehlungen erarbeiten.',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // Create tags
  const tagMap: Record<string, string> = {}
  for (const tagName of tags) {
    const existing = await payload.find({
      collection: 'tags',
      where: { name: { equals: tagName } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      tagMap[tagName] = String(existing.docs[0].id)
      console.log(`  Tag exists: ${tagName}`)
    } else {
      const tag = await payload.create({ collection: 'tags', data: { name: tagName } })
      tagMap[tagName] = String(tag.id)
      console.log(`  Created tag: ${tagName}`)
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
      collection: 'methoden',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Methode exists: ${method.title}`)
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
      collection: 'methoden',
      data: {
        title: method.title,
        slug,
        status: 'published',
        category: method.category,
        difficulty: method.difficulty,
        description: descriptionContent,
        steps: method.steps.map((step) => ({ step })),
        tags: method.tags.map((t) => tagMap[t]).filter(Boolean),
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

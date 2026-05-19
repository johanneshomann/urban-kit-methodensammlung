import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config'

const characteristicNames = [
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
    characteristics: ['partizipativ', 'analog'],
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
    characteristics: ['kreativ', 'experimental'],
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
    characteristics: ['analytisch', 'standard'],
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
    characteristics: ['partizipativ', 'kreativ'],
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
    characteristics: ['partizipativ', 'experimental'],
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
    characteristics: ['analog', 'partizipativ'],
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
    characteristics: ['digital', 'experimental'],
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
    characteristics: ['standard', 'analog'],
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
    characteristics: ['experimental', 'kreativ'],
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
    characteristics: ['standard', 'partizipativ'],
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

  // Create characteristics
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

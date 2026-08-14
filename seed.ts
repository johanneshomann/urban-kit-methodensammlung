// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

import {
  barrierefreiheitDe,
  barrierefreiheitEn,
  cookiePolicyDe,
  cookiePolicyEn,
  datenschutzDe,
  datenschutzEn,
} from './src/lib/legalDefaults'

async function seed() {
  // Imported dynamically AFTER dotenv has run. A static `import` is hoisted and
  // evaluated before the dotenv.config() calls above, so payload.config would
  // read process.env.MONGODB_URI before .env.local is loaded and silently fall
  // back to the localhost:27017 default.
  const { default: config } = await import('./src/payload.config')
  const payload = await getPayload({ config })

  // Call sites still pass { nameDe, nameEn, explanation?, explanationEn?, ... }.
  // `name` and `explanation` are now localized: create in German, then set English.
  async function upsert(collection: string, nameDe: string, data: Record<string, unknown>) {
    const existing = await payload.find({
      collection: collection as any,
      where: { name: { equals: nameDe } },
      limit: 1,
      locale: 'de',
    })
    if (existing.totalDocs > 0) {
      console.log(`  skip  ${collection} / ${nameDe}`)
      return existing.docs[0] as any
    }
    const { nameEn, explanationEn, nameDe: _nameDe, ...rest } = data as Record<string, unknown>
    const createData = { ...rest, name: nameDe }
    const doc = await payload.create({ collection: collection as any, data: createData as any, locale: 'de', overrideAccess: true })
    if (nameEn || explanationEn) {
      await payload.update({
        collection: collection as any,
        id: doc.id,
        locale: 'en',
        data: {
          ...(nameEn ? { name: nameEn } : {}),
          ...(explanationEn ? { explanation: explanationEn } : {}),
        } as any,
        overrideAccess: true,
      })
    }
    console.log(`  create ${collection} / ${nameDe}`)
    return doc
  }

  console.log('\n── Participation Depths ──────────────────────')
  await upsert('participation-depths', 'Informieren',   { nameDe: 'Informieren',   nameEn: 'Inform',       lucideIcon: 'Megaphone'     })
  await upsert('participation-depths', 'Mitreden',      { nameDe: 'Mitreden',      nameEn: 'Participate',  lucideIcon: 'MessageCircle' })
  await upsert('participation-depths', 'Mitbestimmen',  { nameDe: 'Mitbestimmen',  nameEn: 'Have a say',   lucideIcon: 'Vote'          })

  console.log('\n── Project Phase Categories ──────────────────')
  const ppVorbereitung  = await upsert('project-phase-categories', 'Vorbereitung',  { nameDe: 'Vorbereitung',  nameEn: 'Preparation', lucideIcon: 'ClipboardList'  })
  const ppDurchfuehrung = await upsert('project-phase-categories', 'Durchführung',  { nameDe: 'Durchführung',  nameEn: 'Execution',   lucideIcon: 'Play'           })
  const ppNachbereitung = await upsert('project-phase-categories', 'Nachbereitung', { nameDe: 'Nachbereitung', nameEn: 'Follow-up',   lucideIcon: 'ClipboardCheck' })

  console.log('\n── Project Phases ────────────────────────────')
  await upsert('project-phases', 'Einarbeitung',       { nameDe: 'Einarbeitung',       nameEn: 'Onboarding',              slug: 'einarbeitung',         category: ppVorbereitung.id,  lucideIcon: 'BookOpen'          })
  await upsert('project-phases', 'Konzeptentwicklung', { nameDe: 'Konzeptentwicklung', nameEn: 'Concept Development',     slug: 'konzeptentwicklung',   category: ppVorbereitung.id,  lucideIcon: 'Lightbulb'         })
  await upsert('project-phases', 'Projektplanung',     { nameDe: 'Projektplanung',     nameEn: 'Project Planning',        slug: 'projektplanung',       category: ppVorbereitung.id,  lucideIcon: 'CalendarDays'      })
  await upsert('project-phases', 'Projektausführung',  { nameDe: 'Projektausführung',  nameEn: 'Project Execution',       slug: 'projektausfuehrung',   category: ppDurchfuehrung.id, lucideIcon: 'Play'              })
  await upsert('project-phases', 'Projektüberwachung', { nameDe: 'Projektüberwachung', nameEn: 'Project Monitoring',      slug: 'projektueberwachung',  category: ppDurchfuehrung.id, lucideIcon: 'ScanEye'           })
  await upsert('project-phases', 'Projektabschluss',   { nameDe: 'Projektabschluss',   nameEn: 'Project Closure',         slug: 'projektabschluss',     category: ppNachbereitung.id, lucideIcon: 'FlagTriangleRight' })
  await upsert('project-phases', 'Abschluss & Wirkung',{ nameDe: 'Abschluss & Wirkung',nameEn: 'Finalisation & Impact',  slug: 'abschluss-wirkung',    category: ppNachbereitung.id, lucideIcon: 'Sparkles'          })
  await upsert('project-phases', 'Reflexion & Evaluation', { nameDe: 'Reflexion & Evaluation', nameEn: 'Reflection & Evaluation', slug: 'reflexion-evaluation', category: ppNachbereitung.id, lucideIcon: 'IterationCcw' })

  console.log('\n── Goals ─────────────────────────────────────')
  await upsert('goals', 'Verstehen & Perspektiven sammeln', { nameDe: 'Verstehen & Perspektiven sammeln', nameEn: 'Understanding & Gathering Perspectives', lucideIcon: 'ScanSearch'      })
  await upsert('goals', 'Ideen entwickeln',                 { nameDe: 'Ideen entwickeln',                 nameEn: 'Developing Ideas',                      lucideIcon: 'Lightbulb'       })
  await upsert('goals', 'Austausch & Diskurs',              { nameDe: 'Austausch & Diskurs',              nameEn: 'Exchange & Discourse',                  lucideIcon: 'MessagesSquare'  })
  await upsert('goals', 'Strukturieren & Priorisieren',     { nameDe: 'Strukturieren & Priorisieren',     nameEn: 'Structuring & Prioritising',            lucideIcon: 'ListOrdered'     })
  await upsert('goals', 'Entscheidungsfindung',             { nameDe: 'Entscheidungsfindung',             nameEn: 'Decision-Making',                       lucideIcon: 'Vote'            })
  await upsert('goals', 'Visualisierung & Kommunikation',   { nameDe: 'Visualisierung & Kommunikation',   nameEn: 'Visualisation & Communication',         lucideIcon: 'Presentation'    })
  await upsert('goals', 'Erprobung & Testen',               { nameDe: 'Erprobung & Testen',               nameEn: 'Testing & Experimentation',             lucideIcon: 'FlaskConical'    })

  console.log('\n── Formats ───────────────────────────────────')
  await upsert('formats', 'Analog',  { nameDe: 'Analog',  nameEn: 'Analogue', lucideIcon: 'PenLine' })
  await upsert('formats', 'Digital', { nameDe: 'Digital', nameEn: 'Digital',  lucideIcon: 'Monitor' })
  await upsert('formats', 'Hybrid',  { nameDe: 'Hybrid',  nameEn: 'Hybrid',   lucideIcon: 'Blend'   })

  console.log('\n── Duration Categories ───────────────────────')
  const dcKurz   = await upsert('duration-categories', 'Kurz',   { nameDe: 'Kurz',   nameEn: 'Short',  lucideIcon: 'Zap'      })
  const dcMittel = await upsert('duration-categories', 'Mittel', { nameDe: 'Mittel', nameEn: 'Medium', lucideIcon: 'Clock'    })
  const dcLang   = await upsert('duration-categories', 'Lang',   { nameDe: 'Lang',   nameEn: 'Long',   lucideIcon: 'Hourglass'})

  console.log('\n── Durations ─────────────────────────────────')
  await upsert('durations', '> 1 Stunde',      { nameDe: '> 1 Stunde',      nameEn: 'Up to 1 Hour',    category: dcKurz.id,   lucideIcon: 'Timer'        })
  await upsert('durations', '1 - 3 Stunden',   { nameDe: '1 - 3 Stunden',   nameEn: '1 - 3 Hours',     category: dcKurz.id,   lucideIcon: 'Clock3'       })
  await upsert('durations', '1 Tag',            { nameDe: '1 Tag',            nameEn: '1 Day',           category: dcMittel.id, lucideIcon: 'Sun'          })
  await upsert('durations', '1 Tag - 1 Woche', { nameDe: '1 Tag - 1 Woche', nameEn: '1 Day - 1 Week',  category: dcMittel.id, lucideIcon: 'CalendarDays' })
  await upsert('durations', 'einige Wochen',   { nameDe: 'einige Wochen',   nameEn: 'Several Weeks',   category: dcLang.id,   lucideIcon: 'CalendarRange'})
  await upsert('durations', 'einige Monate',   { nameDe: 'einige Monate',   nameEn: 'Several Months',  category: dcLang.id,   lucideIcon: 'CalendarClock'})

  console.log('\n── Target Groups ─────────────────────────────')
  await upsert('target-groups', 'direkte Betroffene', {
    nameDe: 'direkte Betroffene', nameEn: 'Directly Affected', lucideIcon: 'UserX',
    explanation:   'Ist die Person räumlich oder funktional direkt vom Projekt betroffen? Verändert das Projekt konkret ihren Alltag, ihre Nutzung oder ihre Lebenssituation? Muss die Person mit den Folgen der Entscheidung unmittelbar leben oder umgehen?',
    explanationEn: 'Is the person directly affected spatially or functionally by the project? Does the project concretely change their daily life, use, or living situation? Does the person have to live with or deal with the direct consequences of the decision?',
  })
  await upsert('target-groups', 'interessierte Öffentlichkeit', {
    nameDe: 'interessierte Öffentlichkeit', nameEn: 'Interested Public', lucideIcon: 'Eye',
    explanation:   'Besteht Interesse am Thema, ohne dass eine direkte Betroffenheit vorliegt? Würde die Person sich informieren oder eine Meinung äußern, ohne selbst Konsequenzen zu tragen? Ist die Beteiligung freiwillig und nicht durch eigene Betroffenheit motiviert?',
    explanationEn: 'Is there interest in the topic without direct personal impact? Would the person seek information or express an opinion without bearing consequences themselves? Is participation more voluntary and not motivated by personal impact?',
  })
  await upsert('target-groups', 'schwer erreichbare Gruppen', {
    nameDe: 'schwer erreichbare Gruppen', nameEn: 'Hard-to-Reach Groups', lucideIcon: 'UserSearch',
    explanation:   'Ist die Person über klassische Beteiligungsformate schwer erreichbar? Gibt es Barrieren, die eine Teilnahme erschweren? (z. B. Zugang, Sprache, Zeit, Vertrauen) Wird die Person ohne gezielte Ansprache voraussichtlich nicht teilnehmen?',
    explanationEn: 'Is the person hard to reach through conventional participation formats? Are there barriers that make participation more difficult (e.g. access, language, time, trust)? Would the person likely not participate without targeted outreach?',
  })
  await upsert('target-groups', 'organisierte Akteur:innen', {
    nameDe: 'organisierte Akteur:innen', nameEn: 'Organised Actors', lucideIcon: 'Building2',
    explanation:   'Spricht die Person nicht nur für sich selbst, sondern für eine Gruppe, Organisation oder Institution? Bringt sie gebündelte Interessen oder offizielle Positionen ein? Hat sie eine definierte Rolle im Prozess (z. B. Verband, Initiative, Institution)?',
    explanationEn: 'Does the person speak not only for themselves but for a group, organisation or institution? Do they represent bundled interests or official positions? Do they have a defined role in the process (e.g. association, initiative, institution)?',
  })

  console.log('\n── Group Sizes ───────────────────────────────')
  await upsert('group-sizes', 'kleine Gruppe bis 15',  { nameDe: 'kleine Gruppe bis 15',  nameEn: 'Small Group up to 15',  lucideIcon: 'User'     })
  await upsert('group-sizes', 'mittlere Gruppe bis 30',{ nameDe: 'mittlere Gruppe bis 30', nameEn: 'Medium Group up to 30', lucideIcon: 'UserPlus' })
  await upsert('group-sizes', 'große Gruppe ab 30',    { nameDe: 'große Gruppe ab 30',     nameEn: 'Large Group from 30',   lucideIcon: 'Users'    })
  await upsert('group-sizes', 'so viele wie möglich',  { nameDe: 'so viele wie möglich',   nameEn: 'As Many as Possible',   lucideIcon: 'Infinity' })

  console.log('\n── Characteristics ───────────────────────────')
  await upsert('characteristics', 'Einfach',      { nameDe: 'Einfach',      nameEn: 'Simple',      lucideIcon: 'Circle'     })
  await upsert('characteristics', 'Strukturiert', { nameDe: 'Strukturiert', nameEn: 'Structured',  lucideIcon: 'LayoutList' })
  await upsert('characteristics', 'Spielerisch',  { nameDe: 'Spielerisch',  nameEn: 'Playful',     lucideIcon: 'Gamepad2'   })
  await upsert('characteristics', 'Aktivierend',  { nameDe: 'Aktivierend',  nameEn: 'Activating',  lucideIcon: 'Zap'        })
  await upsert('characteristics', 'Kreativ',      { nameDe: 'Kreativ',      nameEn: 'Creative',    lucideIcon: 'Sparkles'   })

  console.log('\n── Legal texts (migrate + cookie policy) ─────')
  {
    const ps = await payload.findGlobal({ slug: 'platform-settings' as any, locale: 'all' as any })
    const legal = await payload.findGlobal({ slug: 'legal' as any, locale: 'all' as any })

    // One-time migration: move imprint + privacy from their old platform-settings
    // location into the new "Legal" global, preserving both locales.
    const migrated = new Set<string>()
    for (const field of ['impressum', 'datenschutz'] as const) {
      if ((legal as any)?.[field]) { console.log(`  skip  legal / ${field} (already set)`); continue }
      const value = (ps as any)?.[field]
      if (!value) { console.log(`  skip  legal / ${field} (nothing to migrate)`); continue }
      for (const loc of ['de', 'en'] as const) {
        const v = value?.[loc]
        if (v) await payload.updateGlobal({ slug: 'legal' as any, locale: loc, data: { [field]: v } as any, overrideAccess: true })
      }
      migrated.add(field)
      console.log(`  migrate legal / ${field} (from platform-settings)`)
    }

    // Seed the default privacy policy (fill-in-the-blanks placeholders) if the
    // field is still empty after the migration above.
    if ((legal as any)?.datenschutz || migrated.has('datenschutz')) {
      // skip — the migration loop above already logged this field's status
    } else {
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'de', data: { datenschutz: datenschutzDe } as any, overrideAccess: true })
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'en', data: { datenschutz: datenschutzEn } as any, overrideAccess: true })
      console.log('  create legal / datenschutz (default privacy policy — placeholders MUST be filled)')
    }

    // Seed the default privacy policy if the field is still empty (i.e. nothing
    // was migrated above). It is a fill-in-the-blanks starting point — the
    // placeholders MUST be completed before go-live.
    const legalAfterMigration = await payload.findGlobal({ slug: 'legal' as any, locale: 'all' as any })
    if ((legalAfterMigration as any)?.datenschutz) {
      console.log('  skip  legal / datenschutz (text present — default not needed)')
    } else {
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'de', data: { datenschutz: datenschutzDe } as any, overrideAccess: true })
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'en', data: { datenschutz: datenschutzEn } as any, overrideAccess: true })
      console.log('  create legal / datenschutz (default privacy policy — FILL THE PLACEHOLDERS)')
    }

    // Seed the default cookie policy if none exists yet.
    if ((legal as any)?.cookies) {
      console.log('  skip  legal / cookies (already set)')
    } else {
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'de', data: { cookies: cookiePolicyDe } as any, overrideAccess: true })
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'en', data: { cookies: cookiePolicyEn } as any, overrideAccess: true })
      console.log('  create legal / cookies (default cookie policy)')
    }

    // Seed the default accessibility statement if none exists yet.
    if ((legal as any)?.barrierefreiheit) {
      console.log('  skip  legal / barrierefreiheit (already set)')
    } else {
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'de', data: { barrierefreiheit: barrierefreiheitDe } as any, overrideAccess: true })
      await payload.updateGlobal({ slug: 'legal' as any, locale: 'en', data: { barrierefreiheit: barrierefreiheitEn } as any, overrideAccess: true })
      console.log('  create legal / barrierefreiheit (default accessibility statement)')
    }
  }

  console.log('\n── Filter Settings Icons ─────────────────────')
  {
    const filterSettingsIcons: Array<[string, string]> = [
      ['participation-depth-settings', 'Layers'],
      ['project-phase-settings',       'Milestone'],
      ['goal-settings',                'Target'],
      ['format-settings',              'Shapes'],
      ['duration-settings',            'Clock'],
      ['target-group-settings',        'Users'],
      ['group-size-settings',          'UsersRound'],
      ['characteristics-settings',     'Tags'],
    ]
    for (const [slug, lucideIcon] of filterSettingsIcons) {
      const current = await payload.findGlobal({ slug: slug as any })
      if (current?.lucideIcon) {
        console.log(`  skip  ${slug} / lucideIcon (already "${current.lucideIcon}")`)
      } else {
        await payload.updateGlobal({ slug: slug as any, data: { lucideIcon } as any, overrideAccess: true })
        console.log(`  set   ${slug} / lucideIcon = "${lucideIcon}"`)
      }
    }
  }

  console.log('\n✓ Seed complete\n')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

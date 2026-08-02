// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

// ── Lexical rich-text builders ────────────────────────────────
// Minimal node factories matching what src/components/RichTextRenderer.tsx
// understands (heading, paragraph, bullet list, bold/italic text).
const txt = (text: string, format = 0) => ({ type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 })
const b = (text: string) => txt(text, 1) // bold
const h = (tag: 'h2' | 'h3', text: string) => ({ type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children: [txt(text)] })
const p = (...children: any[]) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children })
const ul = (items: any[][]) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1, format: '', indent: 0, version: 1, direction: 'ltr',
  children: items.map((children, i) => ({ type: 'listitem', value: i + 1, format: '', indent: 0, version: 1, direction: 'ltr', children })),
})
const doc = (children: any[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } })

// Default cookie / local-storage policy. Serves as an editable orientation for
// what the platform actually stores; reflects the inventory in src/lib/saved.ts,
// src/lib/accessibility.ts, src/components/CookieNotice.tsx, next-intl
// (NEXT_LOCALE, session cookie) and Payload auth. Kept in sync with
// docs/COOKIE-POLICY-TEMPLATES.md — update both together.
const cookiePolicyDe = doc([
  h('h2', 'Cookies & lokale Speicherung'),
  p(txt('Diese Website verwendet ausschließlich technisch notwendige bzw. funktionale Cookies und lokale Browser-Speicherung. Es findet kein Tracking statt, es werden keine Analyse- oder Marketing-Cookies gesetzt und keine Daten an Dritte weitergegeben. Eine Einwilligung (Cookie-Banner) ist daher nicht erforderlich. Rechtsgrundlage ist § 25 Abs. 2 TDDDG i. V. m. Art. 6 Abs. 1 lit. f DSGVO.')),
  h('h3', 'Cookies'),
  ul([
    [b('NEXT_LOCALE'), txt(' – Speichert die gewählte Sprache (Deutsch/Englisch). Wird nur gesetzt, wenn Sie die Sprache aktiv wechseln. Funktional, First-Party, Sitzungs-Cookie (wird beim Schließen des Browsers gelöscht).')],
    [b('payload-token'), txt(' – Anmelde-Sitzung für den Verwaltungsbereich (/admin). Wird ausschließlich für angemeldete Redakteur:innen gesetzt, nicht für Besucher:innen der Website. Technisch notwendig, httpOnly, Laufzeit ca. 2 Stunden.')],
  ]),
  h('h3', 'Lokale Speicherung (Local Storage / Session Storage)'),
  p(txt('Die folgenden Daten liegen ausschließlich lokal in Ihrem Browser und werden nicht auf dem Server gespeichert:')),
  ul([
    [b('uk-saved'), txt(' – Ihre gemerkten Methoden. Funktional, bleibt bis zum Löschen erhalten. Hinweis: Die gespeicherten Methoden-Kennungen werden nur dann an den Server übertragen, wenn Sie die Seite „Gemerkte Methoden“ aufrufen oder ein PDF erzeugen – sie dienen dort ausschließlich zum Laden der Inhalte und werden serverseitig nicht gespeichert.')],
    [b('uk-a11y'), txt(' – Ihre Barrierefreiheit-Einstellungen (Schriftgröße, reduzierte Animationen, hoher Kontrast, unterstrichene Links). Funktional, bleibt bis zum Löschen erhalten.')],
    [b('uk-assistant-chat'), txt(' – Ihr aktueller Chat-Verlauf mit dem Methoden-Assistenten, damit er beim Navigieren auf der Website erhalten bleibt. Session Storage, wird beim Schließen des Tabs gelöscht.')],
    [b('uk-cookie-notice-ack'), txt(' – Merkt sich, dass Sie den Speicherhinweis geschlossen haben. Session Storage, wird beim Schließen des Tabs gelöscht.')],
  ]),
  h('h3', 'Ihre Kontrolle'),
  p(txt('Sie können Cookies und lokale Speicherung jederzeit über die Einstellungen Ihres Browsers löschen oder blockieren. Das Löschen der lokalen Speicherung entfernt Ihre gemerkten Methoden und Ihre Barrierefreiheit-Einstellungen; die Funktionsfähigkeit der Website kann dadurch eingeschränkt sein.')),
])
const cookiePolicyEn = doc([
  h('h2', 'Cookies & local storage'),
  p(txt('This website uses only technically necessary or functional cookies and local browser storage. There is no tracking, no analytics or marketing cookies, and no sharing of data with third parties. Consent (a cookie banner) is therefore not required. The legal basis is Section 25 (2) TDDDG in conjunction with Art. 6 (1) (f) GDPR.')),
  h('h3', 'Cookies'),
  ul([
    [b('NEXT_LOCALE'), txt(' – Stores your chosen language (German/English). Only set when you actively switch the language. Functional, first-party, session cookie (deleted when the browser is closed).')],
    [b('payload-token'), txt(' – Login session for the administration area (/admin). Set exclusively for signed-in editors, never for website visitors. Technically necessary, httpOnly, lifetime approx. 2 hours.')],
  ]),
  h('h3', 'Local storage (local storage / session storage)'),
  p(txt('The following data lives only locally in your browser and is not stored on the server:')),
  ul([
    [b('uk-saved'), txt(' – Your bookmarked methods. Functional, kept until cleared. Note: the stored method IDs are transmitted to the server only when you open the “Bookmarked Methods” page or generate a PDF – they are used solely to load the content and are not stored server-side.')],
    [b('uk-a11y'), txt(' – Your accessibility settings (font size, reduced motion, high contrast, underlined links). Functional, kept until cleared.')],
    [b('uk-assistant-chat'), txt(' – Your current chat transcript with the Method Assistant, so it survives navigating around the website. Session storage, deleted when the tab is closed.')],
    [b('uk-cookie-notice-ack'), txt(' – Remembers that you dismissed the storage notice. Session storage, deleted when the tab is closed.')],
  ]),
  h('h3', 'Your control'),
  p(txt('You can delete or block cookies and local storage at any time via your browser settings. Clearing local storage removes your bookmarked methods and your accessibility settings; parts of the website may work with reduced functionality as a result.')),
])

// Inline link node matching what Payload's Lexical LinkFeature produces.
const a = (text: string, url: string) => ({
  type: 'link', version: 3, format: '', indent: 0, direction: 'ltr',
  fields: { url, newTab: false, linkType: 'custom' },
  children: [txt(text)],
})

// Default privacy policy (DSGVO/GDPR). Every bracketed placeholder MUST be
// filled by an admin before go-live — the seeded text is a fill-in-the-blanks
// starting point, not a valid policy. Reflects the stock processing inventory
// (no analytics, assistant → external AI provider, transient IP rate limiting).
// Kept in sync with docs/PRIVACY-POLICY-TEMPLATES.md — update both together.
const datenschutzDe = doc([
  h('h2', 'Datenschutzerklärung'),
  p(txt('Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Website erhebt so wenige personenbezogene Daten wie möglich: Es gibt keine Nutzerkonten für Besucher:innen, keine Analyse- oder Tracking-Dienste und keine Weitergabe von Daten zu Werbezwecken.')),
  h('h3', '1. Verantwortliche Stelle'),
  p(txt('[Betreiber:in ergänzen: Name/Institution, Anschrift, E-Mail-Adresse]')),
  p(txt('[Falls vorhanden: Datenschutzbeauftragte:r mit Kontaktdaten ergänzen — andernfalls diesen Absatz löschen]')),
  h('h3', '2. Hosting und Server-Logfiles'),
  p(txt('Diese Website wird gehostet bei [Hosting-Anbieter, Ort/Land ergänzen]. Beim Aufruf der Website verarbeitet der Server automatisch technisch notwendige Daten: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp (User-Agent) und Referrer. Diese Logfiles dienen der Sicherstellung des Betriebs und der Abwehr von Angriffen (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO) und werden nach [Log-Speicherdauer ergänzen] gelöscht. Mit dem Hosting-Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO).')),
  p(txt('[Nur falls ein CDN/Proxy eingesetzt wird, sonst löschen:] Die Auslieferung der Website erfolgt über [CDN/Proxy-Anbieter ergänzen, z. B. Cloudflare Inc., USA]. Dabei werden Verbindungsdaten (u. a. IP-Adresse) durch den Anbieter verarbeitet. Soweit der Anbieter außerhalb der EU sitzt, erfolgt die Übermittlung auf Grundlage von Standardvertragsklauseln (Art. 46 DSGVO).')),
  h('h3', '3. Cookies und lokale Speicherung'),
  p(txt('Diese Website verwendet ausschließlich technisch notwendige bzw. funktionale Cookies und lokale Browser-Speicherung (z. B. für gemerkte Methoden und Barrierefreiheit-Einstellungen). Details enthält die '), a('Cookie-Richtlinie', '/cookies'), txt('.')),
  h('h3', '4. Methoden-Assistent (KI-Chat)'),
  p(txt('Für den optionalen Methoden-Assistenten werden Ihre Chat-Eingaben zur Beantwortung an einen externen KI-Anbieter übermittelt: [KI-Anbieter ergänzen, z. B. „Anthropic PBC, USA“ / „OpenAI, L.L.C., USA“ / „Mistral AI, Frankreich“]. Übermittelt werden ausschließlich die Inhalte des Chatverlaufs; geben Sie daher bitte keine personenbezogenen Daten in den Chat ein. Die Nutzung des Assistenten ist freiwillig; Rechtsgrundlage ist Ihre Einwilligung durch die aktive Nutzung (Art. 6 Abs. 1 lit. a DSGVO). Zur Missbrauchsvermeidung wird Ihre IP-Adresse kurzzeitig und ausschließlich im Arbeitsspeicher für eine Ratenbegrenzung verarbeitet; sie wird nicht dauerhaft gespeichert. [Bei Nicht-EU-Anbietern ergänzen: Die Übermittlung in ein Drittland erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 DSGVO).]')),
  h('h3', '5. Merkliste und PDF-Export'),
  p(txt('Ihre gemerkten Methoden werden ausschließlich lokal in Ihrem Browser gespeichert. Beim Aufruf der Merklisten-Seite oder beim PDF-Export werden nur die Kennungen der gemerkten Methoden an den Server übertragen, um die Inhalte zu laden bzw. das PDF zu erzeugen; sie werden serverseitig nicht gespeichert. Beim PDF-Export wird Ihre IP-Adresse kurzzeitig im Arbeitsspeicher für eine Ratenbegrenzung verarbeitet.')),
  h('h3', '6. Kontakt per E-Mail'),
  p(txt('Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Daten (E-Mail-Adresse, Inhalt der Nachricht) zur Bearbeitung Ihres Anliegens (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.')),
  h('h3', '7. Verwaltungsbereich (nur Redakteur:innen)'),
  p(txt('Für die Pflege der Inhalte existieren persönliche Konten für Redakteur:innen (Name, E-Mail-Adresse, Passwort-Hash). Ein technisch notwendiges Sitzungs-Cookie wird nur bei der Anmeldung im Verwaltungsbereich gesetzt. E-Mails (z. B. zum Zurücksetzen des Passworts) werden über [SMTP-Anbieter ergänzen] versendet.')),
  h('h3', '8. Ihre Rechte'),
  p(txt('Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Zudem haben Sie ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde, z. B. bei der für uns zuständigen Behörde: [Aufsichtsbehörde mit Kontaktdaten ergänzen].')),
  p(txt('Stand: [Datum ergänzen]')),
])
const datenschutzEn = doc([
  h('h2', 'Privacy Policy'),
  p(txt('Protecting your personal data matters to us. This website collects as little personal data as possible: there are no visitor accounts, no analytics or tracking services, and no sharing of data for advertising purposes.')),
  h('h3', '1. Controller'),
  p(txt('[Add operator: name/institution, postal address, email address]')),
  p(txt('[If applicable: add data protection officer with contact details — otherwise delete this paragraph]')),
  h('h3', '2. Hosting and server log files'),
  p(txt('This website is hosted by [add hosting provider, city/country]. When you visit the website, the server automatically processes technically necessary data: IP address, date and time, requested page, browser type (user agent) and referrer. These log files serve to keep the site operational and to defend against attacks (legal basis: Art. 6 (1) (f) GDPR) and are deleted after [add log retention period]. A data processing agreement (Art. 28 GDPR) is in place with the hosting provider.')),
  p(txt('[Only if a CDN/proxy is used, otherwise delete:] The website is delivered via [add CDN/proxy provider, e.g. Cloudflare Inc., USA]. Connection data (including the IP address) is processed by this provider. Where the provider is located outside the EU, the transfer is based on standard contractual clauses (Art. 46 GDPR).')),
  h('h3', '3. Cookies and local storage'),
  p(txt('This website uses only technically necessary or functional cookies and local browser storage (e.g. for bookmarked methods and accessibility settings). Details are provided in the '), a('cookie policy', '/cookies'), txt('.')),
  h('h3', '4. Method Assistant (AI chat)'),
  p(txt('For the optional Method Assistant, your chat input is transmitted to an external AI provider to generate answers: [add AI provider, e.g. “Anthropic PBC, USA” / “OpenAI, L.L.C., USA” / “Mistral AI, France”]. Only the content of the chat conversation is transmitted; please do not enter any personal data into the chat. Use of the assistant is voluntary; the legal basis is your consent through active use (Art. 6 (1) (a) GDPR). To prevent abuse, your IP address is processed briefly and exclusively in memory for rate limiting; it is not stored permanently. [For non-EU providers add: the third-country transfer is based on standard contractual clauses (Art. 46 GDPR).]')),
  h('h3', '5. Bookmarks and PDF export'),
  p(txt('Your bookmarked methods are stored only locally in your browser. When you open the bookmarks page or export a PDF, only the IDs of the bookmarked methods are transmitted to the server to load the content or generate the PDF; they are not stored server-side. During PDF export, your IP address is processed briefly in memory for rate limiting.')),
  h('h3', '6. Contact by email'),
  p(txt('If you contact us by email, we process the data you provide (email address, content of the message) to handle your enquiry (Art. 6 (1) (b) or (f) GDPR). The data is deleted once it is no longer required for processing and no statutory retention obligations apply.')),
  h('h3', '7. Administration area (editors only)'),
  p(txt('Personal accounts exist for editors who maintain the content (name, email address, password hash). A technically necessary session cookie is set only when signing in to the administration area. Emails (e.g. password resets) are sent via [add SMTP provider].')),
  h('h3', '8. Your rights'),
  p(txt('You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and objection to processing based on Art. 6 (1) (f) GDPR (Art. 21). You may withdraw any consent at any time with effect for the future. You also have the right to lodge a complaint with a data protection supervisory authority, e.g. the authority responsible for us: [add supervisory authority with contact details].')),
  p(txt('Last updated: [add date]')),
])

// Default accessibility statement (BITV 2.0 / EU model declaration).
// Bracketed placeholders (dates, feedback email, enforcement body) are meant to
// be completed by an admin — the statement is only valid once they are filled.
// Kept in sync with docs/ACCESSIBILITY-STATEMENT-TEMPLATES.md — update both together.
const barrierefreiheitDe = doc([
  h('h2', 'Erklärung zur Barrierefreiheit'),
  p(txt('Diese Erklärung zur Barrierefreiheit gilt für die Website „Urban Kit Methodensammlung“. Wir sind bemüht, diese Website im Einklang mit der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) barrierefrei zugänglich zu machen.')),
  h('h3', 'Stand der Vereinbarkeit mit den Anforderungen'),
  p(txt('Diese Website ist mit der BITV 2.0 (WCAG 2.1, Konformitätsstufe AA) vereinbar. Grundlage dieser Einschätzung ist eine am [Datum der Selbstbewertung ergänzen] durchgeführte Selbstbewertung.')),
  h('h3', 'Nicht barrierefreie Inhalte'),
  p(txt('Derzeit sind uns keine nicht barrierefreien Inhalte bekannt. Sollten Sie dennoch auf eine Barriere stoßen, freuen wir uns über Ihre Rückmeldung.')),
  h('h3', 'Barrierefreiheitsfunktionen dieser Website'),
  p(txt('Über das Barrierefreiheit-Symbol lassen sich Schriftgröße, hoher Kontrast, unterstrichene Links und reduzierte Animationen einstellen; die Einstellungen bleiben lokal im Browser gespeichert. Die Website ist vollständig per Tastatur bedienbar und bietet einen „Zum Inhalt springen“-Link.')),
  h('h3', 'Erstellung dieser Erklärung'),
  p(txt('Diese Erklärung wurde am [Datum ergänzen] erstellt und zuletzt am [Datum ergänzen] überprüft.')),
  h('h3', 'Barrieren melden: Feedback und Kontakt'),
  p(txt('Sie möchten uns bestehende Barrieren mitteilen oder Informationen zur Umsetzung der Barrierefreiheit erfragen? Nutzen Sie gerne unsere '), a('Kontaktseite', '/kontakt'), txt(' oder schreiben Sie an [E-Mail-Adresse ergänzen]. Wir bemühen uns, Anfragen innerhalb von zwei Wochen zu beantworten.')),
  h('h3', 'Durchsetzungsverfahren'),
  p(txt('Wenn Sie der Ansicht sind, dass unsere Antwort auf Ihre Rückmeldung nicht zufriedenstellend ist, können Sie sich an die zuständige Durchsetzungs- bzw. Ombudsstelle wenden: [Zuständige Stelle mit Kontaktdaten ergänzen — für öffentliche Stellen des Landes NRW ist dies die Ombudsstelle für barrierefreie Informationstechnik des Landes Nordrhein-Westfalen].')),
])

const barrierefreiheitEn = doc([
  h('h2', 'Accessibility Statement'),
  p(txt('This accessibility statement applies to the “Urban Kit Methodensammlung” website. We strive to make this website accessible in accordance with the German Barrier-Free Information Technology Ordinance (BITV 2.0).')),
  h('h3', 'Compliance status'),
  p(txt('This website is compliant with BITV 2.0 (WCAG 2.1, conformance level AA). This assessment is based on a self-evaluation carried out on [add date of self-evaluation].')),
  h('h3', 'Non-accessible content'),
  p(txt('We are currently not aware of any non-accessible content. Should you nevertheless encounter a barrier, we appreciate your feedback.')),
  h('h3', 'Accessibility features of this website'),
  p(txt('Via the accessibility icon you can adjust font size, high contrast, underlined links and reduced animations; the settings are kept locally in your browser. The website is fully keyboard-operable and offers a “skip to content” link.')),
  h('h3', 'Preparation of this statement'),
  p(txt('This statement was prepared on [add date] and last reviewed on [add date].')),
  h('h3', 'Reporting barriers: feedback and contact'),
  p(txt('Would you like to report existing barriers or request information on the implementation of accessibility? Please use our '), a('contact page', '/kontakt'), txt(' or write to [add email address]. We aim to respond to enquiries within two weeks.')),
  h('h3', 'Enforcement procedure'),
  p(txt('If you believe that our response to your feedback is not satisfactory, you can contact the responsible enforcement/ombudsman body: [add responsible body with contact details — for public bodies of the state of North Rhine-Westphalia this is the Ombudsstelle für barrierefreie Informationstechnik des Landes Nordrhein-Westfalen].')),
])

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
  await upsert('project-phases', 'Einarbeitung',       { nameDe: 'Einarbeitung',       nameEn: 'Onboarding',              category: ppVorbereitung.id,  lucideIcon: 'BookOpen'          })
  await upsert('project-phases', 'Konzeptentwicklung', { nameDe: 'Konzeptentwicklung', nameEn: 'Concept Development',     category: ppVorbereitung.id,  lucideIcon: 'Lightbulb'         })
  await upsert('project-phases', 'Projektplanung',     { nameDe: 'Projektplanung',     nameEn: 'Project Planning',        category: ppVorbereitung.id,  lucideIcon: 'CalendarDays'      })
  await upsert('project-phases', 'Projektausführung',  { nameDe: 'Projektausführung',  nameEn: 'Project Execution',       category: ppDurchfuehrung.id, lucideIcon: 'Play'              })
  await upsert('project-phases', 'Projektüberwachung', { nameDe: 'Projektüberwachung', nameEn: 'Project Monitoring',      category: ppDurchfuehrung.id, lucideIcon: 'ScanEye'           })
  await upsert('project-phases', 'Projektabschluss',   { nameDe: 'Projektabschluss',   nameEn: 'Project Closure',         category: ppNachbereitung.id, lucideIcon: 'FlagTriangleRight' })
  await upsert('project-phases', 'Abschluss & Wirkung',{ nameDe: 'Abschluss & Wirkung',nameEn: 'Finalisation & Impact',  category: ppNachbereitung.id, lucideIcon: 'Sparkles'          })
  await upsert('project-phases', 'Reflexion & Evaluation', { nameDe: 'Reflexion & Evaluation', nameEn: 'Reflection & Evaluation', category: ppNachbereitung.id, lucideIcon: 'IterationCcw' })

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

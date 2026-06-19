'use client'

import { Gutter } from '@payloadcms/ui'
import React, { useState } from 'react'

type Lang = 'de' | 'en'
type L = Record<Lang, string>
type Answer = Record<Lang, string[]> // 1 entry → paragraph, several → numbered steps

type FieldDef = { name: L; desc: L }
type FieldGroup = { heading: L; fields: FieldDef[] }
type Item = { q: L; note?: L; a?: Answer; groups?: FieldGroup[] }
type Category = { key: string; label: L; intro: L; items: Item[] }

const HEAD: Record<Lang, { title: string; lead: string }> = {
  de: {
    title: 'Anleitung',
    lead: 'Kurzanleitung zur Pflege der Inhalte. Oben einen Bereich auswählen.',
  },
  en: {
    title: 'Guide',
    lead: 'A short guide to maintaining the content. Pick a section above.',
  },
}

const CATEGORIES: Category[] = [
  {
    key: 'general',
    label: { de: 'Allgemein', en: 'General' },
    intro: {
      de: 'Überblick über den Admin-Bereich und die wichtigsten Grundlagen.',
      en: 'An overview of the admin area and the essentials.',
    },
    items: [
      {
        q: { de: 'Was ist die Methodensammlung?', en: 'What is the Method Archive?' },
        a: {
          de: ['Die Methodensammlung ist die Inhaltsdatenbank hinter der Website. Hier werden alle Methoden, die wählbaren Filter, die Nutzerkonten und die rechtlichen Texte gepflegt.'],
          en: ['The Method Archive is the content database behind the website. Here you maintain all methods, the selectable filters, the user accounts and the legal texts.'],
        },
      },
      {
        q: { de: 'Wie ist der Admin aufgebaut?', en: 'How is the admin structured?' },
        a: {
          de: ['Die Seitenleiste gliedert sich in: „Methodensammlung“ (die Methoden), die Gruppen „Filter: …“ (die Filter-Kategorien), „Administration“ (Nutzer) und „Plattform-Einstellungen“. Ganz unten steht diese Anleitung.'],
          en: ['The sidebar is divided into: “Method Archive” (the methods), the “Filter: …” groups (the filter categories), “Administration” (users) and “Platform Settings”. This guide sits at the very bottom.'],
        },
      },
      {
        q: { de: 'Wie speichere ich Änderungen – und sind sie zweisprachig?', en: 'How do I save changes – and are they bilingual?' },
        a: {
          de: ['Jeder Eintrag wird über „Speichern“ gesichert und ist sofort auf der Website sichtbar. Die meisten Inhalte gibt es auf Deutsch und Englisch – am besten immer beide Sprachen pflegen.'],
          en: ['Every entry is stored via “Save” and is live on the website immediately. Most content exists in German and English – ideally always maintain both languages.'],
        },
      },
    ],
  },
  {
    key: 'language',
    label: { de: 'Sprache', en: 'Language' },
    intro: {
      de: 'Wie Inhalte und die Bedienoberfläche mit zwei Sprachen umgehen.',
      en: 'How content and the interface handle two languages.',
    },
    items: [
      {
        q: { de: 'Wie pflege ich Inhalte auf Deutsch und Englisch?', en: 'How do I maintain content in German and English?' },
        a: {
          de: ['Die Website ist zweisprachig. Übersetzbare Felder (z. B. bei Methoden) werden pro Sprache gespeichert. Oben in der Leiste lässt sich über das Sprach-Auswahlfeld („Deutsch“ / „English“) umschalten – danach zeigen alle übersetzbaren Felder die gewählte Sprache. Zuerst Deutsch pflegen, dann optional Englisch. Fehlt die englische Fassung, zeigt die Website automatisch die deutsche – Deutsch ist die Standardsprache.'],
          en: ['The website is bilingual. Translatable fields (e.g. on methods) are stored per language. Use the locale selector at the top of the bar („Deutsch“ / „English“) to switch – all translatable fields then show the chosen language. Fill in German first, then optionally English. If the English version is missing, the website automatically shows the German one – German is the default language.'],
        },
      },
      {
        q: { de: 'Welche Inhalte sind zweisprachig – und welche nicht?', en: 'Which content is bilingual – and which isn’t?' },
        a: {
          de: ['Zweisprachig sind die Methoden (Titel, Auszug, Ziel, Ablauf, Tipps …), die Filterwerte (je ein deutsches und ein englisches Namensfeld) sowie die Plattform-Texte (Impressum, Datenschutz, Kontakt). Gemeinsam für beide Sprachen gelten dagegen Verknüpfungen, Bilder, der Slug und der Status.'],
          en: ['Bilingual: methods (title, excerpt, goal, procedure, tips …), the filter values (a German and an English name field each) and the platform texts (imprint, privacy, contact). Shared across both languages: relationships, images, the slug and the status.'],
        },
      },
      {
        q: { de: 'Wie stelle ich die Sprache des Admin-Bereichs um?', en: 'How do I change the admin area’s language?' },
        a: {
          de: [
            'Die Sprache der Bedienoberfläche (Menüs, Buttons, diese Anleitung) wird pro Nutzer:in eingestellt – unabhängig von den Inhalten.',
            'Oben rechts auf das eigene Konto klicken und die Konto-Einstellungen öffnen.',
            'Unter „Sprache“ Deutsch oder Englisch wählen und speichern.',
            'Die Einstellung gilt nur für das eigene Konto und ändert nichts an den gespeicherten Inhalten.',
          ],
          en: [
            'The interface language (menus, buttons, this guide) is set per user – independently of the content.',
            'Click your account in the top right and open the account settings.',
            'Under “Language”, choose German or English and save.',
            'The setting applies only to you and doesn’t change any stored content.',
          ],
        },
      },
    ],
  },
  {
    key: 'methods',
    label: { de: 'Methoden', en: 'Methods' },
    intro: {
      de: 'Das Herzstück der Sammlung.',
      en: 'The heart of the archive.',
    },
    items: [
      {
        q: { de: 'Was ist eine Methode?', en: 'What is a method?' },
        a: {
          de: ['Eine Methode ist ein einzelner Eintrag in der Sammlung „Methodensammlung“. Sie bündelt Titel, Beschreibung, Ablauf (Vorbereitung, Durchführung, Auswertung), Tipps, Hinweise und die Verknüpfungen zu den Filtern.'],
          en: ['A method is a single entry in the “Method Archive” collection. It bundles the title, description, procedure (preparation, execution, evaluation), tips, notes and the relationships to the filters.'],
        },
      },
      {
        q: { de: 'Wie erstelle ich eine Methode? – Feld für Feld', en: 'How do I create a method? – Field by field' },
        note: {
          de: 'Möglichst viele Felder ausfüllen – je vollständiger die Methode, desto besser. Verpflichtend sind nur: Titel, Auszug, Ziel der Methode, Vorbereitung, Durchführung und Auswertung.',
          en: 'Fill in as many fields as possible – the more complete the method, the better. Only these are required: Title, Excerpt, Goal of the method, Preparation, Execution and Evaluation.',
        },
        groups: [
          {
            heading: { de: 'Reiter „Allgemein“', en: '“General” tab' },
            fields: [
              {
                name: { de: 'Titel', en: 'Title' },
                desc: {
                  de: 'Name der Methode – erscheint auf der Karte und der Detailseite. Aus ihm wird automatisch der Slug (URL) erzeugt.',
                  en: 'Name of the method – shown on the card and the detail page. The slug (URL) is generated from it automatically.',
                },
              },
              {
                name: { de: 'Auszug', en: 'Excerpt' },
                desc: {
                  de: 'Kurze Zusammenfassung in 1–2 Sätzen für die Methodenkarte.',
                  en: 'A short 1–2 sentence summary for the method card.',
                },
              },
              {
                name: { de: 'Ziel der Methode', en: 'Goal of the method' },
                desc: {
                  de: 'Was sich mit der Methode erreichen lässt.',
                  en: 'What the method helps you achieve.',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Ablauf“', en: '“Procedure” tab' },
            fields: [
              {
                name: { de: 'Vorbereitung / Durchführung / Auswertung', en: 'Preparation / Execution / Evaluation' },
                desc: {
                  de: 'Der Ablauf in Abschnitten. Pro Schritt „Titel“ und „Inhalt“; über „+“ weitere Abschnitte hinzufügen und per Drag-and-drop sortieren.',
                  en: 'The procedure in sections. Each step has a “Title” and “Content”; add more via “+” and reorder by drag-and-drop.',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Hinweise“', en: '“Notes” tab' },
            fields: [
              {
                name: { de: 'Wann sinnvoll? / Wann nicht sinnvoll?', en: 'When useful? / When not useful?' },
                desc: {
                  de: 'Empfehlungen, wann der Einsatz passt – und wann nicht.',
                  en: 'Guidance on when the method fits – and when it doesn’t.',
                },
              },
              {
                name: { de: 'Tipps', en: 'Tips' },
                desc: {
                  de: 'Praktische Hinweise zur Umsetzung.',
                  en: 'Practical hints for carrying it out.',
                },
              },
              {
                name: { de: 'Ungeeignet für', en: 'Not suitable for' },
                desc: {
                  de: 'Situationen, in denen die Methode nicht passt.',
                  en: 'Situations the method is not a good fit for.',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Verknüpfungen & Medien“', en: '“Links & media” tab' },
            fields: [
              {
                name: { de: 'Ähnliche Methoden', en: 'Similar methods' },
                desc: {
                  de: 'Verweise auf verwandte Methoden (Mehrfachauswahl).',
                  en: 'Links to related methods (multiple selection).',
                },
              },
              {
                name: { de: 'Wie kann es weiter gehen?', en: 'What can follow?' },
                desc: {
                  de: 'Methoden, die sich sinnvoll anschließen können.',
                  en: 'Methods that can sensibly follow on.',
                },
              },
              {
                name: { de: 'Galerie', en: 'Gallery' },
                desc: {
                  de: 'Mehrere Bilder aus der Medien-Bibliothek.',
                  en: 'Several images from the media library.',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Zuordnung“', en: '“Classification” tab' },
            fields: [
              {
                name: {
                  de: 'Beteiligungstiefen, Projektphasen, Ziele, Formate, Zeitrahmen, Zielgruppen, Gruppengrößen, Merkmale',
                  en: 'Participation depths, Project phases, Goals, Formats, Durations, Target groups, Group sizes, Characteristics',
                },
                desc: {
                  de: 'Die Filter-Verknüpfungen. Sie bestimmen, unter welchen Filtern die Methode auf der Website gefunden wird – Mehrfachauswahl möglich. Die Werte stammen aus den „Filter: …“-Kategorien.',
                  en: 'The filter relationships. They decide which filters the method appears under on the website – multiple selection. The values come from the “Filter: …” categories.',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Weiteres“', en: '“More” tab' },
            fields: [
              {
                name: { de: 'Slug (automatisch generiert)', en: 'Slug (auto-generated)' },
                desc: {
                  de: 'Wird automatisch aus dem deutschen Titel erzeugt und bildet die Seiten-URL – kann bei Bedarf überschrieben werden.',
                  en: 'Generated automatically from the German title and forms the page URL – can be overridden if needed.',
                },
              },
            ],
          },
          {
            heading: { de: 'Seitenleiste', en: 'Sidebar' },
            fields: [
              {
                name: { de: 'Status', en: 'Status' },
                desc: {
                  de: '„Entwurf“ oder „Veröffentlicht“. Nur veröffentlichte Methoden erscheinen auf der Website (Standard: Entwurf).',
                  en: '“Draft” or “Published”. Only published methods appear on the website (default: Draft).',
                },
              },
              {
                name: { de: 'Bild', en: 'Image' },
                desc: {
                  de: 'Titelbild der Methode aus der Medien-Bibliothek.',
                  en: 'The method’s cover image from the media library.',
                },
              },
            ],
          },
        ],
      },
      {
        q: { de: 'Speichern, bearbeiten und löschen', en: 'Saving, editing and deleting' },
        a: {
          de: [
            'Erstellen: „Methodensammlung“ öffnen, auf „Neu erstellen“ klicken, die Felder ausfüllen und speichern.',
            'Bearbeiten: In der Liste auf eine Methode klicken, die Felder ändern und erneut speichern.',
            'Löschen: Die Methode öffnen und oben „Löschen“ wählen – oder mehrere Einträge in der Liste markieren und gesammelt löschen.',
            'Tipp: Den Status erst auf „Veröffentlicht“ setzen, wenn alle Pflichtangaben und beide Sprachen vollständig sind.',
          ],
          en: [
            'Create: Open “Method Archive”, click “Create new”, fill in the fields and save.',
            'Edit: Click a method in the list, change the fields and save again.',
            'Delete: Open the method and choose “Delete” at the top – or select several entries in the list and delete them at once.',
            'Tip: Only set the status to “Published” once all required fields and both languages are complete.',
          ],
        },
      },
    ],
  },
  {
    key: 'categories',
    label: { de: 'Kategorien', en: 'Categories' },
    intro: {
      de: 'Die Filter, nach denen Methoden eingegrenzt werden.',
      en: 'The filters used to narrow down methods.',
    },
    items: [
      {
        q: { de: 'Was sind Kategorien?', en: 'What are categories?' },
        a: {
          de: ['Kategorien sind die Filter, nach denen Besucher:innen Methoden eingrenzen – z. B. Zielgruppe, Ziel, Format oder Zeitrahmen. In der Seitenleiste tragen sie das Präfix „Filter: …“.'],
          en: ['Categories are the filters visitors use to narrow down methods – e.g. target group, goal, format or timeframe. In the sidebar they carry the “Filter: …” prefix.'],
        },
      },
      {
        q: { de: 'Wie erstelle, bearbeite oder lösche ich einen Filterwert?', en: 'How do I create, edit or delete a filter value?' },
        a: {
          de: [
            'Die gewünschte Gruppe „Filter: …“ und darin „Einträge“ öffnen.',
            'Über „Neu erstellen“ einen Wert anlegen; er steht danach sofort als Filter und im Methoden-Formular zur Auswahl.',
            'Bearbeiten und Löschen funktionieren wie bei Methoden.',
          ],
          en: [
            'Open the desired “Filter: …” group and within it “Entries”.',
            'Use “Create new” to add a value; it is then immediately available as a filter and in the method form.',
            'Editing and deleting work just like with methods.',
          ],
        },
      },
      {
        q: { de: 'Was bedeuten „Kategorien“ und „Einstellungen“ innerhalb eines Filters?', en: 'What do “Categories” and “Settings” within a filter mean?' },
        a: {
          de: ['Projektphasen und Zeitrahmen sind zusätzlich in Ober-Kategorien gruppiert – erst die Kategorie anlegen, dann die Einträge. Unter „Einstellungen“ lässt sich z. B. das Icon des Filters festlegen.'],
          en: ['Project phases and timeframes are additionally grouped into parent categories – create the category first, then the entries. Under “Settings” you set things like the filter’s icon.'],
        },
      },
    ],
  },
  {
    key: 'users',
    label: { de: 'Nutzerverwaltung', en: 'User management' },
    intro: {
      de: 'Konten mit Zugang zum Admin-Bereich.',
      en: 'Accounts with access to the admin area.',
    },
    items: [
      {
        q: { de: 'Was ist ein Nutzer?', en: 'What is a user?' },
        a: {
          de: ['Ein Nutzer ist ein Konto mit Zugang zu diesem Admin-Bereich. Die Nutzer stehen unter „Administration“.'],
          en: ['A user is an account with access to this admin area. You’ll find the users under “Administration”.'],
        },
      },
      {
        q: { de: 'Wie lege ich einen Nutzer an, bearbeite oder lösche ihn?', en: 'How do I create, edit or delete a user?' },
        a: {
          de: [
            'Erstellen: „Administration“ → „Neu erstellen“, E-Mail und Passwort vergeben, speichern.',
            'Bearbeiten: Nutzer öffnen, Daten ändern, speichern.',
            'Löschen: Nutzer öffnen und „Löschen“ wählen.',
          ],
          en: [
            'Create: “Administration” → “Create new”, set an email and password, save.',
            'Edit: Open the user, change the details, save.',
            'Delete: Open the user and choose “Delete”.',
          ],
        },
      },
      {
        q: { de: 'Worauf sollte ich achten?', en: 'What should I keep in mind?' },
        a: {
          de: ['Sichere Passwörter vergeben und nicht mehr benötigte Konten entfernen. Das eigene aktive Konto nicht löschen – sonst ist der Zugang gesperrt.'],
          en: ['Use strong passwords and remove accounts that are no longer needed. Don’t delete your own active account – otherwise you’ll lock yourself out.'],
        },
      },
    ],
  },
  {
    key: 'platform',
    label: { de: 'Plattformeinstellungen', en: 'Platform settings' },
    intro: {
      de: 'Die einmaligen Inhalte der Website.',
      en: 'The website’s one-off content.',
    },
    items: [
      {
        q: { de: 'Was sind die Plattform-Einstellungen?', en: 'What are the platform settings?' },
        a: {
          de: ['Hier liegen die einmaligen Inhalte der Website: Impressum, Datenschutzerklärung und die Kontaktangaben.'],
          en: ['This is where the website’s one-off content lives: imprint, privacy policy and the contact details.'],
        },
      },
      {
        q: { de: 'Wie bearbeite ich Impressum, Datenschutz oder Kontakt?', en: 'How do I edit the imprint, privacy policy or contact?' },
        a: {
          de: [
            '„Plattform-Einstellungen“ öffnen.',
            'Den passenden Reiter wählen (Impressum / Datenschutz / Kontakt).',
            'Den Text im Editor bearbeiten – jeweils für Deutsch und Englisch – und speichern.',
          ],
          en: [
            'Open “Platform Settings”.',
            'Choose the relevant tab (Imprint / Privacy / Contact).',
            'Edit the text in the editor – for German and English – and save.',
          ],
        },
      },
      {
        q: { de: 'Sind die Inhalte zweisprachig?', en: 'Is the content bilingual?' },
        a: {
          de: ['Ja. Jeder Bereich hat ein Feld für Deutsch und eines für Englisch. Beide pflegen, damit die Website in beiden Sprachen vollständig ist.'],
          en: ['Yes. Each area has a field for German and one for English. Maintain both so the website is complete in both languages.'],
        },
      },
    ],
  },
  {
    key: 'api',
    label: { de: 'API', en: 'API' },
    intro: {
      de: 'Programmatischer Zugriff auf die Inhalte über die REST-API – z. B. um Methoden auf einer anderen Website einzubinden.',
      en: 'Programmatic access to the content via the REST API – e.g. to embed methods on another website.',
    },
    items: [
      {
        q: { de: 'Was bietet die API?', en: 'What does the API offer?' },
        a: {
          de: ['Payload stellt automatisch eine REST-API bereit. Methoden lassen sich z. B. über „GET /api/methods“ (Liste) und „GET /api/methods/<id>“ (Einzeleintrag) abrufen – inklusive Filter-Verknüpfungen, Bildern und beiden Sprachen. Die API ist nicht öffentlich: Anfragen benötigen einen API-Schlüssel.'],
          en: ['Payload automatically provides a REST API. Methods can be fetched via “GET /api/methods” (list) and “GET /api/methods/<id>” (single entry) – including filter relationships, images and both languages. The API is not public: requests require an API key.'],
        },
      },
      {
        q: { de: 'Wie erstelle ich einen API-Schlüssel?', en: 'How do I create an API key?' },
        a: {
          de: [
            'Öffne „Administration“ → „API-Clients“ und erstelle einen Eintrag (z. B. „Partner-Website“).',
            'Aktiviere „Enable API Key“ und speichere – der Schlüssel wird generiert.',
            'Kopiere den Schlüssel sicher; er lässt sich jederzeit über „Generate new API Key“ erneuern.',
            'API-Schlüssel sind schreibgeschützt – sie können Inhalte nur lesen, nicht ändern oder löschen.',
          ],
          en: [
            'Open “Administration” → “API Clients” and create an entry (e.g. “Partner website”).',
            'Tick “Enable API Key” and save – the key is generated.',
            'Copy the key somewhere safe; you can renew it anytime via “Generate new API Key”.',
            'API keys are read-only – they can only read content, not change or delete it.',
          ],
        },
      },
      {
        q: { de: 'Wie authentifiziere ich Anfragen?', en: 'How do I authenticate requests?' },
        a: {
          de: [
            'Sende den Schlüssel bei jeder Anfrage im Header:',
            'Authorization: api-clients API-Key <DEIN_SCHLÜSSEL>',
            'Beispiel mit curl: curl -H "Authorization: api-clients API-Key <KEY>" "https://<domain>/api/methods?locale=de&depth=2"',
          ],
          en: [
            'Send the key in the header of every request:',
            'Authorization: api-clients API-Key <YOUR_KEY>',
            'Example with curl: curl -H "Authorization: api-clients API-Key <KEY>" "https://<domain>/api/methods?locale=en&depth=2"',
          ],
        },
      },
      {
        q: { de: 'Nützliche Abfrage-Parameter', en: 'Useful query parameters' },
        groups: [
          {
            heading: { de: 'An die URL anhängen (?param=…&param=…)', en: 'Append to the URL (?param=…&param=…)' },
            fields: [
              { name: { de: 'locale', en: 'locale' }, desc: { de: '„de“ oder „en“ – gibt die Inhalte in der Sprache zurück (Fallback: Deutsch).', en: '“de” or “en” – returns content in that language (fallback: German).' } },
              { name: { de: 'depth', en: 'depth' }, desc: { de: 'Wie tief Verknüpfungen aufgelöst werden, z. B. „2“ für Filterwerte und Bild-URLs.', en: 'How deep relationships are resolved, e.g. “2” for filter values and image URLs.' } },
              { name: { de: 'where', en: 'where' }, desc: { de: 'Filtern der Ergebnisse, z. B. where[status][equals]=published oder where[slug][equals]=<slug>.', en: 'Filter the results, e.g. where[status][equals]=published or where[slug][equals]=<slug>.' } },
              { name: { de: 'limit & page', en: 'limit & page' }, desc: { de: 'Seitengröße und Blättern (Standard: 10 pro Seite).', en: 'Page size and pagination (default: 10 per page).' } },
              { name: { de: 'sort', en: 'sort' }, desc: { de: 'Sortierung, z. B. „-createdAt“ (neueste zuerst).', en: 'Sorting, e.g. “-createdAt” (newest first).' } },
            ],
          },
        ],
      },
      {
        q: { de: 'Worauf muss ich achten?', en: 'What should I keep in mind?' },
        a: {
          de: [
            'Schlüssel nur an vertrauenswürdige Stellen weitergeben. Bei Verdacht den API-Client löschen oder den Schlüssel neu generieren.',
            'Nur veröffentlichte Methoden anzeigen? Dann „where[status][equals]=published“ verwenden – sonst kommen auch Entwürfe mit.',
            'Für den Zugriff direkt aus dem Browser einer anderen Domain muss zusätzlich CORS eingerichtet werden. Server-zu-Server-Aufrufe (z. B. curl) sind davon nicht betroffen.',
          ],
          en: [
            'Only share keys with trusted parties. If a key is exposed, delete the API client or generate a new key.',
            'Only want published methods? Use “where[status][equals]=published” – otherwise drafts are included too.',
            'Accessing the API directly from a browser on another domain additionally requires CORS to be configured. Server-to-server calls (e.g. curl) are not affected.',
          ],
        },
      },
    ],
  },
]

const mutedStyle: React.CSSProperties = { color: 'var(--theme-elevation-650)', margin: 0, lineHeight: 1.5 }

function AnswerBody({ lines }: { lines: string[] }) {
  if (lines.length === 1) return <p style={mutedStyle}>{lines[0]}</p>
  return (
    <ol style={{ ...mutedStyle, paddingLeft: '1.25rem', display: 'grid', gap: '0.4rem' }}>
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ol>
  )
}

export function DocumentationContent({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(CATEGORIES[0].key)
  const head = HEAD[lang]
  const current = CATEGORIES.find((c) => c.key === active) ?? CATEGORIES[0]

  return (
    <Gutter>
      <div style={{ width: '100%' }}>
        <h1 style={{ marginBottom: 'calc(var(--base) / 2)' }}>{head.title}</h1>
        <p style={{ color: 'var(--theme-elevation-650)', marginBottom: 'calc(var(--base) * 1.25)', fontSize: '1.05rem' }}>
          {head.lead}
        </p>

        {/* Tabs */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            borderBottom: '1px solid var(--theme-elevation-100)',
            marginBottom: 'calc(var(--base) * 1.25)',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.key === active
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat.key)}
                style={{
                  appearance: 'none',
                  background: 'transparent',
                  border: 0,
                  borderBottom: `2px solid ${isActive ? 'var(--theme-elevation-800)' : 'transparent'}`,
                  margin: 0,
                  marginBottom: '-1px',
                  padding: '0.5rem 0.85rem',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-500)',
                }}
              >
                {cat.label[lang]}
              </button>
            )
          })}
        </div>

        {/* Active section — constrained to ~70ch for a WCAG-friendly reading measure (optimum 50–75). */}
        <div style={{ maxWidth: '70ch' }}>
          <p style={{ color: 'var(--theme-elevation-650)', marginBottom: 'var(--base)' }}>{current.intro[lang]}</p>

          <div style={{ display: 'grid', gap: 'var(--base)' }}>
            {current.items.map((item) => (
            <section
              key={item.q.en}
              style={{
                background: 'var(--theme-elevation-50)',
                border: '1px solid var(--theme-elevation-100)',
                borderRadius: 'var(--style-radius-m, 6px)',
                padding: 'calc(var(--base) * 1.1)',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 'calc(var(--base) / 2)', color: 'var(--theme-elevation-800)' }}>
                {item.q[lang]}
              </h3>
              {item.note && (
                <p
                  style={{
                    ...mutedStyle,
                    background: 'var(--theme-elevation-0)',
                    borderLeft: '3px solid var(--theme-elevation-400)',
                    borderRadius: 'var(--style-radius-s, 4px)',
                    padding: '0.7rem 0.85rem',
                    marginBottom: 'var(--base)',
                  }}
                >
                  {item.note[lang]}
                </p>
              )}
              {item.groups ? (
                <div style={{ display: 'grid', gap: 'var(--base)' }}>
                  {item.groups.map((group) => (
                    <div key={group.heading.en}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--theme-elevation-800)', fontSize: '0.95rem' }}>
                        {group.heading[lang]}
                      </h4>
                      <dl style={{ display: 'grid', gap: '0.6rem', margin: 0 }}>
                        {group.fields.map((field) => (
                          <div
                            key={field.name.en}
                            style={{
                              display: 'grid',
                              gap: '0.15rem',
                              background: 'var(--theme-elevation-0)',
                              border: '1px solid var(--theme-elevation-100)',
                              borderRadius: 'var(--style-radius-s, 4px)',
                              padding: '0.7rem 0.85rem',
                            }}
                          >
                            <dt style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--theme-elevation-800)' }}>{field.name[lang]}</dt>
                            <dd style={{ ...mutedStyle }}>{field.desc[lang]}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ) : (
                <AnswerBody lines={item.a![lang]} />
              )}
            </section>
          ))}
          </div>
        </div>
      </div>
    </Gutter>
  )
}

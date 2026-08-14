// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { Gutter } from '@payloadcms/ui'
import React, { useState } from 'react'

type Lang = 'de' | 'en'
type L = Record<Lang, string>
type Answer = Record<Lang, string[]> // 1 entry → paragraph, several → numbered steps

type FieldDef = { name: L; desc: L }
type FieldGroup = { heading: L; fields: FieldDef[] }
type Item = { q: L; note?: L; a?: Answer; groups?: FieldGroup[]; code?: L }
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
          de: ['Die Seitenleiste gliedert sich in: „Methodensammlung“ (die Methoden), die Gruppen „Filter: …“ (die Filter-Kategorien), „Administration“ (Nutzer), „Plattform-Einstellungen“ und „Rechtliches“. Ganz unten steht diese Anleitung.'],
          en: ['The sidebar is divided into: “Method Archive” (the methods), the “Filter: …” groups (the filter categories), “Administration” (users), “Platform Settings” and “Legal”. This guide sits at the very bottom.'],
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
          de: ['Zweisprachig sind die Methoden (Titel, Auszug, Ziel, Ablauf, Tipps …), die Filterwerte (je ein deutsches und ein englisches Namensfeld), die Rechtstexte (Impressum, Datenschutz, Cookie-Richtlinie, Erklärung zur Barrierefreiheit), die Alternativtexte von Bildern sowie die Kontaktangaben. Gemeinsam für beide Sprachen gelten dagegen Verknüpfungen, Bilder, der Slug und der Status.'],
          en: ['Bilingual: methods (title, excerpt, goal, procedure, tips …), the filter values (a German and an English name field each), the legal texts (imprint, privacy, cookie policy, accessibility statement), the alt texts of images and the contact details. Shared across both languages: relationships, images, the slug and the status.'],
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
                name: { de: 'Status', en: 'Status' },
                desc: {
                  de: '„Entwurf“ oder „Veröffentlicht“. Nur veröffentlichte Methoden erscheinen auf der Website (Standard: Entwurf).',
                  en: '“Draft” or “Published”. Only published methods appear on the website (default: Draft).',
                },
              },
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
            heading: { de: 'Reiter „Praxisbeispiele“', en: '“Best Practices” tab' },
            fields: [
              {
                name: { de: 'Praxisbeispiele', en: 'Best Practices' },
                desc: {
                  de: 'Optionale Beispiele aus der Praxis – gleiche Abschnitts-Struktur wie der Ablauf (Titel + Inhalt). Der Bereich erscheint auf der Website nur, wenn Abschnitte oder Bilder vorhanden sind.',
                  en: 'Optional real-world examples – same section structure as the procedure (title + content). The area only appears on the website when sections or images exist.',
                },
              },
              {
                name: { de: 'Galerie', en: 'Gallery' },
                desc: {
                  de: 'Bilder zu den Praxisbeispielen mit übersetzbarer Bildunterschrift. Sie erscheinen als horizontal scrollbare Galerie mit Vollbildansicht unterhalb der Abschnitte.',
                  en: 'Images for the best-practice examples with a translatable caption. They appear as a horizontally scrollable gallery with a fullscreen view below the sections.',
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
            heading: { de: 'Reiter „Verknüpfungen“', en: '“Links” tab' },
            fields: [
              {
                name: { de: 'Ähnliche Methoden', en: 'Similar methods' },
                desc: {
                  de: 'Verweise auf verwandte Methoden (Mehrfachauswahl). Die Verknüpfung ist beidseitig: Eine hier hinzugefügte Methode erhält diese automatisch ebenfalls in ihren „Ähnlichen Methoden“ – das Entfernen wirkt auf beiden Seiten.',
                  en: 'Links to related methods (multiple selection). The link is mutual: a method added here automatically gets this one in its own “Similar methods” too – removing it works on both sides.',
                },
              },
              {
                name: { de: 'Wie kann es weiter gehen?', en: 'What can follow?' },
                desc: {
                  de: 'Methoden, die sich sinnvoll anschließen können (einseitig, nur hier gesetzt).',
                  en: 'Methods that can sensibly follow on (one-directional, set here only).',
                },
              },
            ],
          },
          {
            heading: { de: 'Reiter „Bilder“', en: '“Images” tab' },
            fields: [
              {
                name: { de: 'Titelbild', en: 'Cover image' },
                desc: {
                  de: 'Titelbild der Methode aus der Medien-Bibliothek (Karte und Detailseite-Hero).',
                  en: 'The method’s cover image from the media library (card and detail-page hero).',
                },
              },
              {
                name: { de: 'Galerie', en: 'Gallery' },
                desc: {
                  de: 'Mehrere weitere Bilder aus der Medien-Bibliothek für die Galerie auf der Detailseite.',
                  en: 'Several additional images from the media library for the gallery on the detail page.',
                },
              },
              {
                name: { de: 'Hinweis: Bild-Uploads', en: 'Note: image uploads' },
                desc: {
                  de: 'Beim Hochladen ist ein deutscher Alternativtext Pflicht (für Screenreader; in der Galerie auch als Untertitel). Kurz beschreiben, was zu sehen ist – nicht mit „Bild von …“ beginnen. Nur Bilddateien bis 5 MB; sie werden automatisch verkleinert und als WebP gespeichert.',
                  en: 'A German alt text is required on upload (for screen readers; also the caption in the gallery). Briefly describe what is shown – don’t start with “image of …”. Image files up to 5 MB only; they are automatically resized and stored as WebP.',
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
    key: 'legal',
    label: { de: 'Rechtliches', en: 'Legal' },
    intro: {
      de: 'Die Rechtstexte der Website: Impressum, Datenschutz, Cookie-Richtlinie und Erklärung zur Barrierefreiheit.',
      en: 'The website’s legal texts: imprint, privacy policy, cookie policy and accessibility statement.',
    },
    items: [
      {
        q: { de: 'Was steht unter „Rechtliches“?', en: 'What is under “Legal”?' },
        a: {
          de: ['Hier liegen die vier Rechtstexte der Website – jeweils in einem eigenen Reiter: „Impressum“, „Datenschutz“, „Cookie-Richtlinie“ und „Barrierefreiheit“. Jeder Text hat eine eigene öffentliche Seite, die im Footer verlinkt ist. In der Erklärung zur Barrierefreiheit bitte die Platzhalter in eckigen Klammern (Feedback-Adresse, zuständige Stelle) ergänzen.'],
          en: ['This holds the website’s four legal texts – each in its own tab: “Imprint”, “Privacy Policy”, “Cookie Policy” and “Accessibility”. Each text has its own public page, linked in the footer. In the accessibility statement, please fill in the bracketed placeholders (feedback address, responsible body).'],
        },
      },
      {
        q: { de: 'Wie bearbeite ich einen Rechtstext?', en: 'How do I edit a legal text?' },
        a: {
          de: [
            '„Rechtliches“ in der Seitenleiste öffnen.',
            'Den passenden Reiter wählen (Impressum / Datenschutz / Cookie-Richtlinie).',
            'Den Text im Editor bearbeiten – jeweils für Deutsch und Englisch – und speichern.',
          ],
          en: [
            'Open “Legal” in the sidebar.',
            'Choose the relevant tab (Imprint / Privacy Policy / Cookie Policy).',
            'Edit the text in the editor – for German and English – and save.',
          ],
        },
      },
      {
        q: { de: 'Sind die Rechtstexte zweisprachig?', en: 'Are the legal texts bilingual?' },
        a: {
          de: ['Ja. Jeder Reiter hat ein Feld für Deutsch und eines für Englisch. Beide pflegen, damit die Seiten in beiden Sprachen vollständig sind.'],
          en: ['Yes. Each tab has a field for German and one for English. Maintain both so the pages are complete in both languages.'],
        },
      },
    ],
  },
  {
    key: 'platform',
    label: { de: 'Plattformeinstellungen', en: 'Platform settings' },
    intro: {
      de: 'Übergreifende Einstellungen der Website.',
      en: 'The website’s cross-cutting settings.',
    },
    items: [
      {
        q: { de: 'Was sind die Plattform-Einstellungen?', en: 'What are the platform settings?' },
        a: {
          de: ['Hier liegen die übergreifenden Einstellungen der Website: die Farben (Design), die Kontaktangaben (E-Mail-Adresse und Text der Kontaktseite), der Text der Seite „Über das Projekt“ und die Sponsoren-Logos. Die Rechtstexte (Impressum, Datenschutz, Cookie-Richtlinie) stehen separat unter „Rechtliches“.'],
          en: ['This is where the website’s cross-cutting settings live: the colors (design), the contact details (email address and the contact page text), the “About the project” page text and the sponsor logos. The legal texts (imprint, privacy, cookie policy) sit separately under “Legal”.'],
        },
      },
      {
        q: { de: 'Wie bearbeite ich die Kontaktangaben?', en: 'How do I edit the contact details?' },
        a: {
          de: [
            '„Plattform-Einstellungen“ öffnen.',
            'Den Reiter „Kontakt“ wählen.',
            'Den Text im Editor bearbeiten – jeweils für Deutsch und Englisch – und speichern.',
          ],
          en: [
            'Open “Platform Settings”.',
            'Choose the “Contact” tab.',
            'Edit the text in the editor – for German and English – and save.',
          ],
        },
      },
      {
        q: { de: 'Wie pflege ich die Sponsoren-Logos im Footer?', en: 'How do I maintain the sponsor logos in the footer?' },
        a: {
          de: [
            '„Plattform-Einstellungen“ öffnen und den Reiter „Sponsoren“ wählen.',
            'Pro Sponsor ein Logo aus der Medien-Bibliothek wählen (SVG oder Querformat-PNG mit transparentem Hintergrund wirkt am besten), den Namen eintragen (erscheint als Tooltip und für Screenreader – nicht sichtbar neben dem Logo) und optional die Website-Adresse inkl. https://. Über „Höhe (px)“ die Logogröße im Footer pixelgenau festlegen (größer für Förderlogo-Blöcke mit kleiner Schrift). Die Abstandsfelder (Oben/Rechts/Unten/Links, in Pixeln) regeln den Abstand jedes Logos im Footer pixelgenau (Links/Rechts 0 für direkt anschließende Förderlogo-Paare).',
            'Die Reihenfolge per Drag-and-drop sortieren und speichern. Die Logos erscheinen unten im Footer (nur Tooltip-Name) und auf der Seite „Über das Projekt“ mit sichtbarem Namen — jeweils nur, wenn mindestens ein Sponsor eingetragen ist. Der Text dieser Seite wird im Reiter „Über“ gepflegt.',
          ],
          en: [
            'Open “Platform Settings” and choose the “Sponsors” tab.',
            'Per sponsor, pick a logo from the media library (SVG or landscape PNG with transparent background works best), enter the name (appears as a tooltip and for screen readers – not visibly next to the logo) and optionally the website address incl. https://. Set the footer logo size precisely via “Height (px)” (larger for funding blocks with small lettering). The spacing fields (top/right/bottom/left, in pixels) control each footer logo’s spacing precisely (left/right 0 for funding pairs that sit flush).',
            'Reorder by drag-and-drop and save. The logos appear at the bottom of the footer (tooltip name only) and on the “About the project” page with visible names — each only when at least one sponsor is set. That page’s text is maintained in the “About” tab.',
          ],
        },
      },
      {
        q: { de: 'Sind die Inhalte zweisprachig?', en: 'Is the content bilingual?' },
        a: {
          de: ['Ja. Die Text-Bereiche haben je ein Feld für Deutsch und eines für Englisch. Beide pflegen, damit die Website in beiden Sprachen vollständig ist.'],
          en: ['Yes. The text areas each have a field for German and one for English. Maintain both so the website is complete in both languages.'],
        },
      },
    ],
  },
  {
    key: 'assistant',
    label: { de: 'Assistent', en: 'Assistant' },
    intro: {
      de: 'Der Methoden-Assistent ist der optionale KI-Chat auf der Website, der Besucher:innen passende Methoden aus der Sammlung vorschlägt.',
      en: 'The Method Assistant is the optional AI chat on the website that suggests suitable methods from the collection to visitors.',
    },
    items: [
      {
        q: { de: 'Was ist der Methoden-Assistent — und was passiert, wenn er aus ist?', en: 'What is the Method Assistant — and what happens when it is off?' },
        a: {
          de: ['Der Assistent beantwortet Fragen im Chat und empfiehlt ausschließlich veröffentlichte Methoden aus der Sammlung — er erfindet keine Inhalte. Er erscheint nur, wenn er unter „Assistent“ aktiviert und ein API-Schlüssel hinterlegt ist. Ist er deaktiviert, nicht eingerichtet oder das Tageslimit erreicht, wird der Chat einfach ausgeblendet und die Website funktioniert normal über die Filter-Suche weiter — es geht nichts kaputt.'],
          en: ['The assistant answers questions in a chat and recommends only published methods from the collection — it does not invent content. It only appears when it is enabled under “Assistant” and an API key is configured. If it is disabled, unconfigured, or the daily limit is reached, the chat is simply hidden and the website keeps working normally via the filter search — nothing breaks.'],
        },
      },
      {
        q: { de: 'Wie richte ich den Assistenten ein? (API-Schlüssel)', en: 'How do I set up the assistant? (API key)' },
        a: {
          de: [
            'Konto beim Anbieter anlegen: Standard ist Mistral (EU) — auf console.mistral.ai registrieren und Zahlungsdaten hinterlegen. Dort empfiehlt sich auch gleich ein monatliches Kostenlimit.',
            'In der Mistral-Konsole unter „API Keys“ einen neuen Schlüssel erstellen und sofort kopieren — er wird nur einmal angezeigt.',
            'Im Admin „Assistent“ öffnen: Anbieter „Mistral“ wählen und den Schlüssel in das Feld „API-Schlüssel“ einfügen. Alternativ (sicherer) das Feld leer lassen und den Schlüssel serverseitig als Umgebungsvariable MISTRAL_API_KEY hinterlegen lassen — das übernimmt die technische Betreuung.',
            'Das Modell-Feld leer lassen — es gilt automatisch ein günstiger Standard (mistral-small-latest).',
            'Speichern und auf der Website eine Testfrage im Chat stellen — kommt eine Antwort mit Methoden-Karten, ist alles korrekt eingerichtet.',
          ],
          en: [
            'Create an account with the provider: the default is Mistral (EU) — register at console.mistral.ai and add billing details. Setting a monthly spend limit there is recommended.',
            'In the Mistral console, create a new key under “API Keys” and copy it immediately — it is shown only once.',
            'Open “Assistant” in the admin: choose the provider “Mistral” and paste the key into the “API key” field. Alternatively (more secure), leave the field empty and have the key set server-side as the MISTRAL_API_KEY environment variable — that is a job for technical maintenance.',
            'Leave the model field empty — a sensible cheap default applies automatically (mistral-small-latest).',
            'Save, then ask a test question in the chat on the website — if an answer with method cards comes back, everything is set up correctly.',
          ],
        },
      },
      {
        q: { de: 'Was kostet der Assistent und wie ist er gegen Missbrauch geschützt?', en: 'What does the assistant cost and how is it protected against abuse?' },
        a: {
          de: ['Eine typische Unterhaltung kostet Bruchteile eines Cents. Drei Schutzmechanismen begrenzen die Kosten: das „Anfrage-Limit“ pro Besucher-IP (einstellbar im Assistent-Bereich, Standard 20 pro 5 Minuten), ein globales Tageslimit über alle Besucher:innen hinweg (Server-Einstellung, Standard 600 pro Tag — danach verschwindet der Chat bis zum nächsten Tag) und eine Begrenzung der Antwortlänge. Zusätzlich empfiehlt sich ein Kostenlimit direkt in der Anbieter-Konsole — das fängt alles Übrige ab.'],
          en: ['A typical conversation costs fractions of a cent. Three guards bound the cost: the per-visitor-IP “rate limit” (adjustable in the Assistant area, default 20 per 5 minutes), a global daily limit across all visitors (server setting, default 600 per day — after that the chat disappears until the next day), and a cap on answer length. Additionally, a spend limit directly in the provider console is recommended — it catches everything else.'],
        },
      },
      {
        q: { de: 'Was ist beim Datenschutz zu beachten?', en: 'What about privacy?' },
        a: {
          de: ['Chat-Eingaben werden zur Beantwortung an den gewählten KI-Anbieter übermittelt; der Assistent speichert keine Gespräche auf dem Server; der Verlauf liegt nur für die Dauer der Browser-Sitzung lokal im Browser der Besucher:innen. Der Standard-Anbieter Mistral verarbeitet in der EU. Wichtig: Die Datenschutzerklärung muss den eingesetzten Anbieter nennen (Abschnitt „Methoden-Assistent“). Bei einem Wechsel zu einem US-Anbieter (Anthropic, OpenAI) muss dort zusätzlich die Drittlandübermittlung ergänzt werden.'],
          en: ['Chat input is transmitted to the selected AI provider to generate answers; the assistant does not store conversations on the server; the transcript lives only in the visitor’s browser for the duration of the browser session. The default provider Mistral processes within the EU. Important: the privacy policy must name the provider in use (“Method Assistant” section). When switching to a US provider (Anthropic, OpenAI), the third-country transfer must additionally be added there.'],
        },
      },
    ],
  },
  {
    key: 'api',
    label: { de: 'API', en: 'API' },
    intro: {
      de: 'Programmatischer Lesezugriff auf die Inhalte über die GraphQL-API – z. B. um Methoden auf einer anderen Website einzubinden.',
      en: 'Programmatic read access to the content via the GraphQL API – e.g. to embed methods on another website.',
    },
    items: [
      {
        q: { de: 'Was bietet die API?', en: 'What does the API offer?' },
        a: {
          de: ['Die Inhalte lassen sich über eine GraphQL-API abrufen (Endpunkt: „POST /api/graphql“). Eine Anfrage beschreibt genau, welche Felder benötigt werden – die Antwort enthält exakt diese Felder, inklusive Filter-Verknüpfungen, Bildern und beiden Sprachen. Die API ist nicht öffentlich (Anfragen benötigen einen API-Schlüssel), schreibgeschützt und liefert ausschließlich veröffentlichte Methoden – Entwürfe bleiben unsichtbar.'],
          en: ['The content can be fetched via a GraphQL API (endpoint: “POST /api/graphql”). A request describes exactly which fields are needed – the response contains exactly those fields, including filter relationships, images and both languages. The API is not public (requests require an API key), read-only, and only returns published methods – drafts stay invisible.'],
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
            'Sende den Schlüssel bei jeder Anfrage im Header „Authorization: api-clients API-Key <DEIN_SCHLÜSSEL>“. Vollständiges Beispiel mit curl:',
          ],
          en: [
            'Send the key in the header of every request: “Authorization: api-clients API-Key <YOUR_KEY>”. Complete example with curl:',
          ],
        },
        code: {
          de: `curl -X POST "https://<domain>/api/graphql" \\
  -H "Authorization: api-clients API-Key <SCHLÜSSEL>" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ Methods(locale: de) { docs { title slug } } }"}'`,
          en: `curl -X POST "https://<domain>/api/graphql" \\
  -H "Authorization: api-clients API-Key <KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ Methods(locale: en) { docs { title slug } } }"}'`,
        },
      },
      {
        q: { de: 'Wie baue ich eine Abfrage auf?', en: 'How do I build a query?' },
        a: {
          de: [
            'Eine Abfrage besteht aus drei Teilen: dem Namen der Abfrage (z. B. „Methods“), optionalen Argumenten in runden Klammern (Sprache, Filter, Seitengröße) und in geschweiften Klammern den gewünschten Feldern. Nur diese Felder werden zurückgegeben. Verknüpfungen – etwa die Ziele einer Methode – fragst du einfach verschachtelt mit ab:',
          ],
          en: [
            'A query has three parts: the query name (e.g. “Methods”), optional arguments in parentheses (language, filters, page size) and the requested fields in curly braces. Only those fields are returned. Relationships – e.g. a method’s goals – are simply requested nested inside:',
          ],
        },
        code: {
          de: `{
  Methods(locale: de, limit: 10, sort: "title") {
    totalDocs
    docs {
      title
      auszug
      slug
      goals { name }
      targetGroups { name }
      image { url alt }
    }
  }
}`,
          en: `{
  Methods(locale: en, limit: 10, sort: "title") {
    totalDocs
    docs {
      title
      auszug
      slug
      goals { name }
      targetGroups { name }
      image { url alt }
    }
  }
}`,
        },
      },
      {
        q: { de: 'Beispiel: eine einzelne Methode abrufen', en: 'Example: fetching a single method' },
        a: {
          de: ['Über das Argument „where“ lassen sich Ergebnisse filtern – z. B. eine Methode über ihren Slug (den URL-Namen) laden, inklusive Ablauf und ähnlichen Methoden:'],
          en: ['The “where” argument filters results – e.g. load one method by its slug (the URL name), including its procedure and related methods:'],
        },
        code: {
          de: `{
  Methods(locale: de, where: { slug: { equals: "design-thinking" } }) {
    docs {
      title
      zielDerMethode
      durchfuehrung { sectionTitle content }
      aehnlicheMethoden { title slug }
    }
  }
}`,
          en: `{
  Methods(locale: en, where: { slug: { equals: "design-thinking" } }) {
    docs {
      title
      zielDerMethode
      durchfuehrung { sectionTitle content }
      aehnlicheMethoden { title slug }
    }
  }
}`,
        },
      },
      {
        q: { de: 'Welche Abfragen und Argumente gibt es?', en: 'Which queries and arguments are available?' },
        groups: [
          {
            heading: { de: 'Abfragen', en: 'Queries' },
            fields: [
              { name: { de: 'Methods', en: 'Methods' }, desc: { de: 'Liste der Methoden mit Seiteninformationen (totalDocs, page …).', en: 'List of methods with pagination info (totalDocs, page …).' } },
              { name: { de: 'Method', en: 'Method' }, desc: { de: 'Ein einzelner Eintrag über seine ID.', en: 'A single entry by its ID.' } },
              { name: { de: 'countMethods', en: 'countMethods' }, desc: { de: 'Nur die Anzahl – ohne Inhalte.', en: 'Just the count – no content.' } },
              { name: { de: 'Goals, Formats, Durations, TargetGroups, GroupSizes, Characteristics, ParticipationDepths, ProjectPhases', en: 'Goals, Formats, Durations, TargetGroups, GroupSizes, Characteristics, ParticipationDepths, ProjectPhases' }, desc: { de: 'Die Filterwerte – gleicher Aufbau wie „Methods“ (z. B. { Goals { docs { name } } }).', en: 'The filter values – same shape as “Methods” (e.g. { Goals { docs { name } } }).' } },
            ],
          },
          {
            heading: { de: 'Wichtige Argumente', en: 'Key arguments' },
            fields: [
              { name: { de: 'locale', en: 'locale' }, desc: { de: '„de“ oder „en“ – gibt die Inhalte in der Sprache zurück (Fallback: Deutsch).', en: '“de” or “en” – returns content in that language (fallback: German).' } },
              { name: { de: 'where', en: 'where' }, desc: { de: 'Filtern der Ergebnisse, z. B. { slug: { equals: "…" } } oder { title: { contains: "…" } }.', en: 'Filter the results, e.g. { slug: { equals: "…" } } or { title: { contains: "…" } }.' } },
              { name: { de: 'limit & page', en: 'limit & page' }, desc: { de: 'Seitengröße und Blättern (Standard: 10 pro Seite).', en: 'Page size and pagination (default: 10 per page).' } },
              { name: { de: 'sort', en: 'sort' }, desc: { de: 'Sortierung, z. B. „title“ oder „-createdAt“ (neueste zuerst).', en: 'Sorting, e.g. “title” or “-createdAt” (newest first).' } },
            ],
          },
        ],
      },
      {
        q: { de: 'Wie erkunde und teste ich die API?', en: 'How do I explore and test the API?' },
        a: {
          de: [
            'In der Entwicklungsumgebung gibt es unter „/api/graphql-playground“ eine interaktive Oberfläche: Abfragen tippen, Autovervollständigung nutzen und die Dokumentation aller Felder durchstöbern (auf der Live-Website ist sie abgeschaltet).',
            'Zusätzlich liegt das vollständige Schema als Datei „schema.graphql“ im Projekt – Entwickler:innen können daraus typisierte Clients generieren.',
          ],
          en: [
            'In the development environment, “/api/graphql-playground” offers an interactive interface: type queries, use autocompletion and browse the documentation of every field (it is disabled on the live website).',
            'In addition, the full schema is committed as “schema.graphql” in the project – developers can generate typed clients from it.',
          ],
        },
      },
      {
        q: { de: 'Worauf muss ich achten?', en: 'What should I keep in mind?' },
        a: {
          de: [
            'Schlüssel nur an vertrauenswürdige Stellen weitergeben. Bei Verdacht den API-Client löschen oder den Schlüssel neu generieren.',
            'API-Schlüssel funktionieren nur mit GraphQL – die klassischen REST-Adressen (z. B. „/api/methods“) lehnen sie ab.',
            'Entwürfe werden nie ausgeliefert – ein zusätzlicher Status-Filter ist nicht nötig.',
            'Sehr große, tief verschachtelte Abfragen lehnt der Server mit „maximum complexity“ ab – die Abfrage dann in kleinere Teile aufteilen.',
            'Für den Zugriff direkt aus dem Browser einer anderen Domain muss zusätzlich CORS eingerichtet werden. Server-zu-Server-Aufrufe (z. B. curl) sind davon nicht betroffen.',
          ],
          en: [
            'Only share keys with trusted parties. If a key is exposed, delete the API client or generate a new key.',
            'API keys only work with GraphQL – the classic REST URLs (e.g. “/api/methods”) reject them.',
            'Drafts are never delivered – no extra status filter is needed.',
            'Very large, deeply nested queries are rejected by the server with “maximum complexity” – split the query into smaller parts.',
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
              ) : item.a ? (
                <AnswerBody lines={item.a[lang]} />
              ) : null}
              {item.code && (
                <pre
                  style={{
                    background: 'var(--theme-elevation-0)',
                    border: '1px solid var(--theme-elevation-100)',
                    borderRadius: 'var(--style-radius-s, 4px)',
                    padding: '0.7rem 0.85rem',
                    marginTop: 'calc(var(--base) / 2)',
                    marginBottom: 0,
                    overflowX: 'auto',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: 'var(--theme-elevation-800)',
                  }}
                >
                  <code>{item.code[lang]}</code>
                </pre>
              )}
            </section>
          ))}
          </div>
        </div>
      </div>
    </Gutter>
  )
}

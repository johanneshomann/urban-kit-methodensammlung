<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Using the Methodensammlung

What the catalogue is for, how visitors and editors work with it, and how
external systems consume it. Setup is in [`OPERATIONS.md`](./OPERATIONS.md).

## 1. Purpose

The Methodensammlung is a public, bilingual catalogue of participation methods
for urban and neighbourhood development. Municipal staff, planners, initiatives
and students use it to find a method that fits a situation, understand how it
runs step by step, and take it along as a PDF. Editors of the operating
organisation maintain the methods and the filter taxonomies in the embedded
admin. No account is needed to use the catalogue.

## 2. Who uses it

| Role | Where | What they do |
|---|---|---|
| Visitor | Website | Search, filter, read methods, bookmark, compare, export PDFs, ask the assistant (if enabled) |
| Editor | `/admin` | Create and publish methods, maintain taxonomies, upload images, edit platform texts |
| Administrator | `/admin` | Everything an editor does plus users, legal texts, assistant configuration, API clients |
| API consumer | `/api/graphql` | Read published methods and taxonomies with an API key |

## 3. For visitors

**Finding a method.** The homepage lists all published methods. The search box
matches titles and texts; the filter panel narrows the list by eight facets:
participation depth, project phase, goal, format, duration, target group, group
size and characteristics. Filters are reflected in the URL and can be shared.

**Reading a method.** Each method page has the same structure: summary and
goal, the procedure in three phases (preparation, execution, evaluation), best
practices with an image gallery, notes on when the method is or is not
suitable and practical tips, and links to similar and follow-up methods.

**Bookmarking and comparing.** The bookmark icon saves a method in the
browser; the saved page lists them, offers a comparison table of their facets
and exports one or all of them as PDF. Nothing is stored on the server; clearing
the browser storage clears the list.

**PDF export.** Every method page and the saved page export a print-ready PDF
generated on the server from the published content.

**Method assistant.** If the operator has enabled it, the assistant page
takes a free-text description of a project and suggests real methods from the
catalogue, with the reasons. It can also walk through a few guiding questions.
When it is switched off, the page explains that it is not configured and points
to the filter search.

**Accessibility and language.** The accessibility panel sets font size, high
contrast, underlined links and reduced motion and remembers the choice in the
browser. The whole site is keyboard operable. The language switch toggles
German and English; untranslated content falls back to German.

## 4. For editors

Editors work in the Payload admin at `/admin`.

**Creating a method.** Methods are organised in tabs: _Allgemein_ (status,
title, summary, goal), _Ablauf_ (preparation, execution, evaluation as
collapsible sections), _Praxisbeispiele_ (optional sections and gallery),
_Hinweise_ (when useful, when not, tips, not suitable for), _Verknüpfungen_
(similar and follow-up methods), _Bilder_ (cover and gallery), _Zuordnung_
(the eight taxonomies) and _Weiteres_ (slug). German is the required language;
switch the locale to English to add translations field by field. The slug is
derived from the German title and becomes the URL. Only methods with status
_published_ appear on the site and in the API.

**Taxonomies.** Each facet is its own collection (for example _Formats_).
Entries have a localised label, a slug and optionally an icon; project phases
carry a stable slug for external integrations. Adding an entry makes it
available in the method form and the filter panel immediately.

**Images.** Uploads live in _Media_ with a required alt text (localised). Galleries
take a caption per image. Keep images web-sized; the admin stores the original.

**Platform texts.** _Platform Settings_ holds the name, logo, favicon, colours,
the "Über" page text and partner logos; _Legal_ holds the four legal texts.
Changes are live on save.

**Related methods.** Links between methods are reciprocal: adding method B as
similar to A also lists A under B after saving.

## 5. For API consumers

The read-only GraphQL API exposes published methods and all taxonomies.

1. An administrator creates an entry under **API Clients** and passes on the key.
2. Send requests to `POST /api/graphql` with the header
   `Authorization: api-clients API-Key <key>`.
3. The schema is committed as `schema.graphql`; a query complexity guard limits
   deep nesting. REST endpoints reject API keys.

Example: list published methods with their phases in German.

```graphql
query {
  Methods(where: { status: { equals: published } }, locale: de, limit: 50) {
    docs { title slug auszug projectPhases { label slug } }
  }
}
```

## 6. Typical workflows

**Publish a new method**

1. Editor creates the method, fills the German fields in every tab, assigns
   taxonomies and a cover image, saves as _draft_.
2. A second editor reviews in the admin preview, adds English translations.
3. Status is set to _published_; the method is live and in the API.

**Add a new filter value**

1. Open the taxonomy collection, add the entry with German and English label.
2. Assign it to the relevant methods under _Zuordnung_.
3. The filter panel shows it automatically; no deployment.

**Enable the assistant for a pilot**

1. Choose a provider and create an API key in its console; set a monthly
   spending cap there.
2. In **Assistant**, enable the switch, pick the provider, enter the key (or
   set it in `.env`), adjust greeting and rate limit.
3. Add the AI section to the privacy policy
   ([`PRIVACY-POLICY-TEMPLATES.md`](./PRIVACY-POLICY-TEMPLATES.md)).

## 7. Prerequisites and tips

- Visitors need a current browser; nothing to install.
- Editors should know the Payload admin basics (collections, the DE/EN locale
  switch, rich text) and write in German first.
- Methods are the only content the seed never creates or changes; back up the
  database before bulk edits (`npm run backup`).

# Content Model Reference

The Payload data model behind Urban Kit Methodensammlung. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) for the structural map and [`../AGENTS.md`](../AGENTS.md)
for conventions/commands.

## Localization model

- Locales: **`de` (default)** and **`en`**, with `fallback: true` — empty English
  reads through to German on the website.
- Fields that vary by language are marked `localized: true`.
- **Required-only-in-German:** localized fields use the validators in
  [`../src/lib/requiredInDefaultLocale.ts`](../src/lib/requiredInDefaultLocale.ts):
  - `requiredTextInDefaultLocale` — non-empty string (text/textarea)
  - `requiredValueInDefaultLocale` — present, non-null (rich text / any value)
  - `requiredArrayInDefaultLocale` — at least one row (arrays)
  These return `true` for non-default locales, so English is never forced. **Do not**
  set `required: true` on a localized field.

## `Methods` collection (core entity)

Slug `methods`, `useAsTitle: 'title'`, admin columns
`[title, characteristics, status, updatedAt]`. Shown as a plain admin nav link (via
`TopNav`), not in default grouping. Organised into **tabs**:

| Tab (de / en) | Field | Type | Localized | Required (DE) | Notes |
|---|---|---|---|---|---|
| **Allgemein** / General | `status` | select | – | yes | `draft` \| `published`; only `published` shows on site, and API-key clients only receive `published` docs, GraphQL-only (`publishedOnlyForApiClients` read access) |
| | `title` | text | ✓ | ✓ | drives slug + URL |
| | `auszug` | textarea | ✓ | ✓ | short card summary |
| | `zielDerMethode` | richText | ✓ | ✓ | goal of the method |
| **Ablauf** / Procedure | `vorbereitung` | array | ✓ | ✓ (≥1) | sections: `sectionTitle` + `content` (richText) |
| | `durchfuehrung` | array | ✓ | ✓ (≥1) | step-by-step execution |
| | `auswertung` | array | ✓ | ✓ (≥1) | follow-up / reflection |
| **Praxisbeispiele** / Best Practices | `bestPractices` | array | ✓ | – | optional real-world example sections (same `sectionFields` shape) |
| | `bestPracticesGallery` | array | caption only | – | rows of `image` (upload→media, required) + localized `caption`; always visible as a horizontal strip (with fullscreen lightbox) below the sections while the accordion item is open |
| **Hinweise** / Notes | `wannSinnvoll` | richText | ✓ | – | when useful |
| | `wannNichtSinnvoll` | richText | ✓ | – | when not useful |
| | `tipps` | richText | ✓ | – | practical tips |
| | `ungeeignetFuer` | richText | ✓ | – | not suitable for |
| **Verknüpfungen** / Links | `aehnlicheMethoden` | relationship→methods (hasMany) | – | – | similar methods |
| | `wieKannEsWeiterGehen` | relationship→methods (hasMany) | – | – | "what can follow" |
| **Bilder** / Images | `image` | upload→media | – | – | cover image |
| | `gallery` | upload→media (hasMany) | – | – | gallery images |
| **Zuordnung** / Classification | 8 relationship fields | relationship (hasMany) | – | – | the filter taxonomies, see below |
| **Weiteres** / More | `slug` | text | – | – | unique, indexed, auto-generated |

**Procedure sections** (`vorbereitung`/`durchfuehrung`/`auswertung`, plus the
optional `bestPractices`) share `sectionFields` = `sectionTitle` (text) + `content`
(richText), rendered with a custom `SectionRowLabel` admin row label and collapsed by
default. Only the three Ablauf arrays are required (DE); `bestPractices` is optional —
the frontend accordion item appears only when it has sections or gallery images.

**Slug generation** (`beforeValidate` hook on `slug`): derives from the **German**
title — lowercases, maps `ä/ö/ü`→`ae/oe/ue`, `ß`→`ss`, non-alphanumerics→`-`, trims
dashes. Only runs while editing the default locale; respects a manual override.

**Classification fields** (all `relationship`, `hasMany`):

| Field | → collection |
|---|---|
| `participationDepths` | `participation-depths` |
| `projectPhases` | `project-phases` |
| `goals` | `goals` |
| `formats` | `formats` |
| `durations` | `durations` |
| `targetGroups` | `target-groups` |
| `groupSizes` | `group-sizes` |
| `characteristics` | `characteristics` |

## Filter taxonomies

Each filter collection is a small taxonomy of options. Common fields: localized `name`,
optional uploaded `icon`, `lucideIcon` string fallback. Two have a parent-category
split:

- **Project phases:** `ProjectPhases` reference `ProjectPhaseCategories`
  (Vorbereitung / Durchführung / Nachbereitung).
- **Durations:** `Durations` reference `DurationCategories` (Kurz / Mittel / Lang) and
  carry their own `lucideIcon`.
- **Target groups** add an `explanation` field.

Default option sets are created by [`../seed.ts`](../seed.ts) (idempotent). Examples
seeded today: ParticipationDepths (Informieren / Mitreden / Mitbestimmen),
Goals (7), Formats (Analog/Digital/Hybrid), TargetGroups (4), GroupSizes (4),
Characteristics (Einfach/Strukturiert/Spielerisch/Aktivierend/Kreativ).

## Globals

- **`PlatformSettings`** (admin-only): brand + text colors, branding uploads (admin
  logo, favicon, OG sharing image), and the Kontakt page content (email address +
  rich text). There is no contact form — the Kontakt page is mailto-only; SMTP env
  vars only serve Payload's auth mails.
- **`Legal`** (admin-only): the legal texts — Impressum, Datenschutz, cookie policy, and the Erklärung zur Barrierefreiheit (seeded default per the EU model declaration; bracketed placeholders for the feedback address + enforcement body are filled by admins).
- **`Assistant`** (admin-only, **`read` locked** — it stores the API key): method-assistant
  config (enable, provider, API key, model, greeting, extra instructions, rate limit),
  with env-var fallbacks. See [`CHATBOT.md`](CHATBOT.md).
- **Eight filter-settings globals** (admin+editor): each holds the display `icon` /
  `lucideIcon` fallback and an active flag for one filter group on the public site
  (`ParticipationDepthSettings`, `ProjectPhaseSettings`, `GoalSettings`,
  `FormatSettings`, `DurationSettings`, `TargetGroupSettings`, `GroupSizeSettings`,
  `CharacteristicsSettings`).

## Adding a new filter taxonomy (checklist)

1. New collection in `src/collections/` (copy an existing filter for the shape).
2. New settings global in `src/globals/` (copy an existing `*Settings`).
3. Register both in `src/payload.config.ts` (collection in the content list, global in
   the filter-settings list — they inherit editor-write access via the `.map`).
4. Add a `relationship` (hasMany) field to the **Zuordnung** tab in `Methods.ts`.
5. Seed default options + the settings icon in `seed.ts`.
6. `npm run generate:types` (and `generate:importmap` if you added admin components).
7. Surface it in the frontend filter UI (`MethodFilters` / `filterConfig.ts`).

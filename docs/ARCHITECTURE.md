# Architecture Reference

Structural map of Urban Kit Methodensammlung. For conventions and commands see
[`../AGENTS.md`](../AGENTS.md); for the data model see [`CONTENT-MODEL.md`](CONTENT-MODEL.md).

## Stack at a glance

| Layer | Tech |
|---|---|
| Web framework | Next.js 15 (App Router, React 19) |
| CMS / backend | Payload CMS 3.84 (collections, globals, REST + GraphQL, admin UI) |
| Database | MongoDB 7 (`@payloadcms/db-mongodb`, Mongoose) |
| Rich text | Lexical (`@payloadcms/richtext-lexical`) |
| Styling | Tailwind CSS 4 (PostCSS), Atkinson font |
| Icons | `lucide-react` (+ uploaded custom icons) |
| i18n | `next-intl` (frontend) + Payload localization (content) |
| Email | `@payloadcms/email-nodemailer` (SMTP) |
| Language | TypeScript 5.8, ESM, Node ≥ 20.9, npm |

Path aliases (`tsconfig.json`): `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`.

## `src/` layout

```
src/
  payload.config.ts     # Payload entry point (see below)
  payload-types.ts      # GENERATED from collections/globals (gitignored, never hand-edit)
  middleware.ts         # next-intl locale middleware
  navigation.ts         # typed i18n navigation helpers
  collections/          # Payload collections (data models)
  globals/              # Payload globals (singleton settings docs)
  app/                  # Next.js App Router (frontend + payload route groups)
  components/           # Frontend React components
  components/admin/     # Custom Payload admin components
  lib/                  # access control, validators, theme, helpers
  i18n/                 # next-intl config / messages
  hooks/                # React hooks
  actions/              # server actions (empty placeholder — none yet)
  types/ , types.ts     # shared TypeScript types
  custom-admin.css      # admin UI overrides
```

## `payload.config.ts` — what it wires

- **Locales:** `de` (default) + `en`, `fallback: true`. Admin UI languages `de`/`en`, fallback `de`.
- **Collections** are registered in two groups: content/filters/assets get
  `lockWritesToEditors` + `readViaGraphQLOnlyForApiClients` applied in bulk via
  `.map(...)` (a collection's own access wins, e.g. Media's public read); `Users` and
  `ApiClients` are admin-only and listed last.
- **Globals:** `PlatformSettings`, `Legal` and `Assistant` are admin-only
  (`lockGlobalWritesToAdmins`; `Assistant` additionally locks `read` — it holds the API
  key); the eight filter-settings globals get `lockGlobalWritesToEditors`. All except
  `Assistant` also get the GraphQL-only read gate for API clients.
- **GraphQL:** `graphQL.maxComplexity` (query cost guard) + `schemaOutputFile` →
  committed `schema.graphql` (`npm run generate:schema`).
- **Editor:** Lexical with a fixed feature set (headings, lists, links, upload,
  relationship, align, blockquote, code, sub/superscript, etc.).
- **Email:** Nodemailer adapter (Payload auth mails only — no contact form); SMTP from env, ethereal mock when `SMTP_HOST` unset.
- **Admin components:** custom `TopNav`, `CollapseFilterGroups`, `BottomNav`, and a
  custom `documentation` view at `/admin/dokumentation`.
- **Uploads:** 5 MB file-size limit.
- **Secret/DB/URL:** `PAYLOAD_SECRET`, `MONGODB_URI`, `NEXT_PUBLIC_SERVER_URL` from env.

## Collections (`src/collections/`)

| Collection | slug | Purpose |
|---|---|---|
| `Methods` | `methods` | **Core entity** — participation methods (tabbed). See CONTENT-MODEL.md |
| `ParticipationDepths` | `participation-depths` | Filter: how strongly people are involved |
| `ProjectPhases` | `project-phases` | Filter: project lifecycle phase (→ category) |
| `ProjectPhaseCategories` | `project-phase-categories` | Grouping for project phases |
| `Goals` | `goals` | Filter: goal/outcome of a method |
| `Formats` | `formats` | Filter: analogue / digital / hybrid |
| `Durations` | `durations` | Filter: time needed (→ category) |
| `DurationCategories` | `duration-categories` | Grouping for durations |
| `TargetGroups` | `target-groups` | Filter: intended participant groups (+ explanation) |
| `GroupSizes` | `group-sizes` | Filter: group-size ranges |
| `Characteristics` | `characteristics` | Filter: character (playful, structured, …) |
| `Media` | `media` | Image uploads (`public/media`), publicly readable; `image/*` only, ≤ 5 MB. Sharp re-encodes the stored original as WebP (max 2400px) and generates `thumbnail` 400 / `card` 800 / `hero` 1600 px WebP renditions — no full-size camera files are kept |
| `Icons` | `icons` | Icon uploads (`public/icons`) |
| `Users` | `users` | Admin users; `role` ∈ {admin, editor}. Admin-only |
| `ApiClients` | `api-clients` | Read-only API keys. Admin-only |

Each **filter** collection follows the same shape: localized `name`, optional uploaded
`icon`, `lucideIcon` string fallback; some add an `explanation`.

## Globals (`src/globals/`)

| Global | Writable by | Purpose |
|---|---|---|
| `PlatformSettings` | admin | Colors, branding uploads (admin logo, favicon, OG image), Kontakt (email address + text), Über page content, footer sponsor logos (array: logo + name + optional URL) |
| `Legal` | admin | Legal texts: Impressum, Datenschutz, cookie policy, Erklärung zur Barrierefreiheit |
| `Assistant` | admin | Method-assistant config (provider, API key, model, greeting, rate limit). **`read` is locked** so the key can't leak via REST — see [`CHATBOT.md`](CHATBOT.md) |
| `ParticipationDepthSettings` | admin+editor | Filter display icon + lucide fallback + active flag |
| `ProjectPhaseSettings` | admin+editor | ″ |
| `GoalSettings` | admin+editor | ″ |
| `FormatSettings` | admin+editor | ″ |
| `DurationSettings` | admin+editor | ″ |
| `TargetGroupSettings` | admin+editor | ″ |
| `GroupSizeSettings` | admin+editor | ″ |
| `CharacteristicsSettings` | admin+editor | ″ |

## Routes (`src/app/`)

**Frontend** — `(frontend)/[locale]/…` (localized, `de`/`en`):
- `page.tsx` — homepage (filterable method list)
- `methods/[slug]/page.tsx` — method detail
- `saved/page.tsx` — localStorage-saved methods: list with per-method PDF export, "all as PDF", comparison table
- `assistant/` — full-page method assistant (chat)
- `kontakt/`, `ueber/` (About: admin text + sponsor grid), `datenschutz/`, `impressum/`, `cookies/`, `barrierefreiheit/`, `hilfe/`

**Payload** — `(payload)/`:
- `admin/[[...segments]]` — admin UI
- `api/[...slug]` — Payload REST handler (serves the admin UI; API-key clients are rejected here)
- `api/graphql` — GraphQL endpoint — the **external API surface** (API keys via `Authorization: api-clients API-Key <key>`; `maxComplexity` guard; SDL committed as `schema.graphql`, regenerate with `npm run generate:schema`)
- `api/graphql-playground` — interactive GraphQL IDE (disabled in production by Payload's default)

**Custom API** — `src/app/api/`:
- `methods-by-ids/route.ts` — GET methods by id list (locale-aware), for saved view
- `method-assistant/route.ts` — POST chat turn for the method assistant (validated,
  rate-limited; provider/key from the `Assistant` global). See [`CHATBOT.md`](CHATBOT.md).
- `method-pdf/route.tsx` — GET PDF export of one or more published methods
  (@react-pdf/renderer, server-side, rate-limited; `src/lib/pdf/`).

## Components

**Frontend (`src/components/`):** `FilterableMethodList`, `MethodFilters`,
`MethodCard`, `MethodCardSlider`, `MethodAccordions`, `MethodStickyTitle`,
`MethodAssistant`, `AssistantImmersive`, `CurrentMethodProvider`, `GalleryLightbox`,
`SaveButton`, `SavedWidget`, `SectionDotsNav`, `ExpandableContent`, `FaqAccordion`,
`RichTextRenderer`, `LanguageSwitcher`, `NavMenu`, `SiteFooter`, `FooterSponsors`, `BackButton`,
`CookieNotice`, `EyebrowBadge`, plus `accessibility/`.

**Admin (`src/components/admin/`):** `TopNav`, `BottomNav`, `CollapseFilterGroups`,
`BrandLogo`, `BrandIcon`, `ColorPicker`, `ColorResetButton`, `LucideIconPreview`,
`SectionRowLabel`, `views/Documentation` + `DocumentationContent`.

## `src/lib/`

| File | Purpose |
|---|---|
| `access.ts` | Role-based access helpers (the source of truth for permissions) |
| `requiredInDefaultLocale.ts` | Validators that require a value only in the default (German) locale |
| `theme.ts` | CSS color variables / defaults |
| `accessibility.ts` | Contrast/focus helpers |
| `methodImage.ts` | Cover-image helpers |
| `filterConfig.ts` | Filter configuration constants |
| `localize.ts` | i18n helper |
| `saved.ts` | localStorage API for saved methods |
| `platformIdentity.ts` | Branding uploads (admin logo, favicon, OG image) with built-in defaults |
| `methodAssistant/` | Method-assistant engine (settings, prompt, tools, rate limit) — see [`CHATBOT.md`](CHATBOT.md) |
| `pdf/` | PDF export (`@react-pdf/renderer`): `MethodsPdf` document + Lexical→PDF rich-text converter, used by `/api/method-pdf` |

## Data / scripts

- `seed.ts` — idempotent seed of taxonomies + legal defaults. `npm run seed`. Never writes methods.
- `scripts/seed-legal.ts` — legal texts only (privacy + cookie policy + accessibility statement), `--force` overwrites. Texts live in `src/lib/legalDefaults.ts`, shared with `seed.ts`. `npm run seed:legal`.
- `scripts/migrate-localization.ts` — one-off `*De/*En` → Payload localized migration.
- `scripts/backfill-similar-methods.ts` — one-off: make existing `aehnlicheMethoden` links reciprocal. `npm run backfill:similar`.
- `scripts/backfill-phase-slugs.ts` — one-off: set the stable `slug` on existing project phases (external consumers match by slug; new phases get it via seed). `npm run backfill:phase-slugs`.
- `scripts/migrate-media-alt-localized.ts` — one-off: plain-string media `alt` → localized `{ de: … }` (the field is now localized + required in German). `npm run migrate:media-alt`.
- `scripts/backup.sh` / `scripts/restore.sh` — DB + uploaded-media backup (cron-able) and DB restore. `npm run backup` / `npm run restore`.
- No traditional migrations: Payload derives collections from the TS config.

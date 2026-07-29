# AGENTS.md — Urban Kit Methodensammlung

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex, etc.) working in
this repository. This is the canonical agent doc; `CLAUDE.md` points here. Read this
first, then the deeper references under [`docs/`](docs/) when you need detail.

> Written in English for tooling, but the **product is German-first**. UI labels,
> field names and content default to German (`de`); English (`en`) is a fallback.

---

## What this project is

**Urban Kit Methodensammlung** is a bilingual (DE/EN) catalogue of **participation
methods for urban planning** ("Methoden für Beteiligung"). Editors maintain methods
and their filter taxonomies in a Payload CMS admin; the public Next.js site lets
visitors browse, filter, and save methods.

- **Framework:** Next.js 15 (App Router) + Payload CMS 3.84 (headless CMS, same repo)
- **Database:** MongoDB 7 (via `@payloadcms/db-mongodb`, Mongoose adapter)
- **Styling:** Tailwind CSS 4 · **Icons:** `lucide-react`
- **i18n:** `next-intl` (frontend routing) + Payload localization (content)
- **Language/runtime:** TypeScript 5.8, ESM (`"type": "module"`), Node ≥ 20.9, **npm**
- **Email:** Nodemailer adapter (SMTP via env vars)

There is **no ESLint/Prettier config and no test suite** in this repo. Match the
style of surrounding code; do not introduce a linter/test framework unless asked.

### Reading & commenting the code

Comments are **English** and explain the *why*, not the *what* — they're targeted,
not exhaustive. Expect a short doc-comment header on non-obvious modules (complex
pages, `lib/` helpers, API routes, the assistant) and `// NOTE:` flags at genuine
gotchas (e.g. the `as any` Payload slug casts, the Lexical format bitmask in
`RichTextRenderer`, the duplicated `ClearDot`). Trivial presentational components and
one-line taxonomy collections are intentionally left uncommented. Match that bar:
comment what would otherwise need reverse-engineering, and skip the obvious.

---

## Commands

| Task | Command | Notes |
|---|---|---|
| Install | `npm install` | |
| Dev server | `npm run dev` | Next.js on **port 3040** (`http://localhost:3040`) |
| Production build | `npm run build` | Runs with `--max-old-space-size=8000` (8 GB heap) |
| Start (prod) | `npm run start` | |
| **Regenerate types** | `npm run generate:types` | **Run after ANY change to a collection/global** → updates `src/payload-types.ts` |
| **Regenerate import map** | `npm run generate:importmap` | **Run after adding/moving a custom admin component** referenced in `payload.config.ts` |
| Seed data | `npm run seed` | Idempotent; populates filter taxonomies + platform settings |
| Migrate localization | `npm run migrate:localization` | One-off `*De/*En` → Payload localized format |
| Backfill similar links | `npm run backfill:similar` | One-off: make existing `aehnlicheMethoden` links reciprocal |
| Backup / restore | `npm run backup` / `npm run restore` | DB + media backup (cron-able on the server), DB restore |
| Local DB (Docker) | `docker-compose up mongodb` | MongoDB on `127.0.0.1:27018` |
| Full stack (Docker) | `docker-compose up` | App `3040→3000` + MongoDB |

**Admin panel:** `http://localhost:3040/admin` · **REST/GraphQL API:** under `/api`.

There is no lint or test command. To sanity-check a change, run `npm run build`
(slow) or `npm run generate:types` (fast — also surfaces collection/global type errors).

---

## Repository map

```
seed.ts                     # Idempotent seed: taxonomies + platform-settings global
scripts/                    # migrate-localization, backfill-similar-methods, backup.sh, restore.sh
docker-compose.yml          # app + mongo:7
Dockerfile                  # multi-stage; runs generate:importmap + build
.env.example                # copy to .env / .env.local
docs/                       # deeper references (see below)
src/
  payload.config.ts         # Payload entry: collections, globals, editor, email, access
  payload-types.ts          # GENERATED — do not edit by hand (gitignored)
  middleware.ts             # next-intl middleware
  navigation.ts             # i18n route helpers
  collections/              # Payload collections (data models) — see docs/CONTENT-MODEL.md
  globals/                  # Payload globals (singletons: settings)
  app/
    (frontend)/[locale]/    # Public localized site (de, en)
    (payload)/              # Admin UI + Payload REST/GraphQL
    api/                    # Custom Next routes: kontakt, methods-by-ids, method-assistant
  components/               # Frontend React components
  components/admin/         # Custom Payload admin components (nav, color picker, …)
  lib/                      # access.ts, requiredInDefaultLocale.ts, theme, helpers
  i18n/ · hooks/ · actions/ · types/
```

Full inventory: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
Data model & fields: [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md).
Method assistant (chatbot) design: [`docs/CHATBOT.md`](docs/CHATBOT.md).

---

## Conventions & gotchas (read before editing)

1. **Localization is DE-first.** `de` is the default locale; `en` falls back to `de`.
   Localized fields are required **only in German** via the validators in
   [`src/lib/requiredInDefaultLocale.ts`](src/lib/requiredInDefaultLocale.ts)
   (`requiredTextInDefaultLocale`, `requiredValueInDefaultLocale`,
   `requiredArrayInDefaultLocale`). Do **not** use Payload's built-in `required: true`
   on a `localized` field — it would force editors to fill English too. Reuse these
   helpers instead.

2. **Regenerate types after model changes.** Editing anything in `src/collections/`
   or `src/globals/` → run `npm run generate:types`. `src/payload-types.ts` is
   generated and gitignored; never edit it by hand.

3. **Access control lives in [`src/lib/access.ts`](src/lib/access.ts).** Three roles:
   `admin` (everything), `editor` (content + filters + media/icons, **no** users /
   API clients / legal texts), and read-only **API-key clients**. Apply access with
   the exported helpers (`lockWritesToEditors`, `lockGlobalWritesToEditors`,
   `lockWritesToAdmins`, `adminOnlyCollection`, …) — don't inline ad-hoc access fns.
   Note `payload.config.ts` applies these in bulk via `.map(...)`, so a new collection
   added to the content list inherits editor-write access automatically.

4. **Icon pattern: upload + Lucide fallback.** Filter collections/globals carry an
   uploaded `icon` and a `lucideIcon` **string** (a name from lucide.dev, e.g.
   `"Clock"`). The UI uses the upload if present, else renders the Lucide icon by name.

5. **`Methods` is the core entity**, organized into tabs (General / Procedure /
   Best Practices / Notes / Links / Images / Classification / More). The `slug` auto-generates from the
   **German** title via a `beforeValidate` hook (umlauts → `ae/oe/ue`, `ß` → `ss`);
   it only regenerates while editing the default locale. See
   [`src/collections/Methods.ts`](src/collections/Methods.ts).

6. **Two API surfaces.** Payload's own REST/GraphQL lives under `(payload)/api`.
   Custom app routes (`src/app/api/kontakt`, `src/app/api/methods-by-ids`,
   `src/app/api/method-assistant`) are plain Next route handlers. The public site
   reads content via Payload's **local API**,
   which **bypasses access control** — keep that in mind for "why can the public see X".

7. **Email config is split.** SMTP credentials come from env vars
   (`SMTP_HOST`/`PORT`/`SECURE`/`USER`/`PASS`/`FROM_*`); non-secret operational values
   (recipient, subject prefix, enable toggle) live in the `PlatformSettings` global and
   are read per-request. No `SMTP_HOST` ⇒ Payload uses an `ethereal.email` mock in dev
   and logs a preview URL.

8. **Custom admin components** are referenced by string path in `payload.config.ts`
   (e.g. `@/components/admin/TopNav#TopNav`). After adding/moving one, run
   `npm run generate:importmap`.

9. **Env files:** copy `.env.example` → `.env` (Docker) and/or `.env.local` (local
   dev). Both `.env` and `.env.local` are gitignored. `PAYLOAD_SECRET` must be ≥ 32 chars.

10. **Seeding:** `seed.ts` is idempotent — it skips entries whose name already exists,
    uses `overrideAccess: true`, and creates each item in `de` then updates `en`. When
    you add a new taxonomy option that should ship by default, extend `seed.ts` the same
    way rather than relying on manual admin entry.

---

## Git policy

**Do not run `git commit`, `git add`, `git push`, or create branches/PRs unless the
user explicitly asks.** (Standing instruction for this repo.) Make and explain changes;
let the user decide when to commit.

---

## Where to look first by task

- **Add/change a content field** → the relevant file in `src/collections/`, then
  `npm run generate:types`. Localized + required? use the default-locale validators.
- **Add a new filter taxonomy** → new collection in `src/collections/` + matching
  global in `src/globals/` + register both in `payload.config.ts` + seed in `seed.ts`
  + add the relationship field to `Methods.ts` (Classification tab).
- **Public page / routing** → `src/app/(frontend)/[locale]/…` + `src/i18n` + `navigation.ts`.
- **Admin UI tweak** → `src/components/admin/…` (+ `generate:importmap` if newly wired).
- **Access / permissions** → `src/lib/access.ts`.
- **Email / contact form** → `src/app/api/kontakt/route.ts` + `PlatformSettings` global + SMTP env.

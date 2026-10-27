<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Urban Kit – Methodensammlung

A bilingual (DE/EN) catalogue of **participation methods for urban planning**
("Methoden für Beteiligung"). Editors maintain methods and their filter taxonomies
in a Payload CMS admin; the public Next.js site lets visitors browse, filter, save,
and get AI-assisted suggestions for the right method.

> **German-first.** UI labels, field names and content default to German (`de`);
> English (`en`) is a fallback. This README is in English for tooling and contributors.

---

## Features

- 📚 **Method catalogue** with rich-text content, images and a step-by-step procedure model.
- 🔎 **Faceted filtering** across eight taxonomies (participation depth, project phase,
  goal, format, duration, target group, group size, characteristics).
- 🤖 **Method assistant** — an optional, admin-configurable chatbot (Anthropic / OpenAI /
  Mistral via the Vercel AI SDK) that suggests real methods from a free-text project
  description. See [`docs/CHATBOT.md`](docs/CHATBOT.md).
- 🌍 **Bilingual content** via Payload field-level localization + `next-intl` routing.
- ♿ **Accessibility built in** — Atkinson Hyperlegible font, font-scaling, reduced-motion
  and high-contrast preferences.
- 🔖 **Save & print** methods locally (no account needed).
- 🎨 **Editable platform identity** — colors, logo, favicon and legal texts from the admin.

## Tech stack

| Layer | Tech |
|---|---|
| Web framework | Next.js 15 (App Router, React 19) |
| CMS / backend | Payload CMS 3.84 (collections, globals, REST + GraphQL, admin UI) |
| Database | MongoDB 7 |
| Styling | Tailwind CSS 4 |
| i18n | `next-intl` (frontend) + Payload localization (content) |
| Language / runtime | TypeScript 5.8, ESM, Node ≥ 20.9, npm |

---

## Quick start

### Option A — Docker (app + MongoDB)

```bash
cp .env.example .env          # then edit values (see below)
docker compose up             # app on http://localhost:3040, MongoDB on 27018
```

### Option B — local dev (bring your own MongoDB)

```bash
cp .env.example .env.local    # point MONGODB_URI at your MongoDB
npm install
npm run dev                   # http://localhost:3040
```

Then open the **admin panel** at <http://localhost:3040/admin> and create the first
user. To populate the filter taxonomies and platform defaults:

```bash
npm run seed                  # idempotent — safe to re-run
```

### Required environment variables

See [`.env.example`](.env.example) for the full list. The essentials:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Signing secret (**required in production**, min 32 chars) |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL (used for media URLs etc.) |

Optional: SMTP variables (admin password-reset mail) and an LLM provider API key for
the assistant — both degrade gracefully when unset. Full operations guide:
[`docs/OPERATIONS.md`](docs/OPERATIONS.md).

---

## Common commands

| Task | Command |
|---|---|
| Dev server (port 3040) | `npm run dev` |
| Production build | `npm run build` |
| Regenerate Payload types (after a collection/global change) | `npm run generate:types` |
| Regenerate admin import map (after wiring an admin component) | `npm run generate:importmap` |
| Seed taxonomies + settings | `npm run seed` |
| Back up / restore the database | `npm run backup` / `npm run restore` |

---

## Documentation

By audience:

| Audience | Start here |
|---|---|
| Visitors, editors, API consumers | [`docs/USAGE.md`](docs/USAGE.md) — purpose, roles, catalogue, editing, GraphQL access |
| Operators | [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — requirements, Docker Compose install, proxy/TLS, updates, backups |
| Developers | [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — architecture summary, interfaces, build and checks; then [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md), [`docs/CHATBOT.md`](docs/CHATBOT.md) |
| Everyone | [`docs/PROJECT-STATUS.md`](docs/PROJECT-STATUS.md) — stage, known limitations, open points; [`CHANGELOG.md`](CHANGELOG.md); [`SECURITY.md`](SECURITY.md) |

Legal-text templates: [`docs/PRIVACY-POLICY-TEMPLATES.md`](docs/PRIVACY-POLICY-TEMPLATES.md),
[`docs/COOKIE-POLICY-TEMPLATES.md`](docs/COOKIE-POLICY-TEMPLATES.md),
[`docs/ACCESSIBILITY-STATEMENT-TEMPLATES.md`](docs/ACCESSIBILITY-STATEMENT-TEMPLATES.md).
[`AGENTS.md`](AGENTS.md) holds the conventions and gotchas for humans and AI agents.

## Contributing

Contributions are welcome — please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and our
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) first.

## License

Licensed under the **European Union Public Licence v. 1.2 (EUPL-1.2)** — see
[`LICENSES/EUPL-1.2.txt`](LICENSES/EUPL-1.2.txt). The project is
[REUSE](https://reuse.software)-compliant: every file declares its copyright and
license (`reuse lint` runs in CI). Exceptions to EUPL-1.2: the bundled Atkinson
Hyperlegible font ([OFL-1.1](LICENSES/OFL-1.1.txt)) and the files that
`REUSE.toml` marks as [CC-BY-4.0](LICENSES/CC-BY-4.0.txt). Method content entered
by an operator stays the operator's.

Versions are tagged (`v1.0.0`, `v1.1.0`, …) and described in [`CHANGELOG.md`](CHANGELOG.md).
Security reports: [`SECURITY.md`](SECURITY.md).

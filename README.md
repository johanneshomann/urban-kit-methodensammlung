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

Optional: SMTP variables (contact form email) and an LLM provider API key for the
assistant — both degrade gracefully when unset.

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

- [`AGENTS.md`](AGENTS.md) — conventions, gotchas and a per-task map (for humans and AI agents).
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — full directory, route, collection and component inventory.
- [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md) — the Payload data model (Methods tabs, taxonomies, localization).
- [`docs/CHATBOT.md`](docs/CHATBOT.md) — the method assistant's design.

## Contributing

Contributions are welcome — please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and our
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) first.

## License

Licensed under the **European Union Public Licence v. 1.2 (EUPL-1.2)** — see
[`LICENSES/EUPL-1.2.txt`](LICENSES/EUPL-1.2.txt). The project is
[REUSE](https://reuse.software)-compliant: every file declares its copyright and
license. The bundled Atkinson Hyperlegible font is licensed separately under
[OFL-1.1](LICENSES/OFL-1.1.txt).

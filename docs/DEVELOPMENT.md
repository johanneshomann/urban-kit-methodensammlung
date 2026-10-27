<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Development

Entry point for developers. References: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
(directory, route, collection and component inventory),
[`CONTENT-MODEL.md`](./CONTENT-MODEL.md) (fields and localisation),
[`CHATBOT.md`](./CHATBOT.md) (assistant design), [`AGENTS.md`](../AGENTS.md)
(conventions and gotchas), [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## 1. Architecture in short

One Next.js 15 application (App Router, React 19, TypeScript) with Payload
CMS 3 embedded on MongoDB 7. Payload provides the collections (methods, eight
taxonomies, media, users, API clients), the globals (platform settings, legal
texts, assistant settings, taxonomy display settings), the admin UI at `/admin`
and the REST and GraphQL endpoints under `/api`. The public site lives in
`src/app/(frontend)/[locale]/` and renders server-side from the Payload local
API; `next-intl` handles routing and UI copy, Payload handles content
localisation (German required, English optional with fallback).

Three custom routes complement Payload: PDF export (`@react-pdf/renderer`,
server-side), a method lookup by id list for the bookmark page, and the
assistant endpoint (Vercel AI SDK, tool calling against the catalogue).

## 2. Interfaces

| Interface | Path | Auth | Purpose |
|---|---|---|---|
| Payload REST | `/api/<collection>` | admin session | Admin UI; API keys are rejected |
| GraphQL (external API) | `/api/graphql` | `Authorization: api-clients API-Key <key>` or admin session | Published methods and taxonomies; complexity guard; SDL in `schema.graphql` |
| GraphQL playground | `/api/graphql-playground` | dev only | Interactive IDE |
| Methods by ids | `GET /api/methods-by-ids` | none (published only) | Bookmark page |
| PDF export | `GET /api/method-pdf` | none, per-IP rate limit | One or more published methods as PDF |
| Method assistant | `POST /api/method-assistant` | none, per-IP and daily limits | Chat turn; provider from the `assistant` global |

Outbound: the chosen LLM provider (only when enabled and configured) and the
optional SMTP server. Access rules live in `src/lib/access.ts`: admins read and
write everything, API-key clients read published documents via GraphQL only,
anonymous requests read published documents through the frontend.

## 3. Dependencies

Core: `next`, `react`, `payload` with `@payloadcms/db-mongodb` and
`@payloadcms/richtext-lexical`, `next-intl`, `tailwindcss` 4,
`@react-pdf/renderer`, `ai` (Vercel AI SDK) with provider packages,
`lucide-react`. Exact versions in `package.json` and `package-lock.json`.

## 4. Build and check

```bash
npm ci
npm run dev                 # dev server on :3040 (needs MongoDB, e.g. docker compose up mongodb)
npm run generate:types      # after any collection/global change; also a fast type sanity check
npm run generate:schema     # after any collection/global change — updates the committed schema.graphql
npm run generate:importmap  # after adding/moving a custom admin component
npm run build               # production build (8 GB heap configured)
~/.local/bin/reuse lint     # licence headers (REUSE); CI runs this too
```

`npm run seed` populates taxonomies, platform settings and legal templates
without touching methods.

## 5. Testing

There are **no automated tests** and no lint configuration. The verification
path is `npm run generate:types` (fast, surfaces collection type errors),
`npm run build` and manual checks against a seeded instance. The continuous
integration pipeline (`.gitlab-ci.yml`, mirrored by `.github/workflows/ci.yml`)
runs `npm ci`, `npm run generate:types` and `reuse lint` on every push.
Contributions that add tests for `src/lib/access.ts` (published-only, GraphQL-only
for API keys) and for the seed's idempotence are especially welcome.

## 6. Extending the code

- A new filter taxonomy follows the checklist in `CONTENT-MODEL.md`
  (collection, relationship field on methods, filter config, seed, messages,
  types and schema regeneration).
- Required-in-default-locale validation is centralised in
  `src/lib/requiredInDefaultLocale.ts`; use it for new required localised fields.
- Both message catalogues (`messages/de.json`, `messages/en.json`) stay
  key-identical.
- Anything that stores data in the browser or sends data to a third party must
  update the legal templates in `docs/*-TEMPLATES.md`.
- `CHATBOT.md` documents the assistant's design including superseded plans;
  the implemented state is the route in `src/app/api/method-assistant/` plus
  `src/lib/methodAssistant/`.
- Commit messages follow `VERB - details`; one logical unit per commit.

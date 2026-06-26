# CLAUDE.md

This project's agent guidance is maintained in **[AGENTS.md](AGENTS.md)** so it works
for every coding agent (Claude Code, Cursor, Copilot, Codex, …).

👉 **Read [AGENTS.md](AGENTS.md) first.** It covers the stack, commands, repository
map, and the conventions/gotchas you must follow.

Deeper references:
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — full directory, route, collection & component inventory.
- [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md) — Payload data model: Methods tabs, taxonomies, globals, localization.

## Quick reminders (full detail in AGENTS.md)

- **Stack:** Next.js 15 + Payload CMS 3.84 + MongoDB 7 + Tailwind 4. German-first (DE default, EN fallback). npm, Node ≥ 20.9.
- **Dev:** `npm run dev` → port **3040**. Admin at `/admin`.
- After editing a collection/global → **`npm run generate:types`**. After wiring a custom admin component → **`npm run generate:importmap`**.
- Localized-required fields use the helpers in `src/lib/requiredInDefaultLocale.ts`, **not** Payload's `required: true`.
- Access control: use the helpers in `src/lib/access.ts` (admin / editor / read-only API client).
- **Git:** never `commit`/`add`/`push` without an explicit request from the user.

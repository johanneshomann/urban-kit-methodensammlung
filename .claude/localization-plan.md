# Methods → Field-Level Localization + Layout Reorg

## Goal
Replace the manual DE/EN duplicated-field approach in the `methods` collection with
Payload's native field-level localization (one field per language, top-bar globe
switcher), migrate existing data, update all frontend reads, and reorganize the edit
screen into topic tabs.

Filter collections (`nameDe`/`nameEn`) are **out of scope** (phase 2).

## Decisions
- **Required:** German required, English optional (enforced via a DE-only `validate`).
- **Data:** ship both a Mongo migration script *and* an updated seed — run the migration
  only if real content exists; otherwise just re-seed.

## Fields
- **Localize (drop the `*En` twin):** `title`, `auszug`, `zielDerMethode`,
  `wannSinnvoll`, `wannNichtSinnvoll`, `vorbereitung`, `durchfuehrung`, `auswertung`,
  `tipps`, `ungeeignetFuer`.
- **Shared (not localized):** `aehnlicheMethoden`, `wieKannEsWeiterGehen`, `gallery`,
  `slug`, `status`, `image`, and the 8 filter relationships.

## Phases
1. **Config** — add `localization` (de/en, defaultLocale de, fallback true) to payload.config.ts.
2. **Collection** — rewrite Methods.ts: localized fields, drop `*En`, topic tabs
   (Inhalt / Ablauf / Hinweise / Verknüpfungen & Medien / Zuordnung), sidebar status·image·slug.
3. **Data** — Mongo migration `{title, titleEn}` → `{title:{de,en}}` (or re-seed).
4. **Frontend** — pass `locale`/`fallbackLocale` to method queries; drop `locale==='de'?x:xEn`.
5. **Types & seed** — trim types.ts, regenerate payload-types, update seed.ts.
6. **Docs** — update admin Documentation Sprache/Methoden tabs.

## Frontend touchpoints
- src/app/(frontend)/[locale]/methods/[slug]/page.tsx
- src/app/(frontend)/[locale]/page.tsx
- src/app/(frontend)/[locale]/saved/page.tsx
- src/app/(frontend)/[locale]/saved/print/page.tsx
- src/components/MethodCard.tsx
- src/components/MethodFilters.tsx
- src/app/api/methods-by-ids/route.ts
- src/types.ts (+ regenerate payload-types.ts)
- seed.ts

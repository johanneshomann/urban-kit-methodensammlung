<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Project status

_Last updated: 2026-10-27 · Version 1.0.1 · `developmentStatus: stable` in `publiccode.yml`_

## Development stage

Urban Kit – Methodensammlung is **in production**. One municipality (Stadt
Detmold) publishes its catalogue of participation methods with it; the
software is released so that other municipalities and organisations can run
their own catalogue or consume the published methods through the GraphQL API.

What is in place and used:

- Bilingual method catalogue (German default, English) with full-text search
  and eight filter facets, maintained by editors in the embedded Payload admin.
- Complete method pages: goal, procedure in three phases, practice examples
  with gallery, suitability notes, related methods, PDF export.
- Bookmark list without an account (browser storage), comparison table, PDF
  export of a selection.
- Read-only GraphQL API with API keys for external integrations (for example
  the UrbanKIT Plattform, which shows method teasers).
- Optional, admin-configurable method assistant (Mistral, Anthropic or OpenAI).
- Accessibility features (font scaling, high contrast, underlined links,
  reduced motion, keyboard operation), editable platform identity, seeded
  legal-text templates.

## Known limitations

| Area | Limitation | Consequence |
|---|---|---|
| Quality assurance | No automated tests and no lint configuration. Verification is `npm run generate:types`, `npm run build` and manual checks. A minimal CI (type generation + REUSE lint) ships with this version. | Regressions are found manually. |
| Method assistant | Optional; in the pilot it is switched off. Its page and buttons stay visible and answer with a "not configured" notice. Costs and the privacy-policy section are the operator's responsibility when enabling it. | Visitors see an assistant that does not answer until an operator configures it. |
| E-mail | SMTP is optional and only used for admin password resets; without it Payload logs a preview link in development and sends nothing in production. | Operators without SMTP reset admin passwords from the database or the CLI. |
| Content language | German is the required source language; English is optional per field and falls back to German. | A partly translated catalogue shows mixed languages on `/en`. |
| Rate limiting | PDF export and the assistant are limited per IP in memory of one process. | Limits reset on restart and are per container instance. |
| Design history | `docs/CHATBOT.md` records the assistant's design including superseded plans. | Read it as history; the implemented state is summarised in `docs/DEVELOPMENT.md`. |

## Open points

1. Automated tests for access rules (published-only for API clients, GraphQL
   only for API keys) and for the seed.
2. Optional webhooks or a changed-since filter for API consumers.
3. Editorial preview of drafts on the public site.
4. Assistant: feedback signal and copy-to-clipboard for answers.
5. Image alt texts are localised, but the editor is not forced to fill the
   English one; consider a required-in-default-locale check for alt texts.

## Maintenance

Developed by Johannes Homann on behalf of Stadt Detmold within the Smart City
project. Issues and merge requests are accepted on the published repository;
security reports go to the address in [`SECURITY.md`](../SECURITY.md).
Response target for issues: seven days.

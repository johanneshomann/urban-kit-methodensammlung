<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Changelog

All notable changes to Urban Kit – Methodensammlung. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/). Each version is a Git tag.

## [1.1.0] – 2026-10-27

### Added
- Read-only GraphQL API for external integrations: `/api/graphql` with API
  keys (`api-clients` collection), complexity guard, committed SDL
  (`schema.graphql`, `npm run generate:schema`); API keys receive published
  methods only and are rejected on REST.
- Stable `slug` on project phases for external consumers.
- "Über" page with admin-managed text and partner logos; partner logo band in
  the footer with per-logo sizing and spacing.
- PDF export per method card on the saved page and "all as PDF".
- Method assistant: Mistral as default provider (EU processing), transcript
  survives navigation (session storage), global daily ceiling, trusted
  client-IP detection behind proxies, output cap per step; the assistant stays
  visible when disabled and reports "not configured".
- `npm run seed:legal` to (re)seed only the legal texts; accurate seed
  defaults for the cookie policy, the privacy policy and the accessibility
  statement, with copy-paste templates in `docs/`.
- Documentation set for operators, users and developers (`docs/USAGE.md`,
  `docs/OPERATIONS.md`, `docs/DEVELOPMENT.md`, `docs/PROJECT-STATUS.md`),
  `CHANGELOG.md`, `SECURITY.md`, and a minimal CI (type generation, REUSE lint).

### Changed
- Contact page is mailto-only (data minimisation); no contact form.
- Legal pages fall back to German when the English text is saved but empty.
- publiccode metadata: mirror URL, cover and screenshots, bilingual
  description, `usedBy`.

### Fixed
- Default privacy policy was defined but never seeded.
- Assistant restore and persistence edge cases; Dockerfile ships `scripts/`
  so migrations run in the container.
- REUSE coverage for legal template docs and the generated GraphQL schema.

## [1.0.0] – 2026-06-26

First public release.

- Bilingual method catalogue (German default, English) with full-text search
  and eight filter taxonomies, maintained in the embedded Payload admin.
- Method pages with goal, three-phase procedure, practice examples and
  gallery, suitability notes, related and follow-up methods.
- Bookmark list without account, comparison table, PDF export.
- Optional method assistant (Anthropic, OpenAI or Mistral) with guided
  questions.
- Accessibility features (font scaling, high contrast, underlined links,
  reduced motion, keyboard operation).
- Editable platform identity, seeded taxonomies and legal-text templates,
  Docker Compose deployment with production override, backup and restore
  scripts, REUSE-compliant licensing under EUPL-1.2.

[1.1.0]: https://gitlab.opencode.de/stadt-detmold/urban-kit-methodensammlung/-/compare/v1.0.0...v1.1.0
[1.0.0]: https://gitlab.opencode.de/stadt-detmold/urban-kit-methodensammlung/-/tags/v1.0.0

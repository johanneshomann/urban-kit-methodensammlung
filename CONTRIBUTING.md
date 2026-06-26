<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Contributing

Thanks for your interest in improving **Urban Kit – Methodensammlung**!
This guide covers how to get set up and the conventions we follow. For the deeper
architecture and per-task map, read [`AGENTS.md`](AGENTS.md) first.

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting set up

See the [README](README.md#quick-start) for the full quick-start. In short:

```bash
cp .env.example .env.local      # configure MONGODB_URI etc.
npm install
npm run dev                     # http://localhost:3040  (admin at /admin)
npm run seed                    # populate taxonomies + platform defaults
```

There is **no ESLint/Prettier config and no test suite** in this repo (yet). To
sanity-check a change, run `npm run build` (slow) or `npm run generate:types` (fast —
also surfaces collection/global type errors).

## Conventions

- **German-first.** `de` is the default content locale; `en` falls back to `de`.
  Localized fields are required *only in German* via the validators in
  `src/lib/requiredInDefaultLocale.ts` — do **not** use Payload's `required: true`
  on a localized field.
- **Domain field names are German** (`auszug`, `zielDerMethode`, `vorbereitung`, …)
  while structural/English names are used elsewhere. Match the surrounding code; if you
  add a content field, follow the existing German naming for method fields.
- **Regenerate types after model changes.** Edited anything in `src/collections/` or
  `src/globals/`? Run `npm run generate:types`. Added/moved a custom admin component?
  Run `npm run generate:importmap`.
- **Comments are English and explain the *why*, not the *what*** — see the
  "Reading & commenting the code" note in [`AGENTS.md`](AGENTS.md).
- **Access control** lives in `src/lib/access.ts`; reuse its helpers rather than
  inlining ad-hoc access functions.

## Licensing & REUSE

This project is [REUSE](https://reuse.software)-compliant: **every file declares its
copyright and license**. When you add a file:

- New **source files** need an SPDX header. The easiest way:

  ```bash
  pipx install reuse           # once
  reuse annotate --copyright "Your Name" --license EUPL-1.2 path/to/new-file.ts
  ```

- New **binaries / generated / data files** are covered by globs in `REUSE.toml` —
  extend it instead of adding a header.
- Verify before opening a PR:

  ```bash
  reuse lint
  ```

By contributing, you agree that your contributions are licensed under the
**EUPL-1.2** (the project license).

## Pull requests

1. Branch from `main`.
2. Keep commits focused — one logical change per commit, with a short imperative message.
3. Make sure `npm run generate:types` and `reuse lint` pass.
4. Describe *what* changed and *why* in the PR description.

## Reporting issues

Please include: what you did, what you expected, what happened, and your environment
(OS, Node version, Docker or local). Screenshots help for UI issues.

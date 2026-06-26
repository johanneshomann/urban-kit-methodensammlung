// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/lib/access'

/**
 * Settings for the method assistant (chatbot). Admin-only — and `read` is
 * restricted to admins too, so the stored API key is never exposed via the REST
 * API. The public chat route reads this global through Payload's local API,
 * which bypasses access control.
 *
 * Each field falls back to the matching environment variable when left empty,
 * so the key can stay in the server environment (more secure) while the toggle,
 * provider and tuning live in the admin UI. See src/lib/methodAssistant/settings.ts.
 */
export const Assistant: GlobalConfig = {
  slug: 'assistant',
  label: { en: 'Assistant', de: 'Assistent' },
  access: { read: adminOnly, update: adminOnly },
  admin: { group: false },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Enable assistant', de: 'Assistent aktivieren' },
      admin: {
        description: {
          en: 'Master switch. When off, the chat widget is hidden everywhere and the site falls back to manual filtering.',
          de: 'Hauptschalter. Wenn aus, ist der Chat überall ausgeblendet und es wird die normale Filterung genutzt.',
        },
      },
    },
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'anthropic',
      label: { en: 'Provider', de: 'Anbieter' },
      options: [
        { label: 'Anthropic (Claude)', value: 'anthropic' },
        { label: 'OpenAI', value: 'openai' },
        { label: 'Mistral', value: 'mistral' },
      ],
      admin: {
        description: {
          en: 'Which LLM provider answers the chat.',
          de: 'Welcher LLM-Anbieter den Chat beantwortet.',
        },
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      label: { en: 'API key', de: 'API-Schlüssel' },
      admin: {
        autoComplete: 'off',
        description: {
          en: 'API key for the selected provider. Stored in the database. Leave empty to use the server environment variable (ANTHROPIC_API_KEY / OPENAI_API_KEY / MISTRAL_API_KEY) — the more secure option.',
          de: 'API-Schlüssel des gewählten Anbieters. Wird in der Datenbank gespeichert. Leer lassen, um die Server-Umgebungsvariable zu nutzen (ANTHROPIC_API_KEY / OPENAI_API_KEY / MISTRAL_API_KEY) — die sicherere Variante.',
        },
      },
    },
    {
      name: 'model',
      type: 'text',
      label: { en: 'Model (optional)', de: 'Modell (optional)' },
      admin: {
        placeholder: 'claude-haiku-4-5',
        description: {
          en: 'Model id for the provider. Leave empty for a sensible cheap default (Anthropic: claude-haiku-4-5, OpenAI: gpt-4o-mini, Mistral: mistral-small-latest).',
          de: 'Modell-ID des Anbieters. Leer lassen für einen günstigen Standard (Anthropic: claude-haiku-4-5, OpenAI: gpt-4o-mini, Mistral: mistral-small-latest).',
        },
      },
    },
    {
      name: 'greeting',
      type: 'textarea',
      localized: true,
      label: { en: 'Opening message', de: 'Begrüßung' },
      admin: {
        description: {
          en: "The assistant's first message. Leave empty to use the built-in default.",
          de: 'Die erste Nachricht des Assistenten. Leer lassen für den Standardtext.',
        },
      },
    },
    {
      name: 'instructions',
      type: 'textarea',
      localized: true,
      label: { en: 'Extra instructions', de: 'Zusätzliche Anweisungen' },
      admin: {
        description: {
          en: 'Optional. Appended to the system prompt — e.g. tone, persona, or extra rules. Keep it short.',
          de: 'Optional. Wird an den System-Prompt angehängt — z. B. Tonalität, Persona oder Zusatzregeln. Kurz halten.',
        },
      },
    },
    {
      name: 'rateLimit',
      type: 'number',
      defaultValue: 20,
      min: 1,
      label: { en: 'Rate limit (requests / 5 min / IP)', de: 'Anfrage-Limit (pro 5 Min / IP)' },
      admin: {
        description: {
          en: 'Abuse / cost guard: max chat requests per visitor IP in a 5-minute window.',
          de: 'Schutz vor Missbrauch / Kosten: maximale Chat-Anfragen pro Besucher-IP in 5 Minuten.',
        },
      },
    },
  ],
}

# Method Assistant — Chatbot Design

A guided conversational helper that walks a visitor through a few short questions and
returns **real, matching methods** from the catalogue. This document is the design and
rationale.

> **Status: implemented (content-aware, multi-provider, admin-configurable).** Tool-calling
> runs through the **Vercel AI SDK** (Apache-2.0), so the provider is swappable between
> **Anthropic / OpenAI / Mistral** with no code change. Config comes from the **`Assistant`
> admin global** (env vars as fallback). The widget only renders when the selected provider
> has a key and the global is enabled; otherwise the site falls back to manual filtering.
> Files:
> - `src/lib/methodAssistant/taxonomies.ts` — taxonomy → `{id,name}` options (cached, per locale)
> - `src/lib/methodAssistant/catalogue.ts` — whole-catalogue **digest** (the semantic layer, cached)
> - `src/lib/methodAssistant/query.ts` — `buildWhere` + `findMethods` (filter + keyword) + `showMethods` + `getMethodDetail`
> - `src/lib/methodAssistant/prompt.ts` — system-prompt builder (scope lock + taxonomy + digest + admin instructions)
> - `src/lib/methodAssistant/model.ts` — `buildModel(provider, model, apiKey)` → an AI SDK `LanguageModel`
> - `src/lib/methodAssistant/settings.ts` — resolves the `Assistant` global (+ env fallback), cached ~30s
> - `src/lib/methodAssistant/provider.ts` — the tool-use loop (AI SDK `generateText` + tools)
> - `src/lib/methodAssistant/rateLimit.ts` — in-memory IP rate limiter (limit configurable in the global)
> - `src/app/api/method-assistant/route.ts` — server route (keys stay server-side)
> - `src/components/MethodAssistant.tsx` — chat widget (mounted in `(frontend)/[locale]/page.tsx`)
> - `src/globals/Assistant.ts` — admin global (enable, provider, API key, model, greeting, instructions, rate limit)
> - Strings under `assistant` in `messages/{de,en}.json`; env fallbacks in `.env.example`

## Configuration (admin global + env fallback)

Admins configure the assistant under **Assistant** in the admin nav (admin-only; `read` is
locked so the API key can't leak via REST). Every field falls back to an environment variable
when left empty, so the key can stay in the server env (more secure) while the rest lives in
the UI. Precedence: **global value → env var → default**.

| Global field | Env fallback | Default |
|---|---|---|
| Enable assistant | — | on |
| Provider | `METHOD_ASSISTANT_PROVIDER` | `anthropic` |
| API key | `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `MISTRAL_API_KEY` (per provider) | — |
| Model | `METHOD_ASSISTANT_MODEL` | `claude-haiku-4-5` / `gpt-4o-mini` / `mistral-small-latest` |
| Opening message (localized) | — | i18n `assistant.greeting` |
| Extra instructions (localized) | — | none (appended to the system prompt) |
| Rate limit (req / 5 min / IP) | — | 20 |

Provider note: Anthropic prompt-caching (the cost optimisation in §5) is applied only on the
Anthropic provider via `providerOptions`; OpenAI caches automatically, Mistral doesn't cache —
so the per-conversation cost math in §5 is Anthropic-specific.

## 0. Content-aware suggestion — "describe your project → get methods"

Beyond taxonomy filtering, the assistant matches a **free-text project description** against
the methods by meaning, and grounds its feedback on the methods' real prose.

The semantic engine is a **catalogue digest**, not embeddings: `catalogue.ts` builds one
compact entry per published method (id, title, summary, goal (`zielDerMethode`, trimmed),
taxonomy labels) and injects it into the (prompt-cached) system prompt. The model reads the user's paragraph, picks the methods
whose content genuinely fits, calls `show_methods` to render those cards, then writes a short
comparison recommending one — citing each method's "when useful" / "not suitable for".

**Why a digest, not a vector store.** For a small/medium catalogue this delivers the same
"describe → suggest" behaviour with zero extra infrastructure: no embedding provider/key, no
vector DB, no re-indexing hook on method save, and never-stale (the digest is rebuilt from
Payload, cached ~10 min). The model *is* the semantic matcher, with every method in front of
it. **When to switch to true embeddings:** once the catalogue grows past roughly a couple of
hundred methods the digest stops fitting cheaply in context — at that point add a Voyage/OpenAI
embeddings index behind `findMethods` (a `query` → top-K by cosine) and drop the digest from
the prompt. The tool seam (`find_methods({ query })`) is already shaped for that swap.

Guardrail unchanged: cards only ever come from `show_methods`/`find_methods`, which fetch real
published docs by id; `show_methods` ids are validated against the catalogue, so the model
cannot surface a method that doesn't exist.

> **Core principle:** the LLM never decides *which method* to recommend and never sees
> the method catalogue. It only turns a conversation into a set of **taxonomy IDs**.
> The actual retrieval is the same deterministic Payload query the manual filter UI
> already uses. This is what makes the bot cheap, safe, and hallucination-resistant.

---

## 1. Why this shape

The hard part is already built:

- 8 structured taxonomies (`participationDepths`, `projectPhases`, `goals`, `formats`,
  `durations`, `targetGroups`, `groupSizes`, `characteristics`) — see
  [CONTENT-MODEL.md](CONTENT-MODEL.md).
- A deterministic filter→query layer in [`src/lib/filterConfig.ts`](../src/lib/filterConfig.ts)
  (`FILTER_CONFIGS`, `FilterState = Record<FilterKey, string[]>`) used by
  [`FilterableMethodList`](../src/components/FilterableMethodList.tsx).

So the assistant's only job is the *fuzzy human* part: ask good questions and map vague
answers ("we have very little time but want citizens to actually co-decide") to
`{ durations: [<kurz-id>], participationDepths: [<mitbestimmen-id>] }`.

The LLM output is literally a `FilterState`. Retrieval, ranking, URLs, and rendering all
stay in deterministic code the catalogue already trusts.

### Rejected alternatives

| Alternative | Why not |
|---|---|
| Full RAG / embeddings over method prose | Overkill. You have clean structured taxonomies; semantic search adds cost + a hallucination surface for no benefit. Revisit only if you later want free-text search over the *prose*. |
| Client-side API key | Leaks instantly, unbounded cost. Never. |
| Big model (Opus/Sonnet) | Unnecessary — mapping answers to ~30 options is easy classification work. Use a small model. |
| Whole catalogue in context every turn | Expensive and pointless — the taxonomies already encode fit. The `get_method` tool reads *one* method on demand instead (§3a). |

---

## 2. Architecture

```
Browser chat widget
   │  POST { messages: [...], locale }
   ▼
/api/method-assistant   ← server route, holds API key in env var (provider-agnostic)
   │  system prompt = the 8 taxonomies (option names + IDs only, ~1–2k tokens, cached)
   │
   │  ┌─ tool-use loop ──────────────────────────────────────────────┐
   │  │  LLM may either:                                              │
   │  │   • call  search_methods(filters)  → payload.find(buildWhere) │
   │  │       returns a shortlist (title + auszug + id), capped       │
   │  │   • call  get_method(id)           → payload.findByID(id)     │
   │  │       returns ONE real method's detail (procedure, notes…)    │
   │  │   • or finish with { reply, askMore }                         │
   │  │  All tools execute server-side against Payload — the model    │
   │  │  can only *fetch* real docs by id, never author content.      │
   │  └───────────────────────────────────────────────────────────────┘
   ▼
Response { reply, methods: MethodCard[] }  →  rendered with existing MethodCard
```

- **Server route** mirrors the existing [`methods-by-ids`](../src/app/api/methods-by-ids/route.ts)
  pattern (Payload local API, `locale`/`fallbackLocale: 'de'`). API key lives in an env
  var, same posture as the SMTP credentials — never shipped to the browser.
- **Retrieval reuses `FilterState`.** The `search_methods` tool takes the exact
  `Record<FilterKey, string[]>` shape; `buildWhere` produces AND-across-groups /
  OR-within-group, identical to manual filtering so chat and filter results always agree.
- **On-demand detail.** When the model decides it needs a method's actual content to
  answer well, it calls `get_method(id)` for *one* method it already surfaced — see §3a.

---

## 3. Structured output schema

The model is forced (via tool-calling / structured output) to return this object — it
cannot emit free-form prose-as-recommendation:

```jsonc
{
  "reply":   "string",            // the short German question or summary to show the user
  "askMore": true,                // true = keep asking; false = enough to retrieve
  "filters": {                    // Partial<FilterState> — only the keys it has resolved
    "goals":         ["<id>"],
    "durations":     ["<id>"],
    "participationDepths": ["<id>"]
  }
}
```

**The allowed IDs are injected at request time** from the taxonomy collections, so the
model literally cannot invent a category that doesn't exist. (Generate the enum from a
`payload.find` over each filter collection, cached in memory.)

### 3a. Tools the model can call

The model decides when to use these; the route executes them server-side against Payload
and feeds the result back into the same turn. The model only ever receives data Payload
returned — it cannot fabricate a method or reach one outside the catalogue.

| Tool | Input | Returns | Purpose |
|---|---|---|---|
| `find_methods` | `{ filters?: Partial<FilterState>, query?: string }` | shortlist with content snippets: `[{ id, title, auszug, ziel, wannSinnvoll, ungeeignetFuer }]`, capped (~10) | Deterministic narrowing — taxonomy filter (`buildWhere`) and/or free-text keyword match over title+summary. Snippets let the model judge fit on substance. |
| `show_methods` | `{ ids: string[] }` — validated against the catalogue, capped at 6 | content snippets for the chosen set | Renders these methods as cards to the user AND grounds the recommendation. The model calls it whenever it names specific methods. |
| `get_method` | `{ id }` — a real catalogue id | one method's deeper content: full `vorbereitung/durchfuehrung/auswertung`, `wannNichtSinnvoll`, etc. | Deep-read one method when summaries can't answer (budgeted ~4/turn). |

(Semantic "describe → suggest" doesn't need a finder tool — the model picks ids straight from
the catalogue digest in its prompt, then calls `show_methods`. See §0.)

**Guardrails on `get_method`:**

- **ID allow-list per session.** The route tracks ids returned by `search_methods` this
  conversation and rejects a `get_method` for any id not on that list. The model can't
  walk the whole catalogue one doc at a time.
- **Budget the calls.** Cap `get_method` to ~2–3 per conversation (deep-read is the most
  expensive path). Beyond that, the route refuses and tells the model to summarise from
  the shortlist instead.
- **Trim before sending.** Pass the method as compact text (strip rich-text formatting to
  plain text, drop images/galleries) so one detail fetch stays a few hundred tokens, not
  thousands.
- **Localised.** `findByID` uses the request `locale` with `fallbackLocale: 'de'`, same as
  everywhere else.

This keeps the *common* path cheap (most conversations resolve on taxonomies alone) while
letting the model "open" a method when a user asks something only the content answers
("does Method X work for kids?", "how long does the prep take?").

---

## 4. Guided Q&A flow

Keep it to **3–5 short, targeted questions**, prioritised by how strongly each taxonomy
narrows results. Suggested order (the model decides adaptively, but is steered):

1. **Goal** (`goals`) — "What do you want to achieve?"
2. **Project phase** (`projectPhases`) — "Where in the process are you?"
3. **Time available** (`durations`) — "How much time do you have?"
4. **Group size** (`groupSizes`) + **target group** (`targetGroups`) — often inferable together.
5. **Participation depth** (`participationDepths`) / **format** / **characteristics** — only if still too many results.

The route can short-circuit: after each answer it can peek at the current result count and
flip `askMore=false` once results are manageable (e.g. ≤ ~8), so the bot doesn't over-interrogate.

---

## 5. Cost — cheap by construction

| Lever | Effect |
|---|---|
| Small model (e.g. Haiku-class) | Classification/conversation task, not reasoning — ~10–30× cheaper than a frontier model. |
| Prompt-cache the system prompt | The taxonomy list is static → the bulk of every request is cached. |
| Cap history to last ~6 turns | Conversation stays tiny; no catalogue text in context. |
| `max_tokens` ≈ 400 | Output is a short question + small JSON, never method content. |
| `get_method` budgeted to ~2–3/conversation, trimmed to plain text | The one expensive path (deep-read) stays bounded; most conversations never trigger it. |

Net: **fractions of a cent per completed conversation**, with a small bump only on the
rare conversation where the model opens a method or two. Provider is deliberately left
open — the route is written provider-agnostic so the key/SDK can be swapped without
touching retrieval or UI.

---

## 6. Safety & abuse guardrails

- **Server-side API key only** (env var). Never exposed to the client.
- **Rate limiting** on the route (IP token-bucket). *Single biggest cost risk* for a
  public bot — a scraper could otherwise run up the bill. Non-negotiable for launch.
- **Input caps:** reject empty/oversized messages; cap message length and turn count.
- **Scope lock** in the system prompt: "You only help find participation methods on this
  platform; politely decline anything else." Prevents use as a free general chatbot.
- **No PII storage / stateless route** — fits the German-first privacy posture (there's
  already a Datenschutz global). Conversation lives only in the client during the session.
- **Graceful fallback:** if the LLM call fails or rate-limits, fall back to the existing
  manual filter UI. The bot is an accelerator, not a dependency.

---

## 7. Build plan (when approved)

1. `src/app/api/method-assistant/route.ts` — server route: load taxonomy enums (cached),
   build system prompt, run the **tool-use loop** (`search_methods`, `get_method`),
   enforce the per-session id allow-list + call budget, return `{ reply, methods }`.
2. `src/lib/methodAssistant/` — `buildWhere(filters)` (shared with manual filtering if
   possible), the two tool handlers + schemas, a rich-text→plain-text trimmer for
   `get_method`, enum builder, and a provider adapter (so the SDK is swappable).
3. Chat widget component (reuse `MethodCard` for results); German-first copy in
   `messages/de.json` + `messages/en.json`.
4. Rate-limit middleware + env var (`*_API_KEY`) documented in `.env.example`.
5. No new collection/global needed → no `generate:types` run required for the route
   itself.

---

## 8. Open questions

- Provider choice (deferred — route stays provider-agnostic until decided).
- Where to surface the entry point (floating button near the saved/accessibility widgets?
  a card on `/#methods`?).
- Whether to log anonymised, opted-in conversations for tuning the question order (would
  need a Datenschutz review).

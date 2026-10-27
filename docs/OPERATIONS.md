<!--
SPDX-FileCopyrightText: 2026 Johannes Homann

SPDX-License-Identifier: EUPL-1.2
-->

# Installation and operations

How to install, configure and run your own instance of the Methodensammlung.
Everything here is generic: your domain, your hosting, your reverse proxy.

## 1. Requirements

| Component | Version | Notes |
|---|---|---|
| Docker Engine + Compose plugin | Docker 24+, Compose v2 | Recommended way to run the stack |
| Node.js | 20.9 or newer | Only for development or running without Docker; the image pins its own version |
| MongoDB | 7 | Ships in the Compose stack; an external MongoDB 7 works too (`MONGODB_URI`) |
| Reverse proxy with TLS | any | Nginx, Caddy, Traefik or a managed edge; HTTPS is mandatory for the admin session cookie |
| Resources | 1 vCPU, 2 GB RAM, 5 GB disk | The production build needs up to 8 GB RAM during `npm run build`; build on a machine with enough memory or use the Docker build on a larger host |

One hostname is enough (for example `methods.example.org`).

## 2. External services

| Service | Required | Used for | Without it |
|---|---|---|---|
| MongoDB 7 | yes | Methods, taxonomies, settings, legal texts, API clients | Nothing runs |
| SMTP server | optional | Admin password-reset mails | Reset passwords via the admin as another admin, or re-seed the first user |
| LLM provider (Mistral, Anthropic or OpenAI) | optional | The method assistant | Assistant answers "not configured"; the catalogue is unaffected |
| CDN / edge security | optional | Delivery and protection in front of the proxy | None, but name any provider in your privacy policy |

Every enabled external service is a data processor under GDPR; the seeded
privacy-policy template has placeholders for hosting, mail and AI providers
([`PRIVACY-POLICY-TEMPLATES.md`](./PRIVACY-POLICY-TEMPLATES.md)).

## 3. Installation with Docker Compose

```bash
git clone <repository-url> methodensammlung && cd methodensammlung
cp .env.example .env
```

Set at least:

- `PAYLOAD_SECRET`: a random string of at least 32 characters.
- `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD`: database credentials used by the
  production override; set `MONGODB_URI` to
  `mongodb://<user>:<password>@mongodb:27017/urban-kit?authSource=admin`.
- `NEXT_PUBLIC_SERVER_URL`: `https://` + your hostname (media URLs are built
  from it).
- Optional: `SMTP_*`, `METHOD_ASSISTANT_PROVIDER` and the matching
  `*_API_KEY`, `ASSISTANT_DAILY_MAX`.

Start with the production override:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose ps        # wait for "healthy"
```

The override binds the app to `127.0.0.1:3040` only, removes the MongoDB host
port, enables MongoDB authentication and sets `restart: always`. The Dockerfile
runs `generate:importmap` and the production build inside the image.

**Existing database volume.** MongoDB creates the root user only on an empty
volume. For an existing `mongodb_data` volume create it once:

```bash
docker compose exec mongodb mongosh --eval \
  'db.getSiblingDB("admin").createUser({user: "<user>", pwd: "<password>", roles: ["root"]})'
```

### First run

1. Open `https://methods.example.org/admin` and create the first administrator.
2. Seed taxonomies, platform settings and legal-text templates (idempotent):
   `docker compose exec app npm run seed`
   The seed never touches methods.
3. In **Platform Settings** set the name, logo, favicon, colours and the
   contact address; add partner logos if wanted.
4. In **Legal** fill the placeholders of imprint, privacy policy, cookie policy
   and accessibility statement. The seeded texts are templates, not legal
   advice; see the three `*-TEMPLATES.md` files in `docs/`.
5. Create the first methods under **Methods**, or import them with a script
   against the Payload local API.
6. Optional: in **Assistant** enable the method assistant and enter the API
   key (or keep it in `.env`). Optional: create an **API Client** to hand an
   API key to an external consumer.

## 4. Reverse proxy and TLS

Any TLS-terminating proxy that forwards to `http://127.0.0.1:3040` and keeps
the `Host` and `X-Forwarded-Proto` headers works. Neutral Nginx example:

```nginx
server {
    listen 443 ssl;
    server_name methods.example.org;
    client_max_body_size 25m;          # media uploads in the admin
    location / {
        proxy_pass http://127.0.0.1:3040;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Caddy or Traefik need the equivalent single site. Tunnel-based edges without
open ports work as well. If an edge terminates TLS and adds its own headers,
the assistant's rate limiter trusts `CF-Connecting-IP`, then `X-Real-IP`, then
the last `X-Forwarded-For` hop.

## 5. Configuration

- **Environment** (`.env`): database, secret, public URL, mail, assistant
  provider and keys, daily assistant ceiling. Annotated list in
  `.env.example`.
- **Admin** (`/admin`), no redeploy needed: Platform Settings (identity,
  colours, sponsors, "Über" text), Legal (four texts, bilingual), Assistant
  (enable, provider, key, model, greeting, instructions, per-IP rate limit),
  filter taxonomies (eight collections), API Clients.

## 6. Day-to-day operations

**Health.** Compose polls `/admin` for a non-5xx answer; use `GET /` or
`/admin` for external monitoring.

**Updates.**

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Payload applies schema changes on start. One-off data migrations ship as
`npm run migrate:*` and `npm run backfill:*` scripts; the commit messages and
`AGENTS.md` say when one is needed.

**Backup and restore.** `npm run backup` (`scripts/backup.sh`) dumps the
database and archives the media and icon volumes into a backup directory
(default: a sibling folder of the repository, 14-day rotation,
`BACKUP_DIR` / `BACKUP_KEEP_DAYS` override). Run it from cron:

```cron
30 3 * * * /path/to/methodensammlung/scripts/backup.sh >> /path/to/backups/backup.log 2>&1
```

`npm run restore` (`scripts/restore.sh <archive>`) replaces the database.

**Logs.** The application writes no access logs; request data stays with your
proxy. Container logs use Docker's `json-file` driver without rotation by
default; set `max-size` and `max-file` in `/etc/docker/daemon.json`.

**Secrets.** `.env` is git-ignored. API keys for the assistant can live in the
admin global instead of `.env`; the environment value is the fallback.

## 7. Giving others API access

Create an entry in **API Clients**; the generated key is sent as
`Authorization: api-clients API-Key <key>`. Keys can read **published methods
and taxonomies only, through GraphQL only** (`/api/graphql`, schema in
`schema.graphql`). REST is reserved for the admin UI and rejects API keys.

## 8. Running without Docker

Node 20.9+, a MongoDB 7, then:

```bash
cp .env.example .env.local
npm ci
npm run build && npm run start     # app on :3000 (dev server uses :3040)
```

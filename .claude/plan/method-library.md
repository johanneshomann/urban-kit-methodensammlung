# Implementation Plan: Urban Kit Method Library

## Task Type
- [x] Fullstack (Payload CMS v3 + Next.js App Router + MongoDB + Docker)

---

## Technical Solution

Payload CMS v3 runs **inside** Next.js App Router — no separate backend needed. The app structure:
- `/src/payload.config.ts` — CMS configuration (collections, auth, MongoDB adapter)
- `/src/app/(payload)/` — Payload admin UI routes (auto-generated)
- `/src/app/(frontend)/` — Public website routes
- `/src/collections/` — Payload collection definitions
- `/src/components/` — Shared React components
- `/src/lib/cart.ts` — Client-side cart logic (localStorage)
- `/seed.ts` — Database seed script

**Key architectural decisions:**
- Payload v3 with `@payloadcms/db-mongodb` adapter
- Next.js 15 App Router (embedded in Payload)
- Tailwind CSS for styling
- localStorage (not cookies) for cart — simpler, avoids SSR complexity
- Server Components for data fetching from Payload's local API

---

## Implementation Steps

### Step 1 — Project Bootstrap
Create `package.json` with Payload v3 + Next.js 15 + Tailwind dependencies.

**Key dependencies:**
```json
{
  "payload": "^3.x",
  "next": "^15.x",
  "@payloadcms/next": "^3.x",
  "@payloadcms/db-mongodb": "^3.x",
  "@payloadcms/richtext-lexical": "^3.x",
  "tailwindcss": "^3.x",
  "typescript": "^5.x"
}
```

### Step 2 — TypeScript + Next.js Config
- `tsconfig.json` — strict TS, path aliases (`@/*`)
- `next.config.ts` — withPayload wrapper
- `tailwind.config.ts` — content paths

### Step 3 — Payload Collections (src/collections/)

#### Users.ts
```ts
{
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [{ name: 'role', type: 'select', options: ['admin'] }]
}
```

#### Tags.ts
```ts
{
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }]
}
```

#### Media.ts
```ts
{
  slug: 'media',
  upload: { staticDir: '../public/media' },
  fields: [{ name: 'alt', type: 'text' }]
}
```

#### Methoden.ts (main collection)
```ts
{
  slug: 'methoden',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', admin: { position: 'sidebar' }, hooks: { beforeValidate: [autoSlug] } },
    { name: 'description', type: 'richText' },
    { name: 'steps', type: 'array', fields: [{ name: 'step', type: 'text' }] },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'category', type: 'select', options: ['A', 'B', 'C'] },
    { name: 'difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: '_status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' }
  ]
}
```

### Step 4 — Payload Config (src/payload.config.ts)
```ts
buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: { user: Users.slug },
  collections: [Users, Tags, Media, Methoden],
  db: mongooseAdapter({ url: process.env.MONGODB_URI }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET,
})
```

### Step 5 — Payload App Routes (src/app/(payload)/)
Auto-generated files from `@payloadcms/next`:
- `admin/[[...segments]]/page.tsx`
- `admin/[[...segments]]/not-found.tsx`
- `api/[...slug]/route.ts`
- `layout.tsx`
- `importMap.ts`

### Step 6 — Frontend Pages (src/app/(frontend)/)

#### layout.tsx
Global layout with Tailwind, fonts.

#### page.tsx (Method Overview `/`)
Server Component:
```ts
const data = await payload.find({
  collection: 'methoden',
  where: { _status: { equals: 'published' } },
  depth: 2,
})
// Pass to client FilterableMethodList component
```

#### methoden/[slug]/page.tsx (Method Detail)
```ts
const method = await payload.find({
  collection: 'methoden',
  where: { slug: { equals: params.slug } }
})
```

#### cart/page.tsx (Cart)
Client Component — reads from localStorage, renders saved methods.

### Step 7 — Components (src/components/)

- `MethodCard.tsx` — card with title, category, difficulty, tags, "Save" button
- `TagFilter.tsx` — client component, filter bar (category / difficulty / tag)
- `FilterableMethodList.tsx` — client component wrapping MethodCard grid + TagFilter
- `CartButton.tsx` — add/remove from cart (localStorage)
- `RichTextRenderer.tsx` — renders Payload lexical rich text
- `CartExport.tsx` — JSON export button

### Step 8 — Cart Logic (src/lib/cart.ts)
```ts
export type CartItem = { id: string; slug: string; title: string }

export function getCart(): CartItem[] {
  // parse localStorage['uk-cart']
}
export function addToCart(item: CartItem): void {}
export function removeFromCart(id: string): void {}
export function isInCart(id: string): boolean {}
```

Hook: `src/hooks/useCart.ts` — useState + useEffect for SSR safety.

### Step 9 — Seed Script (seed.ts)
Standalone Node.js script, uses Payload's local API:
```ts
import payload from 'payload'
// Create 10 sample methods with varied categories/difficulties/tags
```
Run via: `npx ts-node --project tsconfig.json seed.ts`

### Step 10 — Docker Setup

#### Dockerfile
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [mongodb]
    volumes:
      - ./public/media:/app/public/media
  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: urban-kit
volumes:
  mongodb_data:
```

#### .env.example
```env
MONGODB_URI=mongodb://mongodb:27017/urban-kit
PAYLOAD_SECRET=your-secret-here-min-32-chars
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=production
```

---

## Key Files

| File | Operation | Description |
|------|-----------|-------------|
| `package.json` | Create | All dependencies |
| `tsconfig.json` | Create | TypeScript config |
| `next.config.ts` | Create | withPayload wrapper |
| `tailwind.config.ts` | Create | Tailwind setup |
| `src/payload.config.ts` | Create | Payload CMS config |
| `src/collections/Users.ts` | Create | Auth users collection |
| `src/collections/Tags.ts` | Create | Tags collection |
| `src/collections/Media.ts` | Create | Media uploads |
| `src/collections/Methoden.ts` | Create | Main content collection |
| `src/app/(payload)/...` | Create | Payload admin routes |
| `src/app/(frontend)/layout.tsx` | Create | Global layout |
| `src/app/(frontend)/page.tsx` | Create | Method overview |
| `src/app/(frontend)/methoden/[slug]/page.tsx` | Create | Method detail |
| `src/app/(frontend)/cart/page.tsx` | Create | Cart/comparison page |
| `src/components/MethodCard.tsx` | Create | Method card |
| `src/components/TagFilter.tsx` | Create | Filter bar |
| `src/components/FilterableMethodList.tsx` | Create | Client grid + filters |
| `src/components/CartButton.tsx` | Create | Add/remove cart |
| `src/components/RichTextRenderer.tsx` | Create | Lexical renderer |
| `src/lib/cart.ts` | Create | Cart localStorage logic |
| `src/hooks/useCart.ts` | Create | Cart React hook |
| `seed.ts` | Create | 10 dummy methods |
| `Dockerfile` | Create | Multi-stage build |
| `docker-compose.yml` | Create | App + MongoDB |
| `.env.example` | Create | Environment template |
| `.dockerignore` | Create | Docker ignore rules |
| `.gitignore` | Create | Git ignore rules |

---

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Payload v3 API changes | Pin to specific minor version in package.json |
| SSR hydration mismatch for cart | Use `useEffect` to read localStorage only client-side |
| MongoDB connection in Docker | Use service name `mongodb` in MONGODB_URI |
| Payload admin 500 on first run | Ensure PAYLOAD_SECRET is set and DB is reachable |
| Slug uniqueness | Add `unique: true` constraint on slug field |
| Rich text serialization | Use `@payloadcms/richtext-lexical/react` JSX converter |

---

## Build Order

Execute these steps in sequence to avoid import errors:

1. `package.json` + lock file
2. `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
3. Collections (`src/collections/`)
4. `src/payload.config.ts`
5. Payload routes (`src/app/(payload)/`)
6. Frontend layout + globals (`src/app/(frontend)/layout.tsx`, `globals.css`)
7. Cart logic + hook (`src/lib/cart.ts`, `src/hooks/useCart.ts`)
8. Components
9. Frontend pages
10. Seed script
11. Docker files

---

## SESSION_ID
- CODEX_SESSION: N/A (CCG not available — plan generated by Claude)
- GEMINI_SESSION: N/A

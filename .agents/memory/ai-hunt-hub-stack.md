---
name: AI Hunt Hub Stack
description: Architecture overview for the AI Hunt Hub app — routes, auth, DB, codegen, seeding
---

# AI Hunt Hub Architecture

## Monorepo layout
- `artifacts/api-server` — Express 5 + Clerk + Drizzle ORM + Pino logging
- `artifacts/ai-hunt-hub` — React 19 + Vite + Clerk + TanStack Query + Tailwind v4 + framer-motion
- `lib/db` — Drizzle schema (users, tools, categories, tags, reviews, bookmarks, blog_posts, news, newsletter, reports)
- `lib/api-spec` — OpenAPI spec + orval codegen → `lib/api-client-react` + `lib/api-zod`

## Key commands
- `pnpm --filter @workspace/api-spec run codegen` — regenerate React Query hooks from OpenAPI
- `pnpm --filter @workspace/db run push` — push schema to Postgres
- Seeds run via `executeSql` directly (no seed script in workspace)

## Auth
- Replit-managed Clerk (provisioned via setupClerkWhitelabelAuth)
- API uses `@clerk/express` clerkMiddleware + custom requireAuth/requireAdmin helpers
- Frontend uses `@clerk/react` with proxy setup via clerkProxyMiddleware
- Cookie-based auth for web (no bearer tokens on frontend)

## Data seeded
- 12 categories, 8 tools (ChatGPT, Claude, Midjourney, GitHub Copilot, DALL-E 3, Runway ML, Notion AI, Perplexity AI)

**Why:** Documenting for future sessions so architecture doesn't need re-discovery.

**How to apply:** When changing routes, schema, or auth — check these files first.

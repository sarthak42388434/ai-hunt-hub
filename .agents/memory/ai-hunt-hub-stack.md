---
name: AI Hunt Hub stack
description: Architecture decisions, fixed bugs, and non-obvious constraints for the AI Hunt Hub project.
---

## Architecture

- **API server**: `artifacts/api-server` — Express 5, Clerk middleware (`@clerk/express`), routes in `src/routes/`, Drizzle ORM queries.
- **Frontend**: `artifacts/ai-hunt-hub` — React 19 + Vite, `@clerk/react`, Orval-generated hooks from `@workspace/api-client-react`, wouter routing with `base={basePath}`.
- **DB**: Replit-managed Postgres. Schema in `lib/db/src/schema/`. Push with `pnpm --filter @workspace/db run push`.
- **API client**: `lib/api-client-react` — Orval-generated hooks. Re-run codegen after every spec change: `pnpm --filter @workspace/api-spec run codegen`.
- **Zod schemas**: `lib/api-zod` — used by api-server routes for validation.

## Fixed Bugs

1. **Duplicate `export *` in barrel files** — `lib/api-client-react/src/index.ts` and `lib/api-zod/src/index.ts` had each of their `export *` lines duplicated, causing TS2308 compile errors. Fixed by removing the duplicate lines.
2. **Missing Clerk secrets** — Clerk was `not_configured`; fixed by calling `setupClerkWhitelabelAuth()` to provision `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`.
3. **Skeleton workspace** — the workspace only had a health-check skeleton; the full project (all routes, DB schema, frontend pages, components, generated client) was copied from the GitHub repo at `/tmp/ai-hunt-hub-full`.

## Key Constraints

- `clerkMiddleware` uses `publishableKeyFromHost` — required for multi-domain Clerk proxy support. Do not replace with raw env var.
- `VITE_CLERK_PROXY_URL` is intentionally empty in dev — proxy is production-only. Do not set it in dev.
- Clerk "development keys" console warning is expected behavior, not an error.
- Route `GET /bookmarks/check/:toolId` comes after `DELETE /bookmarks/:toolId` — this is fine because Express matches by both method AND path; they never conflict.
- The `@clerk/react` peer dep warnings about React 19.1.0 not matching `~19.0.3 || ~19.1.4` are harmless; the library works correctly.

## Response shapes (critical for `.map()` safety)

- `GET /tools` → `PaginatedTools` `{ tools, total, page, limit }` — access `.tools.map()`
- `GET /tools/featured|trending|newest|free` → `Tool[]` — direct `.map()`
- `GET /users/me/submitted-tools` → `Tool[]` — direct `.map()`
- `GET /bookmarks` → `Bookmark[]` — direct `.map()`
- `GET /tools/:id/reviews` → `PaginatedReviews` `{ reviews, total, page, limit }` — access `.reviews.map()`
- `GET /admin/tools` → `PaginatedTools` — access `.tools.map()`
- `GET /home` → `HomeData` with named arrays (`featuredTools`, `trendingTools`, etc.)

**Why:** Orval generates typed hooks that return the full response shape. Any page that calls `.map()` directly on a paginated response object will get `e?.map is not a function`.

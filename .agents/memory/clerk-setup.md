---
name: Clerk Setup
description: Clerk auth status and expected dev-environment behavior
---

# Clerk Auth — AI Hunt Hub

## Status
- Replit-managed Clerk provisioned via `setupClerkWhitelabelAuth()`
- Secrets set: CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY

## Expected dev behavior (NOT bugs)
- Console warning "Clerk has been loaded with development keys" — always present in dev, harmless
- pk_test keys in environment — correct for development

## Frontend wiring
- `publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)` from `@clerk/react/internal`
- `proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}` — empty in dev, auto-set in prod
- Sign-in/sign-up routes: `/sign-in/*?` and `/sign-up/*?` (wouter optional wildcard required)
- ThemeProvider defaultTheme="dark"

**Why:** These exact patterns must not be changed — deviations break prod proxy or OAuth callbacks.

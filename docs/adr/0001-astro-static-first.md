# 0001 — Astro, static-first, one serverless function

- **Status:** Accepted
- **Date:** 2026-09-30

## Context

The site is a portfolio: a handful of pages and case studies that change a few times a month, plus a contact
form. It is also evidence of how I work, so it has to be fast, accessible and cheap to run indefinitely.
My day-to-day framework is Next.js.

## Decision

Use **Astro** with `output: 'static'`. Every page is pre-rendered at build time. The only on-demand route is
`/api/contact` (`prerender = false`), deployed as a single function.

## Alternatives considered

- **Next.js (App Router).** Familiar and capable, but it ships a React runtime for what is mostly static
  content, and its strengths (server components, data fetching, ISR) solve problems this site doesn't have.
- **A plain static generator (11ty, Hugo).** Lighter still, but weaker TypeScript integration and no typed
  content collections.

## Consequences

- Zero JavaScript by default; behaviour is opted into per page. Lighthouse holds 95+ in every category.
- Hosting is a CDN plus one function, effectively free.
- Picking the tool that fits rather than the familiar one is the same call I make on client projects.
- Any future dynamic feature must justify becoming an on-demand route.

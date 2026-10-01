# 0006 — Hosting on Vercel

- **Status:** Accepted, with a revisit trigger
- **Date:** 2026-10-01

## Context

The site needs a CDN for static files, one Node function, preview deployments per pull request, and zero cost.

## Decision

Host on Vercel's free plan via `@astrojs/vercel`.

## Alternatives considered

- **Cloudflare Workers/Pages.** Equally capable and free; the Astro adapter swap is small.
- **Netlify.** Similar trade-offs.

## Consequences

- Preview URLs on every PR and zero-config deploys from `main`.
- **Known issue:** Vercel's platform-level DDoS mitigation blocks Meta's link-preview crawler on free plans, so
  links shared on Facebook, Messenger and Instagram show no preview. Custom firewall rules can't override it.
  LinkedIn, X, Slack and search engines are unaffected.

## Revisit when

Meta-platform previews matter, or the free plan's limits are reached. Moving to Cloudflare means swapping the
adapter, porting `src/pages/api/contact.ts` to the Workers runtime, and re-pointing the header integration.
Everything else is static output and moves unchanged.

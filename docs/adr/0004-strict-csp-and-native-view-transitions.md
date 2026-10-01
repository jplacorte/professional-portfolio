# 0004 — Hash-based CSP; native view transitions over ClientRouter

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

The site had no Content Security Policy or hardening headers. Astro 7 can generate a CSP that allows each
script and style by its SHA-256 hash. When it was enabled, a real-browser test found violations:

1. Astro's `<ClientRouter />` (used for the animated title morph between pages) injects styles and scripts
   that a hash-based policy blocks. Astro documents the two as incompatible.
2. The pre-paint theme script is `is:inline`, so Astro does not hash it.
3. Vite inlines small font subsets as `data:` URIs.

## Decision

- Enable Astro's CSP (`src/config/security.ts`), served as an HTTP header via the Vercel adapter's
  `staticHeaders`. `script-src` contains `'self'`, Turnstile's origin and hashes only, with no `'unsafe-inline'`.
- **Replace `<ClientRouter />` with native cross-document View Transitions** (`@view-transition { navigation: auto }`
  plus `view-transition-name` on project titles).
- Render the theme script from a single constant (`src/lib/theme.ts`) and add its hash to the policy from that
  same constant, so code and hash can't drift.
- Allow `data:` for fonts, and `'unsafe-inline'` for style _attributes_ only (`style-src-attr`).
- Add HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` and COOP to every route
  through a small integration that edits Vercel's build output (`integrations/security-headers.ts`).

## Alternatives considered

- **Keep ClientRouter and add `'unsafe-inline'` to `script-src`.** Rejected: it disables the main protection a
  CSP offers against injected script.
- **Nonces.** They need a server to generate a fresh value per response, which conflicts with static pre-rendering.
- **No CSP.** Rejected: it's cheap to do well here, and reviewers check for it.

## Consequences

- No router JavaScript; each navigation is a real page load, which removed the re-initialise-on-swap code in
  every client script.
- Animated page transitions work in Chrome, Edge and Safari; other browsers navigate normally.
- Header persistence across navigations is gone, which isn't noticeable since every page renders the same header.
- `tests/e2e/security.spec.ts` asserts the headers and that injected inline scripts are blocked; every E2E test
  fails on any CSP violation.

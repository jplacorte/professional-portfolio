# 0005 — Contact form: Resend + Turnstile behind a pure handler

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

The contact form is the only code that accepts input from the internet and the only server-side code. It must
be spam-resistant, work without JavaScript, never leak secrets, and be testable without network access.

## Decision

- **Delivery:** Resend's REST API via `fetch` (no SDK). **Spam:** a honeypot field plus Cloudflare Turnstile,
  verified server-side and failing closed.
- **Structure:** the route (`src/pages/api/contact.ts`) is a thin HTTP adapter. The workflow lives in
  `src/lib/contact/handler.ts` as a function with injected dependencies (`verifyHuman`, `send`, `log`), so
  every path (413, 415, 400, bot, 403, 503, 502, success) is unit-tested.
- **Hardening:** Astro's `checkOrigin` rejects cross-site posts (CSRF); 16 KB body limit; form content types
  only; Zod schema that collapses line breaks in single-line fields (no email-header injection); HTML escaping
  in the notification; 5–8 s timeouts on outbound calls; `Cache-Control: no-store`.
- **Progressive enhancement:** JSON for `fetch()` submissions, a 303 redirect for plain form posts.

## Alternatives considered

- **Form services (Formspree, Netlify Forms).** Less code, but a third party sees every message and the
  behaviour can't be tested or tuned.
- **Per-IP rate limiting.** Needs a shared store (KV/Redis) on serverless. Deferred: Turnstile already makes
  abuse expensive. A Vercel Firewall rate-limit rule is the first step if it's ever needed.

## Consequences

- Visitors never see provider errors; the server logs a capped, specific reason for diagnosis.
- Without keys (local dev), the endpoint answers 503 instead of failing obscurely.
- Sending is limited to Resend's test sender until a custom domain is verified.
